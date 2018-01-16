import TabActions from "../tab_actions";
import Tabs from "../../../shared/tabs_api";
import Storage from "../../../shared/storage_api";
import Privacy from "../../../shared/privacy_api";
import Cookies from "../../../shared/cookies_api";
import WebNavigation from "../../../shared/webNavigation_api";
import ContentSettings from "../../../shared/contentSettings_api";
import {reflect, MessageResponse, getUrl, asyncWait} from "../../../shared/utils";
import store from "../store";
import get_api from "../../../shared/ease_get_api";
import {getUserInformation} from "../../../shared/actions/user";
import {getProfiles} from "../../../shared/actions/dashboard";
import {InitialiseConnectionOverlay, UpdateConnectionOverlay, DeleteConnectionOverlay} from "../../../shared/actions/connectionOverlay";
import {showScrapingChromeOverlay, deleteScrapingChromeOverlay} from "../../../shared/actions/scraping";
import {setCurrentTab, getCatalogWebsites} from "../../../shared/actions/common";

export const google_connection_steps = [
  {
    "action": "waitfor",
    "search": "#identifierId, #profileIdentifier + div div[role='button'], #identifierLink"
  },
  {
    "action": "trueClick",
    "search": "#profileIdentifier + div div[role='button']"
  },
  {
    "action": "waitfor",
    "search": "#identifierId, #identifierLink"
  },
  {
    "action": "trueClick",
    "search": "#identifierLink"
  },
  {
    "action": "waitfor",
    "search": "#identifierId, #identifierLink"
  },
  {
    "action": "trueClick",
    "search": "#identifierLink"
  },
  {
    "action": "waitfor",
    "search": "#identifierId"
  },
  {
    "action": "waitfor",
    "search": "#identifierNext"
  },
  {
    "action": "fill",
    "what": "login",
    "search": "#identifierId",
    "grave": "true"
  },
  {
    "action": "waitfor",
    "search": "#identifierNext"
  },
  {
    "action": "trueClick",
    "search": "#identifierNext"
  },
  {
    "action": "waitfor",
    "search": "#password input"
  },
  {
    "action": "waitfor",
    "search": "#passwordNext"
  },
  {
    "action": "fill",
    "what": "password",
    "search": "#password input",
    "grave": "true"
  },
  {
    "action": "waitfor",
    "search": "#passwordNext"
  },
  {
    "action": "click",
    "search": "#passwordNext"
  }
];

export const google_checkAlreadyLogged_steps = [
  {"action": "waitfor", "search":"a[href*='Logout'], #identifierLink, #identifierId, div[aria-label='Google'], #profileIdentifier + div div[role='button']"},
  {"search":"a[href*='Logout']"}
];

export const googleExecActions = async (tabId, actions, values) => {
  let frameId = 0;
  for (let i = 0; i < actions.length; i++){
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

export const scrapChrome = async (values, currentTab) => {
  let tab = currentTab;
  tab = await TabActions.goto({
    tabId: tab.id
  },{
    url: 'https://passwords.google.com'
  });
  console.log('connection steps');
  await googleExecActions(tab.id, google_connection_steps,values);
  console.log('check logged steps');
  await asyncWait(3000);
  await Tabs.waitLoading(tab.id);
  const checkLogged = await reflect(googleExecActions(tab.id, google_checkAlreadyLogged_steps, values));
  if (checkLogged.error)
    throw 'Wrong login or password. Please try again.';
  console.log('start scrapping...');
  return await Tabs.sendMessage(tab.id, {
    type: 'scrapChrome'
  }, {frameId: 0});
};