import Tabs from "../../shared/tabs_api";
import {initWebsiteIntegration, endWebsiteIntegration} from "../../shared/actions/websiteIntegration";
import store from "./store";

const commands_actions = {
  "open-ease": () => {
    window.open('https://ease.space');
  },
  "website-integration": async () => {
    console.log('website integration');
    const tab = (await Tabs.query({
      currentWindow: true,
      active: true
    }))[0];
    const state = store.getState();
    const isActive = !!state.websiteIntegrationBar[tab.id];
    if (isActive)
      store.dispatch(endWebsiteIntegration({tabId: tab.id}));
    else
      store.dispatch(initWebsiteIntegration({tabId: tab.id}));
  }
};

chrome.commands.onCommand.addListener(function(command){
  commands_actions[command]();
});
