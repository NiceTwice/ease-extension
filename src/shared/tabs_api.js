import './browser';
import {reflect} from "./utils";

const tabs = {
  get: (tabId) => {
    return new Promise((resolve, reject) => {
      browser.tabs.get(tabId, (tab) => {
        if (!!browser.runtime.lastError){
          reject(browser.runtime.lastError.message);
          return;
        }
        resolve(tab);
      });
    });
  },
  getCurrent: () => {
    return new Promise((resolve, reject) => {
      browser.tabs.getCurrent((tab) => {
        resolve(tab);
      });
    });
  },
  connect : (tabId, connectInfo) => {
    return browser.tabs.connect(tabId, connectInfo);
  },
  sendMessage: (tabId, message, options) => {
    return new Promise((resolve, reject) => {
      browser.tabs.sendMessage(tabId, message, options, (response) => {
        if (!!browser.runtime.lastError) {
          reject(browser.runtime.lastError.message);
          return;
        }
        if (!!response.error) {
          reject(response.response);
          return;
        }
        console.log('message:', message, 'response:', response.response);
        resolve(response.response);
      });
    });
  },
  create: (createProperties) => {
    return new Promise((resolve, reject) => {
      browser.tabs.create(createProperties, (tab) => {
          resolve(tabs.waitLoading(tab.id));
      });
    });
  },
  duplicate: (tabId) => {
    return new Promise((resolve, reject) => {
      browser.tabs.duplicate(tabId, (tab) => {
        resolve(tab);
      });
    });
  },
  query: (queryInfo) => {
    return new Promise((resolve, reject) => {
      browser.tabs.query(queryInfo, (tabs) => {
        if (!!browser.runtime.lastError){
          reject(browser.runtime.lastError.message);
          return;
        }
        resolve(tabs);
      });
    });
  },
  highlight: (highlightInfo) => {
    return new Promise((resolve, reject) => {
      browser.tabs.highlight(highlightInfo, (window) => {
        resolve(window);
      });
    });
  },
  update: (tabId, updateProperties) => {
    return new Promise((resolve, reject) => {
      browser.tabs.update(tabId, updateProperties, (tab) => {
        resolve(tab);
      });
    });
  },
  move: (tabIds, moveProperties) => {
    return new Promise((resolve, reject) => {
      browser.tabs.move(tabIds, moveProperties, (tabs) => {
        resolve(tabs);
      });
    });
  },
  reload: (tabId, reloadProperties) => {
    return new Promise((resolve, reject) => {
      browser.tabs.reload(tabId, reloadProperties, () => {
        resolve();
      });
    });
  },
  remove: (tabIds) => {
    return new Promise((resolve, reject) => {
      browser.tabs.remove(tabIds, () => {
        resolve();
      });
    });
  },
  detectLanguage: (tabId) => {
    return new Promise((resolve, reject) => {
      browser.tabs.detectLanguage(tabId, (language) => {
        resolve(language);
      });
    });
  },
  captureVisibleTab: (windowId, options) => {
    return new Promise((resolve, reject) => {
      browser.tabs.captureVisibleTab(windowId,options, (dataUrl) => {
        resolve(dataUrl);
      });
    });
  },
  executeScript: (tabId, details) => {
    return new Promise((resolve, reject) => {
      browser.tabs.executeScript(tabId, details, (results) => {
        resolve(results);
      });
    });
  },
  insertCSS: (tabId, details) => {
    return new Promise((resolve, reject) => {
      browser.tabs.insertCSS(tabId, details, () => {
        resolve();
      });
    });
  },
  discard: (tabId) => {
    return new Promise((resolve, reject) => {
      browser.tabs.discard(tabId, (tab) => {
        if (!tab)
          reject();
        resolve(tab);
      });
    });
  },
  waitLoading: (tabId) => {
    return new Promise(async (resolve, reject) => {
      const listenerComplete = (tabid, info, tab) => {
        if (tabid === tabId)
          console.log('on updated tab event fired', info, tab);
        if (tabid === tabId && info.status === 'complete'){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onCommitted.removeListener(listenerCommitted);
          console.log('waitload finished validated', info);
          setTimeout(() => {resolve(tab)}, 100);
        }
      };
      const listenerCommitted = (details) => {
        if (details.tabId === tabId && details.frameId === 0) {
          const {transitionType, transitionQualifiers} = details;
          console.log('waitload on committed event', details);
          if (transitionQualifiers.indexOf('forward_back') !== -1 ||
              transitionQualifiers.indexOf('from_address_bar') !== -1 ||
              transitionType === 'reload') {
            browser.tabs.onUpdated.removeListener(listenerComplete);
            browser.tabs.onRemoved.removeListener(listenerRemoved);
            browser.webNavigation.onCommitted.removeListener(listenerCommitted);
            console.log('waitload error, tab redirected', details);
            reject('tab redirected');
          }
        }
      };
      const listenerRemoved = (tabid, removeInfo) => {
        if (tabid === tabId){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onCommitted.removeListener(listenerCommitted);
          console.log('waitload error, tab removed', removeInfo);
          reject('tab closed');
        }
      };
/*      const listenerError = (details) => {
        if (details.tabId === tabId && details.frameId === 0){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onErrorOccurred.removeListener(listenerError);
          reject(details.error);
        }
      };*/
      browser.tabs.onUpdated.addListener(listenerComplete);
      browser.tabs.onRemoved.addListener(listenerRemoved);
      browser.webNavigation.onCommitted.addListener(listenerCommitted);
//      browser.webNavigation.onErrorOccurred.addListener(listenerError);
      setTimeout(async () => {
        const tabResult = await reflect(tabs.get(tabId));
        console.log('tab result wait load', tabResult);
        if (tabResult.error){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onCommitted.removeListener(listenerCommitted);
          reject(tabResult.data);
          return;
        }
        const tab = tabResult.data;
        if (tab.status === 'complete'){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onCommitted.removeListener(listenerCommitted);
          resolve(tab);
        }
      }, 300);
    });
  },
  waitLoadingOld: (tabId) => {
    return new Promise(async (resolve, reject) => {
      const listenerComplete = (tabid, info, tab) => {
        if (tabid === tabId && info.status === 'complete'){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          setTimeout(() => {resolve(tab)}, 100);
        }
      };
      const listenerRemoved = (tabid, removeInfo) => {
        if (tabid === tabId){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          reject('tab closed');
        }
      };
      browser.tabs.onUpdated.addListener(listenerComplete);
      browser.tabs.onRemoved.addListener(listenerRemoved);
      setTimeout(async () => {

        const tabResult = await reflect(tabs.get(tabId));
        if (tabResult.error){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          reject(tabResult.data);
          return;
        }
        const tab = tabResult.data;
        if (tab.status === 'complete'){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          resolve(tab);
        }
      }, 300);
    });
  },
  waitReload: (tabId) => {
    return new Promise(async (resolve, reject) => {
      const listenerComplete = (tabid, info, tab) => {
        if (tabid === tabId && info.status === 'complete'){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onCommitted.removeListener(listenerCommitted);
          console.log('waitload finished validated', info);
          setTimeout(() => {resolve(tab)}, 100);
        }
      };
      const listenerCommitted = (details) => {
        if (details.tabId === tabId && details.frameId === 0) {
          const {transitionType, transitionQualifiers} = details;
          console.log('waitload on committed event', details);
          if (transitionQualifiers.indexOf('forward_back') !== -1 ||
              transitionQualifiers.indexOf('from_address_bar') !== -1 ||
              transitionType === 'reload') {
            browser.tabs.onUpdated.removeListener(listenerComplete);
            browser.tabs.onRemoved.removeListener(listenerRemoved);
            browser.webNavigation.onCommitted.removeListener(listenerCommitted);
            console.log('waitload error, tab redirected', details);
            reject('tab redirected');
          }
        }
      };
      const listenerRemoved = (tabid, removeInfo) => {
        if (tabid === tabId){
          browser.tabs.onUpdated.removeListener(listenerComplete);
          browser.tabs.onRemoved.removeListener(listenerRemoved);
          browser.webNavigation.onCommitted.removeListener(listenerCommitted);
          console.log('waitload error, tab removed', removeInfo);
          reject('tab closed');
        }
      };
      /*      const listenerError = (details) => {
              if (details.tabId === tabId && details.frameId === 0){
                browser.tabs.onUpdated.removeListener(listenerComplete);
                browser.tabs.onRemoved.removeListener(listenerRemoved);
                browser.webNavigation.onErrorOccurred.removeListener(listenerError);
                reject(details.error);
              }
            };*/
      browser.tabs.onUpdated.addListener(listenerComplete);
      browser.tabs.onRemoved.addListener(listenerRemoved);
      browser.webNavigation.onCommitted.addListener(listenerCommitted);
    });
  }
};

export default tabs;