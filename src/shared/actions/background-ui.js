export function showSavedUpdatePopup({tabId, url, account_information, origin, logo_url}) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_SAVED_UPDATE_POPUP',
      payload: {
        tabId: tabId,
        url: url,
        account_information: account_information,
        origin:origin,
        logo_url: logo_url
      }
    });
/*    setTimeout(() => {
      dispatch(closeSavedUpdatePopup({
        tabId: tabId
      }))
    }, 5000);*/
  }
}

export function closeSavedUpdatePopup({tabId}){
  return {
    type: 'CLOSE_SAVED_UPDATE_POPUP',
    payload: {
      tabId: tabId
    }
  }
}