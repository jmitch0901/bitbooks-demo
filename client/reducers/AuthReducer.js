import { AUTHENTICATE, LOGOUT, USER_IS_SYNCING } from '../actions/types';

const store = {
  authenticated: false,
  userInfo: {},
  isCurrentlySyncing: false
};

export default function(state = store, action) {
  switch (action.type) {
    case AUTHENTICATE: {
      const userInfo = action.payload;
      return { ...state, userInfo, authenticated: true };
    }
    case LOGOUT: {
      return store;
    }
    case USER_IS_SYNCING: {
      const isCurrentlySyncing = action.payload;
      return { ...state, isCurrentlySyncing };
    }
  }
  return state;
}
