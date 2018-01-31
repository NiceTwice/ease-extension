import createReducer from  "./createReducer";
import update from 'immutability-helper';

export const connectionOverlay = createReducer({
}, {
  ['INITIALIZE_CONNECTION_OVERLAY'](state, action){
    const {websiteName, tabId} = action.payload;

    return update(state, {
      [tabId]: {$set: {
        websiteName: websiteName
      }}
    });
  },
  ['UPDATE_CONNECTION_OVERLAY'](state, action){
    const {steps,currentStep, tabId} = action.payload;
    return update(state, {
      [tabId]: {
        steps: {$set: steps},
        currentStep: {$set: currentStep}
      }
    });
  },
  ['SET_FIRST_CONNECTION'](state, action){
    const {first_connection, tabId} = action.payload;

    if (!state[tabId])
      return state;
    return update(state, {
      [tabId]: {
        first_connection: {$set: first_connection}
      }
    });
  },
  ['DELETE_CONNECTION_OVERLAY'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      $unset: [tabId]
    });
  }
});