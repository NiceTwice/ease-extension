import './browser';

const runtime = {
  getURL: (path) => {
    return browser.runtime.getURL(path);
  },
  setUninstallURL: (url) => {
    return new Promise((resolve, reject) => {
      browser.runtime.setUninstallURL(url, () => {
        if (!!browser.runtime.lastError)
          reject();
        resolve();
      });
    });
  },
  reload: () => {
    browser.runtime.reload();
  },
  sendMessage: (extensionId, message, options) => {
    return new Promise((resolve, reject) => {
      console.log('in sendMessage promise');
      const promise = chrome.runtime.sendMessage(message);
      console.log('after promise call');
      promise.then((response) => {
        console.log('promise response', response);
      }, (err) => {
        console.log('promise error', err);
      });
    });
    return new Promise((resolve, reject) => {
      console.log('in sendMessage promise');
      browser.runtime.sendMessage(extensionId, message, options, (response) => {
        console.log('in sendMessage call response');
        if (!!browser.runtime.lastError) {
          reject(browser.runtime.lastError.message);
          return;
        }
        if (!!response.error) {
          reject(response.response);
          return;
        }
        resolve(response.response);
      });
    });
  }
};

export default runtime;