import "../../shared/browser";
import TabActions from "./tab_actions";
import Tabs from "../../shared/tabs_api";
import Storage from "../../shared/storage_api";
import Privacy from "../../shared/privacy_api";
import WebNavigation from "../../shared/webNavigation_api";
import ContentSettings from "../../shared/contentSettings_api";
import {reflect, MessageResponse, getUrl, asyncWait} from "../../shared/utils";
import store from "./store";
import {getUserInformation} from "../../shared/actions/user";

import {InitialiseConnectionOverlay, UpdateConnectionOverlay, DeleteConnectionOverlay} from "../../shared/actions/connectionOverlay";

const execActionList = async (tabId, actions, values) => {
  let frameId = 0;
  for (let i = 0; i < actions.length; i++){
    const state = store.getState();
    if (!state.connectionOverlay[tabId])
      throw 'Connection overlay closed';
    store.dispatch(UpdateConnectionOverlay({
      tabId: tabId,
      steps: actions.length,
      currentStep: i + 1
    }));
    if (actions[i].action === 'enterFrame'){
      const src = await TabActions['getAttr']({tabId, frameId}, {selector : actions[i].search, attr: 'src'});
      const url = src.split('?')[0];
      const frames = await WebNavigation.getAllFrames({tabId: tabId});
      console.log('frames', frames);
      const frame = frames.find((frame) => {return frame.url.indexOf(url) !== -1});
      if (!!frame)
        frameId = frame.frameId;
      else
        throw 'enterFrame could not find frame';
    } else if (actions[i].action === 'exitFrame')
      frameId = 0;
    else if (!!TabActions[actions[i].action]) {
      console.log('action:', actions[i]);
      const grave = !!actions[i].grave;
      const response = await reflect(TabActions[actions[i].action]({tabId, frameId}, actions[i], values));
      console.log('action response:', response);
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

const setAccountDisconnected = async ({websiteName}) => {
  const store = await Storage.local.get(null);
  store.connectedAccounts[websiteName] = undefined;
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

const connectSimpleAccount = async ({websiteData, active_tab}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.home).hostname;

  let checkAlreadyLogged;
  let tab = await Tabs.create({url: websiteData.website.home, active: active_tab});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: websiteName
  }));
  const isConnected = await isAccountConnected({
    websiteName: hostname,
    account: websiteData.user
  });
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, websiteData.website.checkAlreadyLogged, websiteData.user));
  checkAlreadyLogged = !checkLogged.error;
  if (isConnected && checkAlreadyLogged)
    return tab;
  if (checkAlreadyLogged) {
    console.log('deconnection');
    try {
      await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
      tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
    } catch (e) {
      store.dispatch(DeleteConnectionOverlay({
        tabId: tab.id
      }));
      throw e;
    }
  }
  console.log('connection');
  try {
    await execActionList(tab.id, websiteData.website.connect.todo, websiteData.user);
  } catch (e){
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    throw e;
  }
  console.log('connection worked');
  await setSimpleAccountConnected({websiteName: hostname, account: websiteData.user});
  return tab;
};

const connectLogWithAccount = async ({details, active_tab}) => {
  console.log('start logwith connect');
  const logwith = details[1];
  const primaryAccount = details[0];
  let url = getUrl(logwith.website.home);
  const setting = {
    primaryPattern: `${url.protocol}//${url.hostname}/*`,
    setting: chrome.contentSettings.PopupsContentSetting.ALLOW
  };
  const isPrimaryAccountConnected = isAccountConnected({
    websiteName: getUrl(primaryAccount.website.home),
    account: primaryAccount.user
  });
  let tab;
  await ContentSettings.popups.set(setting);

  if (isPrimaryAccountConnected)
    tab = await Tabs.create({url: logwith.website.home});
  else
    tab = await connectSimpleAccount({websiteData: details[0], active_tab: active_tab});
  if (!isPrimaryAccountConnected){
    await asyncWait(20);
    tab = await Tabs.get(tab.id);
    if (tab.status !== 'complete')
      tab = await Tabs.waitLoading(tab.id);
    console.log('simple account connection finished');
  }
  console.log('avant goto');
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: logwith.website_name
  }));
  if (!isPrimaryAccountConnected)
    tab = await TabActions['goto']({tabId: tab.id}, {url: logwith.website.home});
  console.log("settings", setting);
  console.log('apres goto');
  let checkAlreadyLogged;
  console.log('checking is connected');
  const isConnected = await isLogwithAccountConnected({
    websiteName: url.hostname,
    logwithName: logwith.logWith,
    account: details[0].user
  });
  console.log('isConnected:', isConnected);
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, logwith.website.checkAlreadyLogged));
  console.log('checkAlreadyLogged result:', checkLogged);
  checkAlreadyLogged = !checkLogged.error;
  if (isConnected && checkAlreadyLogged)
    return tab;
  if (checkAlreadyLogged) {
    console.log('deconnection');
    try {
      await execActionList(tab.id, logwith.website.logout.todo);
    } catch (e) {
      store.dispatch(DeleteConnectionOverlay({
        tabId: tab.id
      }));
      throw e;
    }
  }
  console.log('connection');
  try {
    await execActionList(tab.id, logwith.website[logwith.logWith].todo);
  } catch (e) {
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    throw e;
  }
  console.log('connection worked');
  await setLogwithAccountConnected({
    websiteName: url.hostname,
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

const test_connection = async ({websiteData}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.home).hostname;

  let checkAlreadyLogged;
  let tab = await Tabs.create({url: websiteData.website.home});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: websiteName
  }));
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, websiteData.website.checkAlreadyLogged, websiteData.user));
  checkAlreadyLogged = !checkLogged.error;
  if (checkAlreadyLogged) {
    console.log('deconnection');
    try {
      await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
      tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
    } catch (e) {
      store.dispatch(DeleteConnectionOverlay({
        tabId: tab.id
      }));
      throw e;
    }
  }
  console.log('connection');
  try {
    await execActionList(tab.id, websiteData.website.connect.todo, websiteData.user);
  } catch (e){
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    throw e;
  }
  console.log('connection worked');
  await setSimpleAccountConnected({websiteName: hostname, account: websiteData.user});
  return tab;
};

const actions = {
  website_connection: async (data, sendResponse) => {
    const details = checkForVariableHomeSubdomains(data.detail);
    let connectionResponse = null;
    console.log('start website connection', data);
    console.log('test_conneciton', data.test_connection);
    const PasswordSavingDetails = await Privacy.passwordSaving.get();
    await Privacy.passwordSaving.set(false);
    if (!!data.test_connection)
      connectionResponse = await reflect(test_connection({websiteData: details[0]}));
    else if (details.length > 1)
      connectionResponse = await reflect(connectLogWithAccount({details: details, active_tab: data.highlight}));
    else
      connectionResponse = await reflect(connectSimpleAccount({websiteData: details[0], active_tab: data.highlight}));
    if (!connectionResponse.error) {
      store.dispatch(DeleteConnectionOverlay({
        tabId: connectionResponse.data.id
      }));
    }
    console.log('connection result', connectionResponse);
    console.log("storage", await Storage.local.get(null));

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
  },
  formSubmission: async (data, sendResponse) => {
    const {account, websiteName} = data;
    console.log('form submission detected !');
    console.log('account:', account, 'website:', websiteName);
    sendResponse(false, 'form received');
  },
  setAccountDisconnected: async (data, sendResponse) => {
    const {websiteName} = data;
    await setAccountDisconnected({
      websiteName: websiteName
    });
    sendResponse(false, 'account is set disconnected');
  },
  setAccountConnected: async (data, sendResponse) => {
    const {websiteName, account} = data;

    await setSimpleAccountConnected({
      websiteName:websiteName,
      account: account
    });
    sendResponse(false, "account is set connected");
  },
  getUser: async (data, sendResponse) => {
    store.dispatch(getUserInformation());
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

browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (!!actions[request.type]){
        console.log(request);
        actions[request.type](request.data, sendResponse);
        return true;
      } else if (request.type === 'getTabId') {
        sendResponse(MessageResponse(false, sender.tab.id));
      }
    }
);