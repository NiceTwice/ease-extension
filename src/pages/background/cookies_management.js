import Storage from "../../shared/storage_api";
import Cookies from "../../shared/cookies_api";
import Tabs from "../../shared/tabs_api";
import {getUrl, reflect} from "../../shared/utils";

export const setHostnameCookies = async ({hostname, url, login}) => {
  const storage = await Storage.local.get(null);

  console.log('settings cookies');
  if (!!storage.cookies[hostname] && !!storage.cookies[hostname][login]){
    console.log('cookies exists');
    const cookies = storage.cookies[hostname][login];
    console.log('cookies are:', cookies);
    let calls = cookies.map(item => {
      const cookie = {
        url: url,
        domain: item.domain,
        httpOnly: item.httpOnly,
        name: item.name,
        path: item.path,
        sameSite: item.sameSite,
        secure: item.secure,
        storeId: item.storeId,
        value: item.value,
        expirationDate: item.expirationDate
      };
      return Cookies.set(cookie);
    });
    await Promise.all(calls.map(reflect));
    console.log('cookies set');
  }
  console.log('finish setting cookies');
};

export const removeHostnameCookies = async ({url}) => {
  const cookies = await Cookies.getAll({
    url: url
  });
  console.log('removing cookies', cookies);
  let calls = cookies.map(item => {
    return Cookies.remove({
      url: url,
      name: item.name
    })
  });
  await Promise.all(calls.map(reflect));
  console.log('cookies removed');
};

export const saveTabCookies = async ({login, hostname, url}) => {
  const cookies = await Cookies.getAll({
    url: url
  });
  const storage = await Storage.local.get(null);

  if (!storage.cookies[hostname])
    storage.cookies[hostname] = {};
  storage.cookies[hostname][login] = cookies;
  await Storage.local.set(storage);
  console.log('cookies', cookies);
};

export const saveLogwithTabCookies = async ({hostname, url, logwith_name, login}) => {
  const cookies = await Cookies.getAll({
    url: url
  });
  const storage = await Storage.local.get(null);
  if (!storage.cookies[hostname])
    storage.cookies[hostname] = {};
  if (!storage.cookies[hostname][logwith_name])
    storage.cookies[hostname][logwith_name] = {};
  storage.cookies[hostname][logwith_name][login] = cookies;
  await Storage.local.set(storage);
  console.log('cookies', cookies);
};

export const setLogwithHostnameCookies = async ({hostname, url, logwith_name, login}) => {
  const storage = await Storage.local.get(null);

  console.log('setting logwith cookies');
  if (!!storage.cookies[hostname] &&
      !!storage.cookies[hostname][logwith_name] &&
      !!storage.cookies[hostname][logwith_name][login]){
    const cookies = storage.cookies[hostname][logwith_name][login];
    console.log('logwith cookies exists!');
    let calls = cookies.map(item => {
      const cookie = {
        url: url,
        domain: item.domain,
        httpOnly: item.httpOnly,
        name: item.name,
        path: item.path,
        sameSite: item.sameSite,
        secure: item.secure,
        storeId: item.storeId,
        value: item.value,
        expirationDate: item.expirationDate
      };
      return Cookies.set(cookie);
    });
    await Promise.all(calls.map(reflect));
    console.log('cookies set');
  }
  console.log('finish setting logwith cookies');
};