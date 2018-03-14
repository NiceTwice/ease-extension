import Runtime from "./runtime_api";
import Tabs from "./tabs_api";

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

export const TabMessage = (tabId, type, data, params) => {
  return Tabs.sendMessage(tabId, {
    type: type,
    data: data
  }, params);
};

export function handleSemanticInput(e, {name, value, checked}){
  if (checked !== undefined){
    this.setState({[name]: checked});
    return;
  }
  this.setState({[name]: value});
}

export const resolveImageURL = (url) => {
  if (url[0] === '/')
    return "https://ease.space" + url;
  return url;
};

export function reflect(promise){
  return promise.then(function(v){ return {data:v, error: false }},
      function(e){ return {data:e, error: true }});
}

export function getUrl(url_str){
  let url = document.createElement("a");
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
  let dummy = document.createElement("textarea");
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

export const  extractHostname = (url) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

export const extractRootDomain = (url) => {
  let domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 1].length === 2 && splitArr[arrLen - 2].length === 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
};

export const extractRootDomainWithoutCountryCode = (url) => {
  const split = extractRootDomain(url).split('.');
  return split.slice(0, split.length - 1).join('.');
};