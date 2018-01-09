import "./shortcut";
import "./message_listeners";
import Storage from "../../shared/storage_api";
import Tabs from "../../shared/tabs_api";
import TabActions from "./tab_actions";
import "./runtime_listeners";
import store from "./store";
import Cookies from "../../shared/cookies_api";
import axios from "axios";

const storage = {
  settings: {
    homepage: false
  },
  connectedAccounts: {
    websiteName: ['login']
  }
};

const calls = [
  Storage.local.set(storage)
];

Promise.all(calls).then(response => {
  Storage.local.get(null).then(storage => {
    console.log(storage);
  });
  Storage.local.getBytesInUse(null).then(bytes => {
    console.log('bytes in use :', bytes);
  });
});

window.store = store;
window.storage = () => {
  Storage.local.get(null).then(storage => {
    console.log('storage:', storage);
  });
};

axios.defaults.baseURL = 'https://localhost:8443/';