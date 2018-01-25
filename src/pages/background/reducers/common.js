import createReducer from "./createReducer";
import update from 'immutability-helper';

export const common = createReducer({
  currentTab: null
}, {
  ['SET_CURRENT_TAB'](state, action){
    const {tab} = action.payload;
    return update(state, {
      currentTab: {$set: tab}
    });
  }
});

export const omnibox = createReducer({
  text: ''
}, {
  ['UPDATE_OMNIBOX_TEXT'](state, action){
    const {text} = action.payload;

    return update(state, {
      text: {$set: text}
    })
  }
});