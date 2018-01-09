import createReducer from  "./createReducer";

export const user = createReducer({
  fetching: true,
  information: null
}, {
  ['GET_USER_INFORMATION_PENDING'](state, action){
    return {
      fetching: true,
      information: null
    }
  },
  ['GET_USER_INFORMATION_FULFILLED'](state, action){
    const {user} = action.payload;

    return {
      fetching: false,
      information:user
    }
  },
  ['GET_USER_INFORMATION_REJECTED'](state, action){
    return {
      fetching: false,
      information: null
    }
  }
});