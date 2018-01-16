import createReducer from "./createReducer";
import update from 'immutability-helper';

export const scrapGoogleOverlay = createReducer({

}, {
  ['SHOW_SCRAPING_CHROME_OVERLAY'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      [tabId]: {$set: true}
    });
  },
  ['DELETE_SCRAPING_CHROME_OVERLAY'](state, action){
    const {tabId} = action.payload;

    return update(state, {
      $unset: [tabId]
    });
  }
});