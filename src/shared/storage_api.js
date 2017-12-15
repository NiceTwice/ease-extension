import './browser';

const storage = {
  local: {
    get: (keys) => {
      return new Promise((resolve, reject) => {
        browser.storage.local.get(keys, items => {
          if (!!browser.runtime.lastError)
            reject();
          resolve(items);
        });
      });
    },
    set: (items) => {
      return new Promise((resolve, reject) => {
        browser.storage.local.set(items, () => {
          if (!!browser.runtime.lastError)
            reject();
          resolve();
        });
      });
    },
    remove: (keys) => {
      return new Promise((resolve, reject) => {
        browser.storage.local.remove(keys, () => {
          if (!!browser.runtime.lastError)
            reject();
          resolve();
        });
      });
    },
    clear: () => {
      return new Promise((resolve, reject) => {
        browser.storage.local.clear(() => {
          if (!!browser.runtime.lastError)
            reject();
          resolve();
        });
      });
    },
    getBytesInUse: (keys) => {
      return new Promise((resolve, reject) => {
        browser.storage.local.getBytesInUse(keys, (bytesInUse) => {
          if (!!browser.runtime.lastError)
            reject();
          resolve(bytesInUse);
        });
      });
    }
  },
  sync: {
    get: (keys) => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.get(keys, items => {
          if (!!browser.runtime.lastError)
            reject();
          resolve(items);
        });
      });
    },
    set: (items) => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.set(items, () => {
          if (!!browser.runtime.lastError)
            reject();
          resolve();
        });
      });
    },
    remove: (keys) => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.remove(keys, () => {
          if (!!browser.runtime.lastError)
            reject();
          resolve();
        });
      });
    },
    clear: () => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.clear(() => {
          if (!!browser.runtime.lastError)
            reject();
          resolve();
        });
      });
    },
    getBytesInUse: (keys) => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.getBytesInUse(keys, (bytesInUse) => {
          if (!!browser.runtime.lastError)
            reject();
          resolve(bytesInUse);
        });
      });
    }
  }
};

export default storage;