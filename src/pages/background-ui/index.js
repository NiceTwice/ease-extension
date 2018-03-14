import React from "react";
import {render} from "react-dom";
import axios from "axios";
import {Provider} from "react-redux";
import {Store} from "react-chrome-redux";
import {serverUrl} from "../../shared/strings";
import App from "./App";

window.storage = () => {
  Storage.local.get(null).then(storage => {
    console.log('storage:', storage);
  });
};

axios.defaults.baseURL = serverUrl;

const proxyStore = new Store({
  state: {loading: true},
  portName: "ease-port"
});

render(<Provider store={proxyStore}><App/></Provider>,
    document.getElementById('app-root'));