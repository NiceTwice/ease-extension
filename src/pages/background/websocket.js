import {serverUrl} from "../../shared/strings";

let ws = new WebSocket(`wss://localhost:8443/webSocketServer`);

ws.onopen = (event) => {

};

ws.onclose = (event) => {

};

ws.onmessage = (event) => {
  let mess = JSON.parse(event.data);
  let type = mess.type;
  let data = mess.data;
  console.log('websocket message', mess);
};