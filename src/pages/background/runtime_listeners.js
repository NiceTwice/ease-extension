import "../../shared/browser";
import Tabs from "../../shared/tabs_api";

browser.runtime.onInstalled.addListener((details) => {
  console.log('on installed event fired');
  Tabs.query({url: ["*://*.ease.space/*", "http://localhost:8080/*", "https://localhost:8443/*"]}).then(tabs => {
    console.log('tabs:', tabs);
    tabs.map(tab => {
      Tabs.reload(tab.id, null);
    });
  });
});