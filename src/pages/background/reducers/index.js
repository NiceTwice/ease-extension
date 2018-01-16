import {combineReducers} from "redux";

import * as connectionOverlay from "./connectionOverlay";
import * as user from "./user";
import * as dashboard from "./dashboard";
import * as common from "./common";
import * as catalog from "./catalog";
import * as scraping from "./scraping";

const reducers = Object.assign(
    connectionOverlay,
    user,
    dashboard,
    common,
    catalog,
    scraping
);

export default combineReducers({
    ...reducers
});