import {
  APP_INITIALIZED,
  PAGE_LOADING,
  LOAD_ACCOUNTS,
  LOAD_WALLETS,
  SIDEBAR_TOGGLED
} from './types';
import Axios from 'axios';

export function togglePageLoading(isLoading, lightLoad = true) {
  return {
    type: PAGE_LOADING,
    payload: { isLoading, lightLoad }
  };
}

// TODO - Separate these calls on different page loads
export function init() {
  return async (dispatch, getState) => {
    const accounts = await Axios.get('/api/accounts');
    dispatch({
      type: LOAD_ACCOUNTS,
      payload: accounts.data
    });
    const walletPromises = accounts.data.map(acc =>
      Axios.get(`/api/accounts/${acc._id}/wallets`)
    );
    const wallets = (await Promise.all(walletPromises)).reduce((prev, curr) => {
      if (prev.length === 0) {
        return curr.data;
      }
      return [...prev, ...curr.data];
    }, []);
    dispatch({
      type: LOAD_WALLETS,
      payload: wallets
    });
    dispatch({
      type: APP_INITIALIZED
    });
  };
}

export function toggleSidebar({ forceClose = false }) {
  return {
    type: SIDEBAR_TOGGLED,
    payload: forceClose
  };
}
