import $ from "jquery";
import {MessageResponse, reflect} from "../../shared/utils";

const WAIT_CHECK_INTERVAL = 100;
const WAIT_MAX_TIME = 10000;

function sendKey(input, key) {
  var e = input.ownerDocument.createEvent("KeyboardEvent");
  // FIREFOX : e.initKeyEvent("keydown", 1, 1, null, 0, 0, 0, 0, key, 0)
  e.initKeyboardEvent("keydown", 1, 1, document.defaultView, 0, 0, 0, 0, key, key);
  var f = input.dispatchEvent(e);
  //FIREFOX f && (e = input.ownerDocument.createEvent("KeyboardEvent"), e.initKeyEvent("keypress", 1, 1, null, 0, 0, 0, 0, key, 0), f = input.dispatchEvent(e));
  e = input.ownerDocument.createEvent("KeyboardEvent");
  //FIREFOX e.initKeyEvent("keyup", 1, 1, null, 0, 0, 0, 0, key, 0)
  e.initKeyboardEvent("keyup", 1, 1, null, 0, 0, 0, 0, key, key);
  input.dispatchEvent(e);
}

function fire_before_fill(a) {
  sendKey(a, 16); //shift
  sendKey(a, 32); //space
  sendKey(a, 8); //backspace
}

function fire_onchange(a) {
  var d = a.ownerDocument.createEvent("Events");
  d.initEvent("change", !0, !0);
  a.dispatchEvent(d);
  d = a.ownerDocument.createEvent("Events");
  d.initEvent("input", !0, !0);
  a.dispatchEvent(d);
}

const content_actions = {
  fill: ({selector, value}, sendResponse) => {
    console.log(`Start filling on "${selector}"`);
    let div = $(selector);

    if (!div.length) {
      sendResponse(MessageResponse(true, `Unable to find "${selector}"`));
      console.log(`Unable to find "${selector}"`);
      return;
    }
    div[0].focus();
    fire_before_fill(div[0]);
    div[0].value = value;
    div.val(value);
    fire_onchange(div[0]);
    div[0].blur();
    sendResponse(MessageResponse(false, `"${selector}" successfully filled`));
    console.log(`"${selector}" successfully filled`);
  },
  click: ({selector}, sendResponse) => {
    console.log(`Start clicking on "${selector}"`);
    let div = $(selector);

    if (!div.length) {
      sendResponse(MessageResponse(true, `Unable to find "${selector}"`));
      console.log(`Unable to find "${selector}"`);
      return;
    }
    div.prop('disabled', false);
    setTimeout(() => {
      div[0].click();
      sendResponse(MessageResponse(false, `"${selector}" successfully clicked`));
      console.log(`"${selector}" successfully clicked`);
    }, 250);
  },
  submit: ({selector}, sendResponse) => {
    console.log(`Start submitting on "${selector}"`);
    let div = $(selector);

    if (!div.length) {
      sendResponse(MessageResponse(true, `Unable to find "${selector}"`));
      console.log(`Unable to find "${selector}"`);
      return;
    }
    div.submit();
    sendResponse(MessageResponse(false, `"${selector}" successfully submitted`));
    console.log(`"${selector}" successfully submitted`);
  },
  waitfor: ({selector}, sendResponse) => {
    console.log(`Waiting for "${selector}"`);
    if (!!$(selector).length) {
      console.log(`${selector} successfully found`);
      sendResponse(MessageResponse(false, `${selector} successfully found`));
      return;
    }
    let time = 0;
    let interval = setInterval(() => {
      if (!!$(selector).length) {
        clearInterval(interval);
        sendResponse(MessageResponse(false, `${selector} successfully found`));
        console.log(`${selector} successfully found`);
        return;
      }
      if (time >= WAIT_MAX_TIME) {
        clearInterval(interval);
        sendResponse(MessageResponse(true, `Failed to find ${selector}`));
        console.log(`Failed to find ${selector}`);
        return;
      }
      time += WAIT_CHECK_INTERVAL;
    }, WAIT_CHECK_INTERVAL);
  },
  search: ({selector}, sendResponse) => {
    console.log(`Searching for ${selector}`);
    if (!$(selector).length) {
      sendResponse(MessageResponse(true, `Failed to find ${selector}`));
      console.log(`Failed to find ${selector}`);
      return;
    }
    sendResponse(MessageResponse(false, `${selector} successfully found`));
    console.log(`${selector} successfully found`);
  },
  getAttr: ({selector, attr}, sendResponse) => {
    console.log(`Trying to get attr : ${attr} from ${selector}`);
    let element = $(selector);

    if (!element.length) {
      sendResponse(MessageResponse(true, `Failed to find ${selector}`));
      console.log(`Failed to find ${selector}`);
      return;
    }
    let value = element.attr(attr);
    sendResponse(MessageResponse(false, value));
    console.log(`${selector} successfully found and attr ${attr} returned. Value is ${value}`);
  },
  aclick: ({selector}, sendResponse) => {
    console.log(`Aclicking on ${selector}`);

    let element = $(selector);
    if (!element.length) {
      sendResponse(MessageResponse(true, `Failed to find ${selector}`));
      console.log(`Failed to find ${selector}`);
      return;
    }
    const href = element.attr('href');
    window.location.reload();
    window.location.href = href;
    sendResponse(MessageResponse(false, `"${selector}" successfully clicked`));
    console.log(`"${selector}" successfully clicked`);
  },
  get_domain: (params, sendResponse) => {
    sendResponse(MessageResponse(false, document.domain));
  },
  scrapChrome: async (params, sendResponse) => {
    console.log('in chrome scrapping');
    let result = [];
    let linesLength = document.querySelectorAll('.F2OyGc.YcatWb .ggnaZd .tnBtsb:not(.TkdUmc)').length;
    for (let i = 0; i < linesLength; i++){
      let lines = document.querySelectorAll('.F2OyGc .ggnaZd .tnBtsb:not(.TkdUmc)');
      let line = lines[i];
      let website = {};
      console.log('scrap line');
      website.website = line.querySelector('.XP0Q0e').innerText;
      website.login = line.querySelector('.qtmufc').innerText;

      let inputDiv = line.querySelector('.rFrNMe');
      if (!!website.login && !!inputDiv) {
        let input = inputDiv.querySelector('input');
        if (!!input) {
          let inputButton = inputDiv.querySelector('.DPvwYc:not(.uZ7oZd)');
          if (!!inputButton) {
            inputButton.click();
            let response = await reflect(waitInputChange(input));
            console.log('wait result:', response);
            website.pass = input.value;

            result.push(website);
            console.log('website domain:', website.website);
            console.log('website login:', website.login);
            console.log('website password:', website.password);
            console.log(result.length);
            console.log('------- end -------');
          }
        }
      }
    }
    sendResponse(MessageResponse(false, result));
  }
};

function waitInputChange(element) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let time = 0;
      let value = element.value;
      console.log('start value:', value);
      let interval = setInterval(() => {
        if (time > 2000) {
          clearInterval(interval);
          reject();
        }
        time += 10;
        if (element.value !== value) {
          console.log('scrapped value', element.value);
          clearInterval(interval);
          resolve();
        }
      }, 10);
    }, 5);
  });
}

export default content_actions;