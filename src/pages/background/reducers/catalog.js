import createReducer from "./createReducer";
import update from 'immutability-helper';

export const catalog = createReducer({
  websites: []
}, {
  ['GET_WEBSITES_FULFILLED'](state, action){
    const {websites} = action.payload;

    return update(state, {
      websites: {$set: websites}
    });
  },
  ['LOGOUT'](state, action){
    return update(state, {
      websites: {$set: []}
    });
  }
});