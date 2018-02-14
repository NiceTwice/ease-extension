import "./shortcut";
import "./message_listeners";
import "./omnibox";
import Storage from "../../shared/storage_api";
import Tabs from "../../shared/tabs_api";
import TabActions from "./tab_actions";
import "./runtime_listeners";
import store from "./store";
import Cookies from "../../shared/cookies_api";
import Runtime from "../../shared/runtime_api";
import axios from "axios";
import {serverUrl} from "../../shared/strings";
console.log('initializing background');

window.store = store;
window.storage = () => {
  Storage.local.get(null).then(storage => {
    console.log('storage:', storage);
  });
};

axios.defaults.baseURL = serverUrl;