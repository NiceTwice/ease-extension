import "../../shared/browser";
import ContentActions from "./content_actions";

browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (!!sender.tab)
        return;
      if (!!ContentActions[request.type]) {
        ContentActions[request.type](request.data, sendResponse);
        return true;
      }
    });

console.log('listeners setup');