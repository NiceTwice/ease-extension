/*import "./shortcut";
import "./message_listeners";
import "./omnibox";
import Storage from "../../shared/storage_api";
import "./runtime_listeners";
import store from "./store";
import axios from "axios";
import {getUserInformation} from "../../shared/actions/user";
import {getProfiles} from "../../shared/actions/dashboard";
import {getCatalogWebsites} from "../../shared/actions/common";
import {serverUrl} from "../../shared/strings";

window.store = store;
window.storage = () => {
  Storage.local.get(null).then(storage => {
    console.log('storage:', storage);
  });
};

window.setOrigin = (url) => {
  axios.defaults.baseURL = url;
};

axios.defaults.baseURL = serverUrl;

store.dispatch(getUserInformation()).then(response => {
  store.dispatch(getProfiles());
  store.dispatch(getCatalogWebsites());
});

browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
  console.log('tabs query then', tabs);
});

console.log('background script successfully loaded.');
*/

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
      request.greeting);
  sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);