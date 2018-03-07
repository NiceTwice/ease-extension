import createReducer from  "./createReducer";
import update from 'immutability-helper';

export const savedUpdatePopup = createReducer({

}, {
  ['SHOW_SAVED_UPDATE_POPUP'](state, action){
    const {tabId} = action.payload;
    return update(state, {
      [tabId]: {$set: action.payload}
    })
  },
  ['CLOSE_SAVED_UPDATE_POPUP'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      $unset: [tabId]
    });
  }
});

export const websiteIntegrationBar = createReducer({

}, {
  ['INIT_WEBSITE_INTEGRATION'](state, action){
    const {tabId} = action.payload;
    return update(state, {
      [tabId]: {$set: {
        websiteName: '',
        websiteHome: '',
        loginSteps: [],
        logoutSteps: [],
        checkAlreadyLoggedSteps: []
      }}
    });
  },
  ['END_WEBSITE_INTEGRATION'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      $unset: [tabId]
    });
  },
  ['WEBSITE_NAME_CHANGED'](state, action){
    const {tabId, name} = action.payload;

    return update(state, {
      [tabId]: {
        websiteName: {$set: name}
      }
    });
  },
  ['WEBSITE_HOME_CHANGED'](state, action){
    const {tabId, home} = action.payload;

    return update(state, {
      [tabId]: {
        websiteHome: {$set: home}
      }
    })
  }
});