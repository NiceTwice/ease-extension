import "./browser";

const extension = {
  getURL : (path) => {
    return browser.extension.getURL(path);
  }
};

export default extension;