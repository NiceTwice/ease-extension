export const initWebsiteIntegration = ({tabId}) => {
  return {
    type: 'INIT_WEBSITE_INTEGRATION',
    payload: {
      tabId: tabId
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