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

export function showPasswordUpdateAskHelperModal({tabId, appName, adminName, login}){
  return {
    type: 'SHOW_PASSWORD_UPDATE_ASK_HELPER_MODAL',
    payload: {
      tabId: tabId,
      appName: appName,
      adminName: adminName,
      login: login
    }
  }
}

export function closePasswordUpdateAskHelperModal({tabId}){
  return {
    type: 'CLOSE_PASSWORD_UPDATE_ASK_HELPER_MODAL',
    payload: {
      tabId: tabId
    }
  }
}