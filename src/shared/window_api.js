import  './browser';

windows = {
  get: (windowId, getInfo) => {
    return new Promise((resolve, reject) => {
      browser.windows.get(windowId, getInfo, (window) => {
        resolve(window);
      });
    });
  },
  getCurrent: (getInfo) => {
    return new Promise((resolve, reject) => {
      browser.windows.getCurrent(getInfo, (window) => {
        resolve(window);
      });
    });
  },
  getLastFocused: (getInfo) => {
    return new Promise((resolve, reject) => {
      browser.windows.getLastFocused(getInfo, (window) => {
        resolve(window);
      });
    });
  },
  getAll: (getInfo) => {
    return new Promise((resolve, reject) => {
      browser.windows.getAll(getInfo, (windows) => {
        resolve(windows);
      });
    });
  },
  create: (createData) => {
    return new Promise((resolve, reject) => {
      browser.windows.create(createData, (window) => {
        resolve(window);
      });
    });
  },
  update: (windowId, updateInfo) => {
    return new Promise((resolve, reject) => {
      browser.windows.update(windowId, updateInfo, (window) => {
        resolve(window);
      });
    });
  },
  remove: (windowId) => {
    return new Promise((resolve, reject) => {
      browser.windows.remove(windowId, () => {
        resolve();
      });
    });
  }
};

export default windows;