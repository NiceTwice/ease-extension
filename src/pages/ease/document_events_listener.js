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

document.addEventListener('GetSettings', (event) => {
  console.log('get homepage');
  Runtime.sendMessage(null, {
    type: 'getHomePage'
  }, null).then(response => {
    document.dispatchEvent(new CustomEvent("GetSettingsDone", {"detail": response}));
  }).catch(err => {
    document.dispatchEvent(new CustomEvent("GetSettingsDone", {"detail": false}));
  });
});

document.addEventListener('SetHompage', (event) => {
  Runtime.sendMessage(null, {
    type: 'setHomePage',
    data: event.detail
  }, null);
});

document.addEventListener('Logout', (event) => {
  Runtime.sendMessage(null, {
    type: 'generalLogout'
  }, null);
});

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