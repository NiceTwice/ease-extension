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

export const passwordUpdateAskHelperModal = createReducer({

}, {
  ['SHOW_PASSWORD_UPDATE_ASK_HELPER_MODAL'](state, action){
     const {tabId} = action.payload;

     return update(state, {
       [tabId]: {$set: action.payload}
     });
  },
  ['CLOSE_PASSWORD_UPDATE_ASK_HELPER_MODAL'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      $unset: [tabId]
    });
  }
});