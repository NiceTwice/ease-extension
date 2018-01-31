export const InitialiseConnectionOverlay = ({tabId, websiteName}) => {
  return {
    type: 'INITIALIZE_CONNECTION_OVERLAY',
    payload: {
      tabId: tabId,
      websiteName: websiteName
    }
  }
};

export const UpdateConnectionOverlay = ({tabId, steps, currentStep}) => {
  return (dispatch, getState) => {
    const store = getState();
    if (!store.connectionOverlay[tabId])
      return;
    dispatch({
      type: 'UPDATE_CONNECTION_OVERLAY',
      payload: {
        tabId: tabId,
        steps: steps,
        currentStep: currentStep
      }
    });
  };
};

export const SetFirstConnection = ({tabId, first_connection}) => {
  return {
    type: 'SET_FIRST_CONNECTION',
    payload: {
      tabId: tabId,
      first_connection: first_connection
    }
  }
};

export const DeleteConnectionOverlay = ({tabId}) => {
  return {
    type: 'DELETE_CONNECTION_OVERLAY',
    payload: {
      tabId: tabId
    }
  }
};