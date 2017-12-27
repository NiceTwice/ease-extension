import "../../shared/browser";
import TabActions from "./tab_actions";
import Tabs from "../../shared/tabs_api";
import Storage from "../../shared/storage_api";
import Privacy from "../../shared/privacy_api";
import WebNavigation from "../../shared/webNavigation_api";
import {reflect} from "../../shared/utils";
import {MessageResponse} from "../../shared/utils";

const websiteActions = {
  connection: ({websiteName, tabId, steps, values}) => {

  },
  logout: ({websiteName, tabId, steps, values}) => {

  },
  checkAlreadyLogged: ({websiteName, tabId, steps, values}) => {

  }
};

const execActionList = async (tabId, actions, values) => {
  let frameId = 0;
  for (let i = 0; i < actions.length; i++){
    if (actions[i].action === 'enterFrame'){
      const src = await TabActions['getAttr']({tabId, frameId}, {selector : actions[i].search, attr: 'src'});
      const frames = await WebNavigation.getAllFrames({tabId: tabId});
      const frame = frames.find((frame) => {return frame.url.indexOf(src) !== -1});
      if (!!frame)
        frameId = frame.frameId;
      else
        throw 'enterFrame could not find frame';
    } else if (actions[i].action === 'exitFrame')
      frameId = 0;
    else if (!!TabActions[actions[i].action]) {
      const grave = !!actions[i].grave;
      const response = await reflect(TabActions[actions[i].action]({tabId, frameId}, actions[i], values));
      if (actions[i].action === 'search' && response.error)
        throw response.data;
      else if (response.error && grave)
        throw response.data;
    }
    else if (!actions[i].action && !!actions[i].search)
      await TabActions['search']({tabId, frameId}, actions[i]);
  }
};

const isAccountConnected = async ({websiteName, account}) => {
  const store = await Storage.local.get(null);
  const connectInformation = store.connectedAccounts[websiteName];
  return !!connectInformation && !!connectInformation.accounts.find(acc => (acc.login === account.login));
};

const setSimpleAccountConnected = async ({websiteName, account}) => {
  const store = await Storage.local.get(null);
  store.connectedAccounts[websiteName] = {
    logwith: {
      active: false,
      logwithName: '',
      account: null
    },
    accounts: [account]
  };
  return await Storage.local.set(store);
};

const setLogwithAccountConnected = async ({websiteName, logwithName, account}) => {
  const store = await Storage.local.get(null);
  store.connectedAccounts[websiteName] = {
    logwith: {
      active: true,
      logwithName: logwithName,
      account: account
    },
    accounts: []
  };
  return await Storage.local.set(store);
};

const isLogwithAccountConnected = async ({websiteName, logwithName, account}) => {
  const store = await Storage.local.get(null);
  const connectInformation = store.connectedAccounts[websiteName];
  return !!connectInformation &&
      connectInformation.logwith.active &&
      connectInformation.logwith.logwithName === logwithName &&
      connectInformation.logwith.account.login === account.login;
};

const connection = {
  logwith: {
    active: false,
    logwithName: '',
    account: null
  },
  accounts: [{}]
};

const connectSimpleAccount = async ({websiteData}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  let checkAlreadyLogged;
  let tab = await Tabs.create({url: websiteData.website.home});
  const isConnected = await isAccountConnected({
    websiteName: websiteName,
    account: websiteData.user
  });
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, websiteData.website.checkAlreadyLogged, websiteData.user));
  checkAlreadyLogged = !checkLogged.error;
  if (isConnected && checkAlreadyLogged)
    return tab;
  if (checkAlreadyLogged) {
    console.log('deconnection');
    await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
    tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
  }
  console.log('connection');
  await execActionList(tab.id, websiteData.website.connect.todo, websiteData.user);
  console.log('connection worked');
  await setSimpleAccountConnected({websiteName: websiteName, account: websiteData.user});
  return tab;
};

const connectLogWithAccount = async ({details}) => {
  console.log('start logwith connect');
  let tab = await connectSimpleAccount({websiteData: details[0]});
  tab = await Tabs.get(tab.id);
  if (tab.status !== 'complete')
    tab = await Tabs.waitLoading(tab.id);
  console.log('simple account connection finished');
  const logwith = details[1];
  console.log('avant goto');
  tab = await TabActions['goto']({tabId: tab.id}, {url: logwith.website.home});
  console.log('apres goto');
  let checkAlreadyLogged;
  console.log('checking is connected');
  const isConnected = await isLogwithAccountConnected({
    websiteName: logwith.website_name,
    logwithName: logwith.logWith,
    account: details[0].user
  });
  console.log('isConnected:', isConnected);
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, logwith.website.checkAlreadyLogged));
  console.log('checkAlreadyLogged result:', checkLogged);
  checkAlreadyLogged = !checkLogged.error;
  if (isConnected && checkAlreadyLogged)
    return;
  if (checkAlreadyLogged) {
    console.log('deconnection');
    await execActionList(tab.id, logwith.website.logout.todo);
    tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
  }
  console.log('connection');
  await execActionList(tab.id, logwith.website[logwith.logWith].todo);
  console.log('connection worked');
  await setLogwithAccountConnected({
    websiteName: logwith.websiteName,
    logwithName: logwith.logWith,
    account: details[0].user
  });
  return tab;
};

const checkForVariableHomeSubdomains = (details) => {
  return details.map(detail => {
    if (typeof detail.website.home === 'object'){
      const home = detail.website.home;
      detail.website.home = `${home.http}${detail.user[home.subdomain]}.${home.domain}`;
    }
    return detail;
  });
};

const actions = {
  website_connection: async (data, sendResponse) => {
    const details = checkForVariableHomeSubdomains(data.detail);
    let connectionResponse = null;

    console.log('start website connection', details);
    const PasswordSavingDetails = await Privacy.passwordSaving.get();
    await Privacy.passwordSaving.set(false);
    if (details.length > 1)
      connectionResponse = await reflect(connectLogWithAccount({details: details}));
    else
      connectionResponse = await reflect(connectSimpleAccount({websiteData: details[0]}));
    console.log('connection result', connectionResponse);
    await Privacy.passwordSaving.set(PasswordSavingDetails.value);
    sendResponse(MessageResponse(false, 'connection finished'));
  },
  getHomePage: async (data, sendResponse) => {
    const store = await Storage.local.get(null);
    const homepage = store.settings.homepage;
    sendResponse(MessageResponse(false, homepage));
  },
  setHomePage: async (data, sendResponse) => {
    const store = await Storage.local.get(null);

    store.settings.homepage = data;
    await Storage.local.set(store);
    sendResponse(false, 'Homepage setting changed');
  }
};

browser.runtime.onMessageExternal.addListener(
    (request, sender, sendResponse) => {
      if (!!actions[request.type]){
        console.log(request);
        actions[request.type](request.data, sendResponse);
        return true;
      }
    }
);