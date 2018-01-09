import {combineReducers} from "redux";

import * as connectionOverlay from "./connectionOverlay";
import * as user from "./user";

const reducers = Object.assign(
    connectionOverlay,
    user
);

export default combineReducers({
    ...reducers
});