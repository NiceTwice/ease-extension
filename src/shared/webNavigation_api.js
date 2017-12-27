import "./browser";

const webNavigation = {
  getFrame: (details) => {
    return new Promise((resolve, reject) => {
      browser.webNavigation.getFrame(details, (frameDetails) => {
        if (!frameDetails)
          reject();
        resolve(frameDetails);
      });
    });
  },
  getAllFrames: (details) => {
    return new Promise((resolve, reject) => {
      browser.webNavigation.getAllFrames(details, (frameDetails) => {
        if (!frameDetails)
          reject();
        resolve(frameDetails);
      });
    });
  }
};

export default webNavigation;