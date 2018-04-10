import axios from "axios";
import get_api from "../../shared/ease_get_api";
import Cookies from "../../shared/cookies_api";

export const getProfiles = () => {
  return (dispatch, getState) => {
    dispatch({type: 'GET_PROFILES_PENDING'});
    return get_api.getProfiles().then(response => {
      dispatch({
        type: 'GET_PROFILES_FULFILLED',
        payload: {
          apps: response.apps
        }
      });
      return response;
    }).catch(err => {
      dispatch({type: 'GET_PROFILES_REJECTED'});
      throw err;
    });
  }
};
