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
        checkAlreadyLoggedSteps: [],
        checkAlreadyLoggedSelector: ''
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
  },
  ['WEBSITE_ADD_LOGIN_STEP'](state, action){
    const {tabId, step} = action.payload;

    return update(state, {
      [tabId]: {
        loginSteps: {$push: [step]}
      }
    })
  },
  ['WEBSITE_LOGIN_STEP_CHANGED'](state, action){
    const {tabId, stepIndex, stepParamName, stepParamValue} = action.payload;

    return update(state, {
      [tabId]: {
        loginSteps:{
          [stepIndex]: {
            [stepParamName]: {$set: stepParamValue}
          }
        }
      }
    });
  },
  ['WEBSITE_LOGIN_STEP_REMOVED'](state, action){
    const {tabId, stepIndex} = action.payload;

    return update(state, {
      [tabId]: {
        loginSteps: {$splice: [[stepIndex, 1]]}
      }
    });
  },
  ['WEBSITE_ADD_LOGOUT_STEP'](state, action){
    const {tabId, step} = action.payload;

    return update(state, {
      [tabId]: {
        logoutSteps: {$push: [step]}
      }
    })
  },
  ['WEBSITE_LOGOUT_STEP_CHANGED'](state, action){
    const {tabId, stepIndex, stepParamName, stepParamValue} = action.payload;

    return update(state, {
      [tabId]: {
        logoutSteps:{
          [stepIndex]: {
            [stepParamName]: {$set: stepParamValue}
          }
        }
      }
    });
  },
  ['WEBSITE_LOGOUT_STEP_REMOVED'](state, action){
    const {tabId, stepIndex} = action.payload;

    return update(state, {
      [tabId]: {
        logoutSteps: {$splice: [[stepIndex, 1]]}
      }
    });
  },
  ['WEBSITE_ADD_CHECKALREADYLOGGED_STEP'](state, action){
    const {tabId, step} = action.payload;

    return update(state, {
      [tabId]: {
        checkAlreadyLoggedSteps: {$push: [step]}
      }
    })
  },
  ['WEBSITE_CHECKALREADYLOGGED_STEP_CHANGED'](state, action){
    const {tabId, stepIndex, stepParamName, stepParamValue} = action.payload;

    return update(state, {
      [tabId]: {
        checkAlreadyLoggedSteps:{
          [stepIndex]: {
            [stepParamName]: {$set: stepParamValue}
          }
        }
      }
    });
  },
  ['WEBSITE_CHECKALREADYLOGGED_STEP_REMOVED'](state, action){
    const {tabId, stepIndex} = action.payload;

    return update(state, {
      [tabId]: {
        checkAlreadyLoggedSteps: {$splice: [[stepIndex, 1]]}
      }
    });
  },
  ['WEBSITE_CHECKALREADYLOGGED_SELECTOR_CHANGED'](state, action){
    const {tabId, selector} = action.payload;

    return update(state, {
      [tabId]: {
        checkAlreadyLoggedSelector: {$set: selector}
      }
    })
  }
});