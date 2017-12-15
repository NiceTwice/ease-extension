import './browser';

omnibox = {
  setDefaultSuggestion: (suggestion) => {
    browser.omnibox.setDefaultSuggestion(suggestion);
  }
};

export default omnibox;