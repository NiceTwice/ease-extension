import "../../shared/browser";
import Tabs from "../../shared/tabs_api";
import Cookies from "../../shared/cookies_api";
import {asyncWait, reflect} from "../../shared/utils";

const actions = {
  waitfor: async ({tabId, frameId}, {search}) => {
    let lastResponse;
    for (let i = 0; i < 50; i++){
      lastResponse = await reflect(Tabs.sendMessage(tabId, {type: 'search', data: {selector: search}}, {frameId}));
      if (!lastResponse.error) {
        await asyncWait(50);
        return lastResponse.data;
      }
      await asyncWait(200);
    }
    if (lastResponse.error)
      throw lastResponse.data;
    return lastResponse.data;
  },
  fill:  ({tabId, frameId}, {search, what}, values) => {
    return Tabs.sendMessage(tabId, {type: 'fill', data: {selector: search, value: values[what]}}, {frameId});
  },
  val: ({tabId, frameId}, {search, what}, values) => {
    return Tabs.sendMessage(tabId, {type: 'fill', data: {selector: search, value: values[what]}}, {frameId});
  },
  click: ({tabId, frameId}, {search}) => {
    return Tabs.sendMessage(tabId, {type: 'click', data: {selector: search}}, {frameId});
  },
  submit: ({tabId, frameId}, {search}) => {
    return Tabs.sendMessage(tabId, {type: 'submit', data: {selector: search}}, {frameId});
  },
  clickona: ({tabId, frameId}, {search}) => {
    return Tabs.sendMessage(tabId, {type: 'click', data: {selector: search}}, {frameId});
  },
  trueClick: ({tabId, frameId}, {search}) => {
    return Tabs.sendMessage(tabId, {type: 'click', data: {selector: search}}, {frameId});
  },
  search: ({tabId, frameId}, {search}) => {
    return Tabs.sendMessage(tabId, {type: 'search', data: {selector: search}}, {frameId});
  },
  waitload: async ({tabId, frameId}) => {
    return await Tabs.waitLoading(tabId);
  },
  goto: async ({tabId, frameId}, {url}) => {
    await Tabs.update(tabId, {url: url});
    return await Tabs.waitLoading(tabId);
  },
  getAttr: ({tabId, frameId}, {selector, attr}) => {
    return Tabs.sendMessage(tabId, {type: 'getAttr', data: {selector: selector, attr: attr}}, {frameId});
  },
  aclick: async ({tabId, frameId}, {search}) => {
    await Tabs.sendMessage(tabId, {type: 'aclick', data: {selector: search}}, {frameId});
    return await Tabs.waitLoading(tabId);
  },
  erasecookies: async ({tabId, frameId}, {name}) => {
    const tab = await Tabs.get(tabId);
    const cookieDetail = await Cookies.remove({
      url: tab.url,
      name: name
    });
    return cookieDetail;
  }
};

export default actions;