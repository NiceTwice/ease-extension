import Tabs from "../../shared/tabs_api";
import get_api from "../../shared/ease_get_api";
import {reflect} from "../../shared/utils";

export const setCurrentTab = () => {
  return async (dispatch, getState) => {
    const tab = await Tabs.query({
      currentWindow: true,
      active: true
    });
    dispatch({
      type: 'SET_CURRENT_TAB',
      payload: {
        tab: tab[0]
      }
    });
    return tab[0];
  }
};

export const getCatalogWebsites = () => {
  return (dispatch, getState) => {
    return get_api.catalog.getWebsites().then(response => {
      dispatch({
        type: 'GET_WEBSITES_FULFILLED',
        payload: {
          websites: response.websites
        }
      });
      return response;
    }).catch(err => {
      throw err;
    });
  }
};

export const updateOmniboxText = ({text}) => {
  return {
    type: 'UPDATE_OMNIBOX_TEXT',
    payload: {
      text: text
    }
  }
};