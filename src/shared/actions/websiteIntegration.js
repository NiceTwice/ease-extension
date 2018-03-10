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
        checkAlreadyLoggedSteps: [],
        checkAlreadyLoggedSelector: '',
        connectionInfo: [
          {key: 'login', text: 'login', value: 'login'},
          {key: 'password', text: 'password', value: 'password'}
        ],
        chosenConnectionInfo: ['login', 'password']
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

//connection info form {name: 'login', removable: false}
export const websiteAddConnectionInfo = ({tabId, connectionInfoName}) => {
  return {
    type: 'WEBSITE_ADD_CONNECTION_INFO',
    payload: {
      tabId: tabId,
      connectionInfoName: connectionInfoName
    }
  }
};

export const websiteRemoveConnectionInfo = ({tabId, index}) => {
  return {
    type: 'WEBSITE_REMOVE_CONNECION_INFO',
    payload: {
      tabId: tabId,
      index: index
    }
  }
};
