import "./browser";

const privacy = {
  passwordSaving : {
    get: () => {
      return new Promise((resolve, reject) => {
        browser.privacy.services.passwordSavingEnabled.get({}, (details) => {
          resolve(details);
        });
      });
    },
    set: (value) => {
      return new Promise((resolve, reject) => {
        browser.privacy.services.passwordSavingEnabled.set({value: value}, () => {
          if (!!browser.runtime.lastError)
            reject(browser.runtime.lastError.message);
          resolve();
        });
      });
    }
  },
  autofill: {
    get: () => {
      return new Promise((resolve, reject) => {
        browser.privacy.services.autofillEnabled.get({}, (details) => {
          resolve(details);
        });
      });
    },
    set: (value) => {
      return new Promise((resolve, reject) => {
        browser.privacy.services.autofillEnabled.set({value: value}, () => {
          if (!!browser.runtime.lastError)
            reject(browser.runtime.lastError.message);
          resolve();
        });
      });
    }
  }
};

export default privacy;