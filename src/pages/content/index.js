import "./message_listeners";
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Store} from "react-chrome-redux";
import App from "./components/App";
import "../../assets/fonts/fontawesome/css/font-awesome.min.css";

if (window.top === window) {
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
    );
    console.log('localStorage', localStorage);
    console.log('content script created');
}
