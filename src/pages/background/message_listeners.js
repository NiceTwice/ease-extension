import queryString from "query-string";
import "../../shared/browser";
import TabActions from "./tab_actions";
import Tabs from "../../shared/tabs_api";
import Storage from "../../shared/storage_api";
import Privacy from "../../shared/privacy_api";
import Cookies from "../../shared/cookies_api";
import WebNavigation from "../../shared/webNavigation_api";
import ContentSettings from "../../shared/contentSettings_api";
import {reflect, extractRootDomain, extractHostname, MessageResponse, getUrl, asyncWait} from "../../shared/utils";
import store from "./store";
import get_api from "../../shared/ease_get_api";
import {getUserInformation, logout} from "../../shared/actions/user";
import {getProfiles} from "../../shared/actions/dashboard";
import {InitialiseConnectionOverlay, UpdateConnectionOverlay, DeleteConnectionOverlay, SetFirstConnection} from "../../shared/actions/connectionOverlay";
import {setCurrentTab, getCatalogWebsites} from "../../shared/actions/common";
import {scrapChrome} from "./google";
import {deleteScrapingChromeOverlay, showScrapingChromeOverlay} from "../../shared/actions/scraping";
import {showSavedUpdatePopup, closeSavedUpdatePopup} from "../../shared/actions/background-ui";
import {saveLogwithTabCookies, setLogwithHostnameCookies, saveTabCookies, setHostnameCookies, removeHostnameCookies} from "./cookies_management";
import {serverUrl} from "../../shared/strings";

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
    }
    else if (actions[i].action === 'exitFrame')
      frameId = 0;
    else if (!!TabActions[actions[i].action]) {
      console.log('action:', actions[i]);
      const grave = !!actions[i].grave;
      const response = await reflect(TabActions[actions[i].action]({tabId, frameId}, actions[i], values));
      console.log('action response:', response);
      if (response.error && grave)
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

const connectGoogle = async({websiteData, current_tab}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.loginUrl).hostname;

  console.log('google connection');
  let tab = current_tab;
  let redirect_url = websiteData.website.home;
  if (websiteData.website.website_name === 'Youtube')
    redirect_url += '/signin?action_handle_signin=true';
  const url = `https://accounts.google.com/AddSession?continue=${redirect_url}`;
  tab = await TabActions.goto({tabId: tab.id}, {url: url});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: websiteName
  }));
  const websiteInformation = await get_api.catalog.getWebsiteConnection({website_id: 65});
  console.log('connection');
  try {
    await execActionList(tab.id, websiteInformation[0].website.connect.todo, websiteData.user);
  } catch (e){
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    throw e;
  }
  await setSimpleAccountConnected({
    websiteName: hostname,
    account: websiteData.user,
    website: websiteData.website
  });
  console.log('connection worked');
  return tab;
};

const connectSimpleAccount = async ({websiteData, current_tab}) => {
  if (websiteData.website.sso === 'Google')
    return connectGoogle({
      websiteData: websiteData,
      current_tab: current_tab
    });
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.loginUrl).hostname;

  let checkAlreadyLogged;
  let tab = current_tab;
  /*  await removeHostnameCookies({
      url: websiteData.website.loginUrl
    });
    await setHostnameCookies({
      hostname: hostname,
      url: websiteData.website.loginUrl,
      login: websiteData.user.login
    });*/
  /*  if (!tab)
      tab = await Tabs.create({url: websiteData.website.home, active: active_tab});
    else*/
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
      store.dispatch(SetFirstConnection({
        tabId: tab.id,
        first_connection: true
      }));
      await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
      await Tabs.waitLoading(tab.id);
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


const pollingCookies = ({tabId, url, hostname, login}) => {
  console.log('start polling cookies');
  let stepCount = 0;
  let interval = setInterval(() => {
    saveTabCookies({
      login: login,
      hostname: hostname,
      url: url
    });
    stepCount++;
    if (stepCount === 10){
      console.log('stop polling cookies by timeout');
      clearInterval(interval);
      browser.webNavigation.onBeforeNavigate.removeListener(navigationListener);
      browser.tabs.onRemoved.removeListener(tabRemovedListener);
    }
  }, 300);
  const navigationListener = (details) => {
    if (details.tabId === tabId && details.frameId === 0){
      console.log('stop polling cookies');
      clearInterval(interval);
      browser.webNavigation.onBeforeNavigate.removeListener(navigationListener);
      browser.tabs.onRemoved.removeListener(tabRemovedListener);
    }
  };
  const tabRemovedListener = (tabid, removeInfo) => {
    if (tabId === tabid){
      console.log('stop polling cookies');
      clearInterval(interval);
      browser.webNavigation.onBeforeNavigate.removeListener(navigationListener);
      browser.tabs.onRemoved.removeListener(tabRemovedListener);
    }
  };
  browser.tabs.onRemoved.addListener(tabRemovedListener);
  browser.webNavigation.onBeforeNavigate.addListener(navigationListener);
};

const connectLogWithAccount = async ({details, current_tab}) => {
  console.log('start logwith connect');
  const logwith = details[1];
  const primaryAccount = details[0];
  let url = getUrl(logwith.website.loginUrl);
  const isPrimaryAccountConnected = await isAccountConnected({
    websiteName: getUrl(primaryAccount.website.loginUrl).hostname,
    account: primaryAccount.user
  });
  console.log('primary account connected ?', isPrimaryAccountConnected);
  await reflect(ContentSettings.popups.set({
    primaryPattern: `${url.protocol}//${url.hostname}/*`,
    setting: "allow"
  }));
  let tab = current_tab;
  if (isPrimaryAccountConnected)
  /*    if (!tab)
        tab = await Tabs.create({url: logwith.website.home});
      else*/
    tab = await TabActions.goto({tabId: tab.id}, {url: logwith.website.home});
  else {
    tab = await connectSimpleAccount({websiteData: details[0], current_tab: tab});
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
      store.dispatch(SetFirstConnection({
        tabId: tab.id,
        first_connection: true
      }));
      await execActionList(tab.id, logwith.website.logout.todo);
      await Tabs.waitLoading(tab.id);
      tab = await TabActions.goto({tabId: tab.id}, {url: logwith.website.home});
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

const test_connection = async ({websiteData, current_tab}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.home).hostname;

  if (websiteData.website.sso === 'Google')
    return connectGoogle({
      websiteData: websiteData,
      current_tab: current_tab
    });
  let checkAlreadyLogged;
  let tab = current_tab;
//  let tab = await Tabs.create({url: websiteData.website.home});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: websiteName
  }));
  tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, websiteData.website.checkAlreadyLogged, websiteData.user));
  checkAlreadyLogged = !checkLogged.error;
  if (checkAlreadyLogged) {
    console.log('deconnection');
    try {
      await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
      await Tabs.waitLoading(tab.id);
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

const disconnect_account = async ({website, hostname}) => {
  await removeHostnameCookies({
    url: website.loginUrl
  });
  await setAccountDisconnected({
    websiteName: hostname
  });
};

let current_connections = [];

export const actions = {
  /**  website_connection: async (data, sendResponse) => {
    await Promise.all([
      Privacy.passwordSaving.set(false),
      Privacy.autofill.set(false)
    ]);
    const details = checkForVariableHomeSubdomains(data.detail);
    console.log('current connections before', current_connections);
    details.map(item => {
      current_connections.push(item.website.website_name)
    });
    console.log('current connections after', current_connections);
    let connectionResponse = null;
    console.log('start website connection', data);
    console.log('test_conneciton', data.test_connection);
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
    details.map(item => {
      current_connections.splice(current_connections.indexOf(item.website.website_name), 1);
    });
    if (!connectionResponse.error){
      store.dispatch(DeleteConnectionOverlay({
        tabId: connectionResponse.data.id
      }));
    }
    if (!!current_connections.length)
      setTimeout(() => {
        Privacy.passwordSaving.set(true);
        Privacy.autofill.set(true);
      }, 1000);
    sendResponse(MessageResponse(false, 'connection finished'));
  },*/
  app_connection: async (data, sendResponse) => {
    const {app_id, active_tab, website} = data;
    console.log('app connection !');
    /*    if (!website.sso_id && !!current_connections.find(item => (website.name === item))){
          sendResponse(MessageResponse(true, 'there is already pending connection on this website'));
          return;
        }*/
    current_connections.push(website.name);
    let tab;
    if (!!data.tab)
      tab = data.tab;
    else
      tab = await Tabs.create({
        url: 'chrome-extension://hnacegpfmpknpdjmhdmpkmedplfcmdmp/pages/connection_transition.html',
        active: active_tab
      });
    console.log('tab creation');
    await Promise.all([
      reflect(Privacy.passwordSaving.set(false)),
      reflect(Privacy.autofill.set(false))
    ]);
    const connection_info = await get_api.getAppConnectionInformation({
      app_id: app_id
    });
    let json = {};
    json.tab = tab;
    json.detail = connection_info.map(item => {
      if (!!item.user)
        Object.keys(item.user).map(id => {
          item.user[id] = decipher(item.user[id]);
        });
      return item;
    });
    const details = checkForVariableHomeSubdomains(json.detail);
    let connectionResponse = null;
    console.log('start website connection', data);
    if (details.length > 1)
      connectionResponse = await reflect(connectLogWithAccount({
        details: details,
        active_tab: json.highlight,
        current_tab: json.tab}));
    else
      connectionResponse = await reflect(connectSimpleAccount({
        websiteData: details[0],
        active_tab: json.highlight,
        current_tab: json.tab}));
    console.log('connection finished', connectionResponse);
    current_connections.splice(current_connections.indexOf(website.name), 1);
    if (!connectionResponse.error){
      store.dispatch(DeleteConnectionOverlay({
        tabId: connectionResponse.data.id
      }));
    }
    if (!current_connections.length)
      setTimeout(() => {
        reflect(Privacy.passwordSaving.set(true));
        reflect(Privacy.autofill.set(true));
      }, 1000);
    sendResponse(MessageResponse(false, 'connection finished'));
  },
  test_website_connection: async (data, sendResponse) => {
    const {website_id, account_information} = data;
    const tab = await Tabs.create({
      url: 'chrome-extension://hnacegpfmpknpdjmhdmpkmedplfcmdmp/pages/connection_transition.html'
    });
    await Promise.all([
      reflect(Privacy.passwordSaving.set(false)),
      reflect(Privacy.autofill.set(false))
    ]);
    let connectionData = await get_api.catalog.getWebsiteConnection({
      website_id: website_id
    });
    connectionData.map(item => {
      current_connections.push(item.website.website_name)
    });
    connectionData[0].user = account_information;
    connectionData = checkForVariableHomeSubdomains(connectionData);
    const connectionResponse = await reflect(test_connection({
      websiteData: connectionData[0],
      current_tab: tab
    }));
    connectionData.map(item => {
      current_connections.splice(current_connections.indexOf(item.website.website_name), 1);
    });
    if (!connectionResponse.error){
      store.dispatch(DeleteConnectionOverlay({
        tabId: connectionResponse.data.id
      }));
    }
    if (!current_connections.length)
      setTimeout(() => {
        reflect(Privacy.passwordSaving.set(true));
        reflect(Privacy.autofill.set(true));
      }, 1000);
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
    store.dispatch(logout());
    sendResponse(MessageResponse(false, 'General logout finished'));
  },
  getHomePage: async (data, sendResponse) => {
    const store = await Storage.local.get(null);
    const homepage = store.settings.homepage;
    console.log('homepage',homepage);
    sendResponse(MessageResponse(false, homepage));
  },
  setHomePage: async (data, sendResponse) => {
    const store = await Storage.local.get(null);

    store.settings.homepage = data;
    await Storage.local.set(store);
    sendResponse(MessageResponse(false, 'Homepage setting changed'));
  },
  formSubmission: async (data, sendResponse, senderTab) => {
    let {account, hostname, url, origin} = data;
    if (url.indexOf('google.com') !== -1){
      const query = queryString.parseUrl(url);
      console.log('query is', query);
      if (!!query.query.continue)
        url = query.query.continue;
    }
    console.log('form submission detected');
    const requestResponse = await reflect(get_api.updates.send({
      url: url,
      account_information: account
    }));
    if (requestResponse.error || !requestResponse.data.length){
      sendResponse(MessageResponse(true, 'no updates detected'));
      return;
    }
    console.log('process update', requestResponse.data[0]);
    let logo_url = null;
    const storeState = store.getState();
    const websites = storeState.catalog.websites;
    const host = hostname;
    let website = null;
    console.log('hostname is:', hostname);
    if (!!requestResponse.data.length && requestResponse.data[0].website_id > 0)
      website = websites.find(item => (item.id === requestResponse.data[0].website_id));
    if (!!website) {
      logo_url = serverUrl + website.logo;
      if (!!website.sso_id) {
        const clearbitLogo = await reflect(get_api.getClearbitLogo({
          hostname: extractRootDomain(url)
        }));
        if (!clearbitLogo.error)
          logo_url = clearbitLogo.data;
      }
      console.log('website found for logo image', website);
    }
    if (!logo_url){
      console.log('searching logo on clearbit');
      const clearbitLogo = await reflect(get_api.getClearbitLogo({
        hostname: host
      }));
      console.log('clearbit response', clearbitLogo);
      if (!clearbitLogo.error)
        logo_url = clearbitLogo.data;
    }
    if (!logo_url) {
      logo_url = `http://via.placeholder.com/100x100/373b60/ffffff?text=${host[0].toUpperCase()}`;
      console.log('using placeholder for logo', logo_url);
    }
    await reflect(Tabs.waitLoading(senderTab.id));
    store.dispatch(showSavedUpdatePopup({
      tabId: senderTab.id,
      url: url,
      logo_url: logo_url,
      account_information: account,
      origin: origin
    }));
    console.log('update detected !');
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
  scrapChrome: async (data, sendResponse, senderTab) => {
    console.log('start scrapping chrome');
    console.log('senderTab', senderTab);
    console.log('values are:', data);
    await reflect(Privacy.passwordSaving.set(false));
    await reflect(Privacy.autofill.set(false));
    await asyncWait(100);
    let tab = await Tabs.create({
      url: 'https://passwords.google.com'
    });
    store.dispatch(showScrapingChromeOverlay({
      tabId: tab.id
    }));
    const response = await reflect(scrapChrome(data, tab));
    await Tabs.update(senderTab.id, {active: true});
    await Tabs.remove(tab.id);
    store.dispatch(deleteScrapingChromeOverlay({
      tabId: tab.id
    }));
    setTimeout(() => {
      reflect(Privacy.passwordSaving.set(true));
      reflect(Privacy.autofill.set(true));
    }, 2000);
    console.log('scrapping result:', response);
    if (response.error && response.data.indexOf('Wrong') === -1)
      response.data = 'It seems you closed the tab. Please try again';
    sendResponse(MessageResponse(response.error, response.data));
  },
  easeLogin: (data, sendResponse, senderTab) => {
    store.dispatch(getUserInformation()).then(response => {
      store.dispatch(getProfiles());
      store.dispatch(getCatalogWebsites());
    });
  },
  easeLogout: (data, sendResponse, senderTab) => {
    store.dispatch(logout());
  }
};

browser.runtime.onMessageExternal.addListener(
    (request, sender, sendResponse) => {
      if (!!actions[request.type]){
        console.log(request);
        actions[request.type](request.data, sendResponse, sender.tab);
        return true;
      }
    }
);

browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (!!actions[request.type]){
        console.log(request);
        actions[request.type](request.data, sendResponse, sender.tab);
        return true;
      } else if (request.type === 'getTabId') {
        sendResponse(MessageResponse(false, sender.tab.id));
      }
    }
);