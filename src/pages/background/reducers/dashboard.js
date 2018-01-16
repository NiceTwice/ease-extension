import createReducer from "./createReducer";
import update from 'immutability-helper';

export const dashboard = createReducer({
  fetching: true,
  fetched: false,
  apps: {},
  profiles: {}
}, {
  ['GET_PROFILES_PENDING'](state, action) {
    return update(state, {
      fetching: {$set: true}
    });
  },
  ['GET_PROFILES_FULFILLED'](state, action){
    const {apps, profiles} = action.payload;

    return update(state, {
      fetching: {$set: false},
      fetched: {$set: true},
      apps: {$set: apps},
      profiles: {$set: profiles}
    });
  },
  ['GET_PROFILES_REJECTED'](state, action){
    return update(state, {
      fetching: {$set: false},
      apps: {$set: {}},
      profiles: {$set: {}}
    });
  }
});