import Runtime from "../../shared/runtime_api";

document.addEventListener("NewConnection", (event) => {
  Runtime.sendMessage(null, {
    type: 'website_connection',
    data: {
      detail : event.detail,
      highlight: event.detail.highlight,
      test_connection: event.detail.test_connection
    }
  }, null);
}, false);

document.addEventListener('ScrapChrome', (event) => {
  const detail = event.detail;
  Runtime.sendMessage(null, {
    type: 'scrapChrome',
    data: detail
  }, null).then(response => {
    console.log('scrapping finished:',  response);
    document.dispatchEvent(new CustomEvent('ScrapChromeResult', {
      detail: {
        success: true,
        msg: response
      }
    }));
  }).catch(err => {
    document.dispatchEvent(new CustomEvent('ScrapChromeResult', {
      detail: {
        success: false,
        msg: err
      }
    }));
    console.log('scrapping error:', err);
  });
});