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
        if (!cookie) {
          reject(browser.runtime.lastError.message);
          return;
        }
        resolve(cookie);
      });
    });
  },
  remove: (details) => {
    return new Promise((resolve, reject) => {
      browser.cookies.remove(details, (cookie_details) => {
        if (!cookie_details)
          reject(browser.runtime.lastError.message);
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