import "./shortcut";
import "./message_listeners";
import Storage from "../../shared/storage_api";
import Tabs from "../../shared/tabs_api";
import TabActions from "./tab_actions";

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