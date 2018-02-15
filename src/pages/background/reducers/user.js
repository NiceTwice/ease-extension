import createReducer from  "./createReducer";

export const user = createReducer({
  fetching: true,
  fetched: false,
  information: null
}, {
  ['GET_USER_INFORMATION_PENDING'](state, action){
    return {
      fetching: true,
      fetched: false,
      information: null
    }
  },
  ['GET_USER_INFORMATION_FULFILLED'](state, action){
    const {user} = action.payload;

    return {
      fetching: false,
      fetched: true,
      information:user
    }
  },
  ['GET_USER_INFORMATION_REJECTED'](state, action){
    return {
      fetching: false,
      fetched: true,
      information: null
    }
  }
});