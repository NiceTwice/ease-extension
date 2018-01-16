import {applyMiddleware, createStore, combineReducers} from "redux";
import {createLogger} from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import reducers from "./reducers";
import {wrapStore, alias} from "react-chrome-redux";
import aliases from "./store_aliases";

const middleware = applyMiddleware(/*alias(aliases),*/ promise(), thunk, createLogger());

let store = createStore(reducers, middleware);

wrapStore(store, {
  portName: 'ease-port'
});

export default store;