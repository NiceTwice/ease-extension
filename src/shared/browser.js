window.browser = (function () {
  return window.msBrowser ||
      window.chrome ||
      window.browser;
})();