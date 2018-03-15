export const initWebsiteIntegration = ({tabId}) => {
  return {
    type: 'INIT_WEBSITE_INTEGRATION',
    payload: {
      tabId: tabId,
      info: {
        websiteName: '',
        websiteHome: '',
        loginSteps: [],
        logoutSteps: [],
        connectionStepsTabIndex: 0,
        checkAlreadyLoggedSteps: [],
        checkAlreadyLoggedSelector: '',
        loggedInDOM: null,
        loggedOutDOM: null,
        connectionInfo: [
          {name: "login", testValue: ''},
          {name: "password", testValue: ''}
        ]
      }
    }
  }
};

export const endWebsiteIntegration = ({tabId}) => {
  return {
    type: 'END_WEBSITE_INTEGRATION',
    payload: {
      tabId: tabId
    }
  }
};

export const websiteNameChanged = ({tabId, websiteName}) => {
  return {
    type: 'WEBSITE_NAME_CHANGED',
    payload: {
      tabId: tabId,
      name: websiteName
    }
  }
};

export const websiteHomeChanged = ({tabId, websiteHome}) => {
  return {
    type: 'WEBSITE_HOME_CHANGED',
    payload: {
      tabId: tabId,
      home: websiteHome
    }
  }
};

export const websiteAddLoginStep = ({tabId, step}) => {
  return {
    type: 'WEBSITE_ADD_LOGIN_STEP',
    payload: {
      tabId: tabId,
      step: step
    }
  }
};

export const websiteLoginStepChanged = ({tabId, stepIndex, stepParamName, stepParamValue}) => {
  return {
    type: 'WEBSITE_LOGIN_STEP_CHANGED',
    payload: {
      tabId: tabId,
      stepIndex: stepIndex,
      stepParamName: stepParamName,
      stepParamValue: stepParamValue
    }
  }
};

export const websiteLoginStepRemoved = ({tabId, stepIndex}) => {
  return {
    type: 'WEBSITE_LOGIN_STEP_REMOVED',
    payload: {
      tabId: tabId,
      stepIndex: stepIndex
    }
  }
};

export const websiteAddLogoutStep = ({tabId, step}) => {
  return {
    type: 'WEBSITE_ADD_LOGOUT_STEP',
    payload: {
      tabId: tabId,
      step: step
    }
  }
};

export const websiteLogoutStepChanged = ({tabId, stepIndex, stepParamName, stepParamValue}) => {
  return {
    type: 'WEBSITE_LOGOUT_STEP_CHANGED',
    payload: {
      tabId: tabId,
      stepIndex: stepIndex,
      stepParamName: stepParamName,
      stepParamValue: stepParamValue
    }
  }
};

export const websiteLogoutStepRemoved = ({tabId, stepIndex}) => {
  return {
    type: 'WEBSITE_LOGOUT_STEP_REMOVED',
    payload: {
      tabId: tabId,
      stepIndex: stepIndex
    }
  }
};

export const websiteAddCheckAlreadyLoggedStep = ({tabId, step}) => {
  return {
    type: 'WEBSITE_ADD_CHECKALREADYLOGGED_STEP',
    payload: {
      tabId: tabId,
      step: step
    }
  }
};

export const websiteCheckAlreadyLoggedStepChanged = ({tabId, stepIndex, stepParamName, stepParamValue}) => {
  return {
    type: 'WEBSITE_CHECKALREADYLOGGED_STEP_CHANGED',
    payload: {
      tabId: tabId,
      stepIndex: stepIndex,
      stepParamName: stepParamName,
      stepParamValue: stepParamValue
    }
  }
};

export const websiteCheckAlreadyLoggedStepRemoved = ({tabId, stepIndex}) => {
  return {
    type: 'WEBSITE_CHECKALREADYLOGGED_STEP_REMOVED',
    payload: {
      tabId: tabId,
      stepIndex: stepIndex
    }
  }
};

export const websiteCheckAlreadyLoggedSelectorChanged = ({tabId, selector}) => {
  return {
    type: 'WEBSITE_CHECKALREADYLOGGED_SELECTOR_CHANGED',
    payload: {
      tabId: tabId,
      selector: selector
    }
  }
};

export const websiteIntegrationStepToggleActive = ({tabId, index, stepsType}) => {
  return {
    type: 'WEBSITE_INTEGRATION_STEPS_TOGGLE_ACTIVE',
    payload: {
      tabId: tabId,
      index: index,
      stepsType: stepsType
    }
  }
};

//connection info form {name: 'login', removable: false}
export const websiteAddConnectionInfo = ({tabId}) => {
  return {
    type: 'WEBSITE_ADD_CONNECTION_INFO',
    payload: {
      tabId: tabId
    }
  }
};

export const websiteRemoveConnectionInfo = ({tabId, index}) => {
  return {
    type: 'WEBSITE_REMOVE_CONNECTION_INFO',
    payload: {
      tabId: tabId,
      index: index
    }
  }
};

export const websiteConnectionInfoNameChanged = ({tabId, index, value}) => {
  return {
    type: 'WEBSITE_CONNECTION_INFO_NAME_CHANGED',
    payload: {
      tabId: tabId,
      index: index,
      value: value
    }
  }
};

export const websiteConnectionInfoTestValueChanged = ({tabId, index, value}) => {
  return {
    type: 'WEBSITE_CONNECTION_INFO_TEST_VALUE_CHANGED',
    payload: {
      tabId: tabId,
      index: index,
      value: value
    }
  }
};

export const websiteConnectionMoveStep = ({tabId, connectionType, sourceIndex, destinationIndex}) => {
  return {
    type: 'WEBSITE_CONNECTION_STEP_MOVED',
    payload: {
      tabId: tabId,
      connectionType: connectionType,
      sourceIndex: sourceIndex,
      destinationIndex: destinationIndex
    }
  }
};

export const websiteConnectionSaveLoggedInDOM = ({tabId, dom}) => {
  return {
    type: 'WEBSITE_CONNECTION_SAVE_LOGGED_IN_DOM',
    payload: {
      tabId: tabId,
      dom: dom
    }
  }
};

export const websiteConnectionSaveLoggedOutDOM = ({tabId, dom}) => {
  return {
    type: 'WEBSITE_CONNECTION_SAVE_LOGGED_OUT_DOM',
    payload: {
      tabId: tabId,
      dom: dom
    }
  }
};

export const websiteConnectionChangeTabIndex = ({tabId, index}) => {
  return {
    type: 'WEBSITE_CONNECTION_CHANGE_TAB_INDEX',
    payload: {
      tabId: tabId,
      index: index
    }
  }
};