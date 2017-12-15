import "./browser";

contentSettings = {
  popups: {
    clear: (details) => {
      return new Promise((resolve, reject) => {
        browser.contentSettings.popups.clear(details, () => {
          resolve();
        });
      });
    },
    get: (details) => {
      return new Promise((resolve, reject) => {
        browser.contentSettings.popups.get(details, (popups_details) => {
          resolve(popups_details);
        });
      });
    },
    set: (details) => {
      return new Promise((resolve, reject) => {
        browser.contentSettings.popups.set(details, () => {
          resolve();
        });
      });
    }
  }
};

export default contentSettings;