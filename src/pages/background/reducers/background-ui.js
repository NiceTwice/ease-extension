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
    const {tabId, info} = action.payload;
    return update(state, {
      [tabId]: {$set: info}
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
  ['WEBSITE_INTEGRATION_STEPS_TOGGLE_ACTIVE'](state, action){
    const {tabId, index, stepsType} = action.payload;

    return update(state, {
      [tabId]: {
        [stepsType] : {
          [index]: {
            uiActive: {$set: !(state[tabId][stepsType][index].uiActive)}
          }
        }
      }
    });
  },
  ['WEBSITE_ADD_LOGIN_STEP'](state, action){
    const {tabId, step} = action.payload;

    return update(state, {
      [tabId]: {
        loginSteps: {$push: [{uiActive: true, description: step}]}
      }
    })
  },
  ['WEBSITE_LOGIN_STEP_CHANGED'](state, action){
    const {tabId, stepIndex, stepParamName, stepParamValue} = action.payload;

    return update(state, {
      [tabId]: {
        loginSteps:{
          [stepIndex]: {
            description: {
              [stepParamName]: {$set: stepParamValue}
            }
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
        logoutSteps: {$push: [{uiActive: true, description: step}]}
      }
    })
  },
  ['WEBSITE_LOGOUT_STEP_CHANGED'](state, action){
    const {tabId, stepIndex, stepParamName, stepParamValue} = action.payload;

    return update(state, {
      [tabId]: {
        logoutSteps:{
          [stepIndex]: {
            description: {
              [stepParamName]: {$set: stepParamValue}
            }
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
        checkAlreadyLoggedSteps: {$push: [{uiActive: true, description: step}]}
      }
    })
  },
  ['WEBSITE_CHECKALREADYLOGGED_STEP_CHANGED'](state, action){
    const {tabId, stepIndex, stepParamName, stepParamValue} = action.payload;

    return update(state, {
      [tabId]: {
        checkAlreadyLoggedSteps:{
          [stepIndex]: {
            description: {
              [stepParamName]: {$set: stepParamValue}
            }
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
  },
  ['WEBSITE_ADD_CONNECTION_INFO'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      [tabId]: {
        connectionInfo: {$push: [{name: '', testValue: ''}]}
      }
    });
  },
  ['WEBSITE_REMOVE_CONNECTION_INFO'](state, action){
    const {tabId, index} = action.payload;

    return update(state, {
      [tabId]: {
        connectionInfo: {$splice: [[index, 1]]}
      }
    })
  },
  ['WEBSITE_CONNECTION_INFO_NAME_CHANGED'](state, action){
    const {tabId, index, value} = action.payload;

    return update(state, {
      [tabId]: {
        connectionInfo: {
          [index]: {
            name: {$set: value}
          }
        }
      }
    });
  },
  ['WEBSITE_CONNECTION_INFO_TEST_VALUE_CHANGED'](state, action){
    const {tabId, index, value} = action.payload;

    return update(state, {
      [tabId]: {
        connectionInfo: {
          [index]: {
            testValue: {$set: value}
          }
        }
      }
    });
  },
  ['WEBSITE_CONNECTION_STEP_MOVED'](state, action){
    const {tabId, connectionType, sourceIndex, destinationIndex} = action.payload;

    const step = state[tabId][connectionType][sourceIndex];
    return update(state, {
      [tabId]: {
        [connectionType]: {$splice: [[sourceIndex, 1], [destinationIndex, 0, step]]}
      }
    });
  },
  ['WEBSITE_CONNECTION_SAVE_LOGGED_IN_DOM'](state, action){
    const {tabId, dom} = action.payload;

    return update(state, {
      [tabId]: {
        loggedInDOM: {$set: dom}
      }
    })
  },
  ['WEBSITE_CONNECTION_SAVE_LOGGED_OUT_DOM'](state, action){
    const {tabId, dom} = action.payload;

    return update(state, {
      [tabId]: {
        loggedOutDOM: {$set: dom}
      }
    })
  },
  ['WEBSITE_CONNECTION_CHANGE_TAB_INDEX'](state, action){
    const {tabId, index} = action.payload;

    return update(state, {
      [tabId]: {
        connectionStepsTabIndex: {$set: index}
      }
    });
  }
});