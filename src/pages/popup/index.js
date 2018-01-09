import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Store} from "react-chrome-redux";
import App from "./components/App";

//window.open('http://ease.space');

const proxyStore = new Store({
  state: {loading: true},
  portName: "ease-port"
});

render(
    <Provider store={proxyStore}>
      <App/>
    </Provider>,
    document.getElementById('ease-extension-anchor')
);