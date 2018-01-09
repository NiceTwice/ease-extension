import axios from "axios";
import get_api from "../../shared/ease_get_api";
import Cookies from "../../shared/cookies_api";

export const getUserInformation = () => {
  return async (dispatch, getState) => {
    dispatch({type: 'GET_USER_INFORMATION_PENDING'});
    const jwt = await Cookies.get({
      url: 'https://localhost',
      name: 'JWT'
    });
    axios.defaults.headers.common['Authorization'] = jwt;
    return get_api.getUserInformation().then(response => {
      dispatch({
        type: 'GET_USER_INFORMATION_FULFILLED',
        payload: {
          user: response.user
        }
      });
      return response;
    }).catch(err => {
      dispatch({type: 'GET_USER_INFORMATION_REJECTED'});
      throw err;
    });
  }
};