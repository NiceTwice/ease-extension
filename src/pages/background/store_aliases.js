import store from "./store";
import {getProfiles} from "../../shared/actions/dashboard";
import {getUserInformation} from "../../shared/actions/user";

export default {
  'get_user': () => {
    store.dispatch(getUserInformation);
    console.log('getting user');
  },
  'get_apps': () => {
    console.log('getting apps');
    store.dispatch(getProfiles());
  }
}