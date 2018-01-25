import "../../shared/browser";
import Tabs from "../../shared/tabs_api";
import Runtime from "../../shared/runtime_api";
import Storage from "../../shared/storage_api";

browser.runtime.onInstalled.addListener(async (details) => {
  console.log('on installed event fired');
  Tabs.query({url: ["*://*.ease.space/*", "http://localhost:8080/*", "https://localhost:8443/*"]}).then(tabs => {
    tabs.map(tab => {
      Tabs.reload(tab.id, null);
    });
  });
  Runtime.setUninstallURL('https://docs.google.com/forms/d/e/1FAIpQLSd2iAmqfxqpIPGVWVq4FuUWI-eqwtX_HsF3fkRKgtWOZ8Y5-g/viewform');
  const storage = await Storage.local.get(null);
  const newStorage = {
    settings: (!!storage.settings && !!storage.settings.homepage) ? storage.settings : {homepage: false},
    connectedAccounts: !!storage.connectedAccounts ? storage.connectedAccounts : {},
    cookies: !!storage.cookies ? storage.cookies : {}
  };
  Storage.local.set(newStorage);
});

/*chrome.webNavigation.onCompleted.addListener((details) => {
  console.log('on completed event fired:', details);
});*/

/*chrome.cookies.onChanged.addListener((info) => {
  console.log('cookies changed:', info);
});*/

/*chrome.webNavigation.onBeforeNavigate.addListener(details => {
  console.log('before navigation event', details);
});*/

/*chrome.tabs.onUpdated.addListener((tabid, info, tab) => {
  if (info.status === 'complete'){
    console.log('tab load complete event');
  }
});*/

/*chrome.webNavigation.onErrorOccurred.addListener(details => {
  console.log('web navigation error occurred event:', details);
});*/