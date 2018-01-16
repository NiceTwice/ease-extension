import "../../shared/browser";
import Tabs from "../../shared/tabs_api";
import Runtime from "../../shared/runtime_api";
import Storage from "../../shared/storage_api";

const storage = {
  settings: {
    homepage: false
  },
  connectedAccounts: {
  }
};

browser.runtime.onInstalled.addListener((details) => {
  console.log('on installed event fired');
  Tabs.query({url: ["*://*.ease.space/*", "http://localhost:8080/*", "https://localhost:8443/*"]}).then(tabs => {
    tabs.map(tab => {
      Tabs.reload(tab.id, null);
    });
  });
  Runtime.setUninstallURL('https://docs.google.com/forms/d/e/1FAIpQLSd2iAmqfxqpIPGVWVq4FuUWI-eqwtX_HsF3fkRKgtWOZ8Y5-g/viewform');
  Storage.local.set(storage);
});