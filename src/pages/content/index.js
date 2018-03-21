import "./message_listeners";
/*import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Store} from "react-chrome-redux";
import App from "./components/App";
import "../../assets/fonts/fontawesome/css/font-awesome.min.css";

const anchor = document.createElement('div');
anchor.id = "new_ease_extension";
document.body.insertBefore(anchor, document.body.childNodes[0]);

const proxyStore = new Store({
  state: {loading: true},
  portName: "ease-port"
});

render(
    <Provider store={proxyStore}>
      <App/>
    </Provider>,
    document.getElementById('new_ease_extension')
);*/

const body = document.querySelector('body');
console.log('body is', body);
console.log('is iframe', window.top !== window);
  function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
  }

  function handleError(error) {
    console.log("i'm in error handler");
    console.log(`Error: ${error}`);
  }

  let promise = browser.runtime.sendMessage({
    greeting: "Greeting from the content script"
  });
  promise.then(handleResponse, handleError);
/*browser.runtime.sendMessage({message: 'hello'}, (response) => {
  console.log('response batard',response);
});
*/