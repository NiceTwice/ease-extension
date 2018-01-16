import Runtime from "./runtime_api";

export const MessageResponse = (error, response) => {
  return {
    error: error,
    response: response
  }
};

export const BackgroundMessage = (type, data) => {
  return Runtime.sendMessage(null, {
    type: type,
    data: data
  }, null);
};

export function reflect(promise){
  return promise.then(function(v){ return {data:v, error: false }},
      function(e){ return {data:e, error: true }});
}

export function getUrl(url_str){
  var url = document.createElement("a");
  url.href = url_str;
  return url;
}

export function asyncWait(ms){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function copyTextToClipboard(str){
  let dummy = document.createElement("input");
  dummy.setAttribute('id', 'copy-password');
  dummy.style.position = 'absolute';
  dummy.style.left = '-150000px';
  document.body.appendChild(dummy);
  dummy.value = str;
  dummy.select();
  let worked = document.execCommand('copy');
  document.body.removeChild(dummy);
  return worked;
}
