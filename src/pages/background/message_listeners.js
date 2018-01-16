import "../../shared/browser";
import TabActions from "./tab_actions";
import Tabs from "../../shared/tabs_api";
import Storage from "../../shared/storage_api";
import Privacy from "../../shared/privacy_api";
import Cookies from "../../shared/cookies_api";
import WebNavigation from "../../shared/webNavigation_api";
import ContentSettings from "../../shared/contentSettings_api";
import {reflect, MessageResponse, getUrl, asyncWait} from "../../shared/utils";
import store from "./store";
import get_api from "../../shared/ease_get_api";
import {getUserInformation} from "../../shared/actions/user";
import {getProfiles} from "../../shared/actions/dashboard";
import {InitialiseConnectionOverlay, UpdateConnectionOverlay, DeleteConnectionOverlay} from "../../shared/actions/connectionOverlay";
import {setCurrentTab, getCatalogWebsites} from "../../shared/actions/common";
import {scrapChrome} from "./google";
import {deleteScrapingChromeOverlay, showScrapingChromeOverlay} from "../../shared/actions/scraping";

const execActionList = async (tabId, actions, values, noOverlay) => {
  let frameId = 0;
  for (let i = 0; i < actions.length; i++){
    const state = store.getState();
    if (!noOverlay && !state.connectionOverlay[tabId])
      throw 'Connection overlay closed';
    if (!noOverlay)
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
  return (!!connectInformation && !!connectInformation.accounts.find(acc => (acc.login === account.login)));
};

const setSimpleAccountConnected = async ({websiteName, account, website}) => {
  const store = await Storage.local.get(null);
  store.connectedAccounts[websiteName] = {
    logwith: {
      active: false,
      logwithName: '',
      account: null
    },
    website: website,
    accounts: [account]
  };
  return await Storage.local.set(store);
};

const setAccountDisconnected = async ({websiteName}) => {
  const store = await Storage.local.get(null);
  store.connectedAccounts[websiteName] = undefined;
  return await Storage.local.set(store);
};

const setLogwithAccountConnected = async ({websiteName, logwithName, account, website}) => {
  const store = await Storage.local.get(null);
  store.connectedAccounts[websiteName] = {
    logwith: {
      active: true,
      logwithName: logwithName,
      account: account
    },
    website: website,
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

const connectSimpleAccount = async ({websiteData, active_tab, current_tab}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.loginUrl).hostname;

  let checkAlreadyLogged;
  let tab = current_tab;
  if (!tab)
    tab = await Tabs.create({url: websiteData.website.home, active: active_tab});
  else
    tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
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
  await setSimpleAccountConnected({
    websiteName: hostname,
    account: websiteData.user,
    website: websiteData.website
  });
  return tab;
};

const connectLogWithAccount = async ({details, active_tab, current_tab}) => {
  console.log('start logwith connect');
  const logwith = details[1];
  const primaryAccount = details[0];
  let url = getUrl(logwith.website.loginUrl);
  const isPrimaryAccountConnected = await isAccountConnected({
    websiteName: getUrl(primaryAccount.website.loginUrl).hostname,
    account: primaryAccount.user
  });
  console.log('primary account connected ?', isPrimaryAccountConnected);

  let tab = current_tab;
  if (isPrimaryAccountConnected)
    if (!tab)
      tab = await Tabs.create({url: logwith.website.home});
    else
      tab = await TabActions.goto({tabId: tab.id}, {url: logwith.website.home});
  else {
    tab = await connectSimpleAccount({websiteData: details[0], active_tab: active_tab, current_tab: tab});
  }
  if (!isPrimaryAccountConnected){
    await asyncWait(20);
    tab = await Tabs.waitLoading(tab.id);
    console.log('simple account connection finished');
  }
  console.log('avant goto');
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: logwith.website_name
  }));
  console.log('lala');
  if (!isPrimaryAccountConnected)
    tab = await TabActions['goto']({tabId: tab.id}, {url: logwith.website.home});
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
  await ContentSettings.popups.set({
    primaryPattern: `${url.protocol}//${url.hostname}/*`,
    setting: chrome.contentSettings.PopupsContentSetting.ALLOW
  });
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
    account: details[0].user,
    website: logwith.website
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
  await setSimpleAccountConnected({websiteName: hostname, account: websiteData.user, website: websiteData.website});
  return tab;
};

const disconnect_account = async ({website, hostname}) => {
  const tab = await Tabs.create({
    url: website.home,
    active: false
  });
  const checkLogged = await reflect(execActionList(tab.id, website.checkAlreadyLogged, null, true));
  if (!checkLogged.error)
    await execActionList(tab.id, website.logout.todo, null, true);
  await setAccountDisconnected({
    websiteName: hostname
  });
};

const actions = {
  website_connection: async (data, sendResponse) => {
    const details = checkForVariableHomeSubdomains(data.detail);
    let connectionResponse = null;
    console.log('start website connection', data);
    console.log('test_conneciton', data.test_connection);
    await Privacy.passwordSaving.set(false);
    await Privacy.autofill.set(false);
    if (!!data.test_connection)
      connectionResponse = await reflect(test_connection({
        websiteData: details[0]
      }));
    else if (details.length > 1)
      connectionResponse = await reflect(connectLogWithAccount({
        details: details,
        active_tab: data.highlight,
        current_tab: data.tab}));
    else
      connectionResponse = await reflect(connectSimpleAccount({
        websiteData: details[0],
        active_tab: data.highlight,
        current_tab: data.tab}));
    if (!connectionResponse.error) {
      store.dispatch(DeleteConnectionOverlay({
        tabId: connectionResponse.data.id
      }));
      let tab = connectionResponse.data;
      tab = await Tabs.get(tab.id);
      if (tab.status !== 'complete')
        await Tabs.waitLoading(tab.id);
    }
    await Privacy.passwordSaving.set(true);
    await Privacy.autofill.set(true);
    sendResponse(MessageResponse(false, 'connection finished'));
  },
  generalLogout: async (data, sendResponse) => {
    const storage = await Storage.local.get(null);
    const accounts = storage.connectedAccounts;

    const calls = Object.keys(accounts).map(hostname => {
      return disconnect_account({
        hostname: hostname,
        website: accounts[hostname].website
      });
    });
    await Promise.all(calls.map(reflect));
    sendResponse(MessageResponse(false, 'General logout finished'));
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
    sendResponse(MessageResponse(false, 'Homepage setting changed'));
  },
  formSubmission: async (data, sendResponse) => {
    const {account, websiteName} = data;
    console.log('form submission detected !');
    console.log('account:', account, 'website:', websiteName);
    sendResponse(MessageResponse(false, 'form received'));
  },
  setAccountDisconnected: async (data, sendResponse) => {
    const {websiteName} = data;
    await setAccountDisconnected({
      websiteName: websiteName
    });
    sendResponse(MessageResponse(false, 'account is set disconnected'));
  },
  setAccountConnected: async (data, sendResponse) => {
    const {websiteName, account} = data;

    await setSimpleAccountConnected({
      websiteName:websiteName,
      account: account
    });
    sendResponse(MessageResponse(false, "account is set connected"));
  },
  getUser: async (data, sendResponse) => {
    const resp = await reflect(store.dispatch(getUserInformation()));
    sendResponse(MessageResponse(resp.error, resp.data));
  },
  getCatalogWebsites: async (data, sendResponse) => {
    const resp = await reflect(store.dispatch(getCatalogWebsites()));
    sendResponse(MessageResponse(resp.error, resp.data));
  },
  getProfiles: async (data, sendResponse) => {
    const resp = await reflect(store.dispatch(getProfiles()));
    sendResponse(MessageResponse(resp.error, resp.data));
  },
  setCurrentTab:  async (data, sendResponse) => {
    const tab = await store.dispatch(setCurrentTab());
    sendResponse(MessageResponse(false, tab));
  },
  getCurrentTab: async (data, sendResponse) => {
    const resp = await reflect(Tabs.query({
      currentWindow: true,
      active: true
    }));
    if (resp.error)
      sendResponse(MessageResponse(resp.error, resp.data));
    else
      sendResponse(MessageResponse(resp.error, resp.data[0]));
  },
  getCookie: async (data, sendResponse) => {
    const {url, name} = data;

    const cookie = await Cookies.get({
      url: url,
      name: name
    });
    sendResponse(MessageResponse(false, cookie));
  },
  connect_tab: async (data, sendResponse) => {
    const {app_id, account_information, tab} = data;

    const connection_info = await get_api.getAppConnectionInformation({
      app_id: app_id
    });
    let json = {};
    json.detail = connection_info;
    json.tab = tab;
    json.detail[0].user = account_information;
    actions.website_connection(json, sendResponse);
  },
  scrapChrome: async (data, sendResponse) => {
    console.log('start scrapping chrome');
    console.log('values are:', data);
    await Privacy.passwordSaving.set(false);
    await Privacy.autofill.set(false);
    let tab = await Tabs.create({
      url: 'https://accounts.google.com/Logout',
      active: false
    });
    store.dispatch(showScrapingChromeOverlay({
      tabId: tab.id
    }));
    const response = await reflect(scrapChrome(data, tab));
    await Tabs.remove(tab.id);
    store.dispatch(deleteScrapingChromeOverlay({
      tabId: tab.id
    }));
    await Privacy.passwordSaving.set(true);
    await Privacy.autofill.set(true);
    console.log('scrapping result:', response);
    if (response.error && response.data.indexOf('Wrong') === -1)
      response.data = 'It seems you closed the tab. Please try again';
    sendResponse(MessageResponse(response.error, response.data));
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