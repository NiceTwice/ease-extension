import "../../shared/browser";
import Tabs from "../../shared/tabs_api";
import {actions} from "./message_listeners";
import {updateOmniboxText} from "../../shared/actions/common";
import {getProfiles} from "../../shared/actions/dashboard";
import store from "./store";

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  let search = text.toLowerCase().replace(/\s+/g, '');
  store.dispatch(updateOmniboxText({
    text: text
  }));
  const state = store.getState();
  const apps = Object.keys(state.dashboard.apps)
      .map(id => {
        return state.dashboard.apps[id];
      })
      .filter(item => {
    switch (item.type) {
      case ('classicApp'):
        return true;
      case ('ssoApp'):
        return true;
      case ('teamSingleApp'):
        if (item.sub_type === 'classic')
          return true;
        break;
      case ('teamEnterpriseApp'):
        if (item.sub_type === 'classic')
          return true;
        break;
      default:
        return false;
    }
    return false;
  });
  const filtered_apps = apps.filter(item => {
    const name = item.name.toLowerCase().replace(/\s+/g, '');
    return name.indexOf(search) !== -1;
  });
  const results = filtered_apps.map(item => {
    return {
      content: item.id.toString(),
      description: `${item.name} (${item.account_information.login})`
    }
  });
  suggest(results);
});

chrome.omnibox.onInputStarted.addListener(() => {
  store.dispatch(getProfiles());
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const state = store.getState();
  const app = state.dashboard.apps[text];
  Tabs.query({
    currentWindow: true,
    active: true
  }).then(tabs => {
      const tab = tabs[0];
      actions.connect_tab({
        app_id: app.id,
        account_information: app.account_information,
        tab: tab
      }, () => (false));
  });
});

chrome.omnibox.onInputCancelled.addListener(() => {
  store.dispatch(updateOmniboxText({
    text: ''
  }));
});