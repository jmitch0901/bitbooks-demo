import {
  SIDEBAR_TOGGLED,
  APP_INITIALIZED,
  PAGE_LOADING,
  LOGOUT
} from '../actions/types';

const store = {
  appReady: false,
  isInitialized: false,
  isSidebarOpen: true,
  pageLoading: false,
  doLightLoad: true
};

export default function(state = store, action) {
  switch (action.type) {
    case APP_INITIALIZED: {
      return { ...state, isInitialized: true, appReady: !state.pageLoading };
    }
    case PAGE_LOADING: {
      const { isLoading, lightLoad } = action.payload;
      return {
        ...state,
        pageLoading: isLoading,
        doLightLoad: lightLoad,
        appReady: state.isInitialized
      };
    }
    case SIDEBAR_TOGGLED: {
      const forceClose = action.payload;
      return {
        ...state,
        isSidebarOpen: forceClose ? false : !state.isSidebarOpen
      };
    }
    case LOGOUT: {
      return store;
    }
  }
  return state;
}
