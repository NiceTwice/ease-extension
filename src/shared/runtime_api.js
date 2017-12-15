import './browser';

runtime = {
  getUrl: (path) => {
    return browser.runtime.getUrl(path);
  },
  setUninstallUrl: (url) => {
    return new Promise((resolve, reject) => {
      browser.runtime.setUninstallUrl(url, () => {
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
      browser.runtime.sendMessage(extensionId, message, options, (response) => {
        if (!!browser.runtime.lastError)
          reject(browser.runtime.lastError.message);
        resolve(response);
      });
    });
  }
};

export default runtime;