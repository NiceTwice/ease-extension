import './browser';

const cookies = {
  get: (details) => {
    return new Promise((resolve, reject) => {
      browser.cookies.get(details, (cookie) => {
        resolve(cookie);
      });
    });
  },
  getAll: (details) => {
    return new Promise((resolve, reject) => {
      browser.cookies.getAll(details, (cookies) => {
        resolve(cookies);
      });
    });
  },
  set: (details) => {
    return new Promise((resolve, reject) => {
      browser.cookies.set(details, (cookie) => {
        if (!!browser.runtime.lastError){
          reject(browser.runtime.lastError.message);
          return;
        }
        if (!cookie) {
          reject('Failed to set the cookie:', details);
          return;
        }
        resolve(cookie);
      });
    });
  },
  remove: (details) => {
    return new Promise((resolve, reject) => {
      browser.cookies.remove(details, (cookie_details) => {
        if (!!browser.runtime.lastError){
          reject(browser.runtime.lastError.message);
          return;
        }
        if (!cookie_details) {
          reject('Failed to remove cookie:', details);
          return;
        }
        resolve(cookie_details);
      });
    });
  },
  getAllCookieStores: () => {
    return new Promise((resolve, reject) => {
      browser.cookies.getAllCookieStores((cookieStores) => {
        resolve(cookieStores);
      });
    });
  }
};

export default cookies;