import { AUTHENTICATE, LOGOUT } from './types';
import Axios from 'axios';
import { init } from './AppActions';

export function authenticate(username, password, callbacks) {
  return async dispatch => {
    console.log('POSTING AUTH');
    try {
      const userRes = await Axios.post('/auth/login', {
        username,
        password
      });
      callbacks && callbacks();
    } catch (err) {
      console.error('Invalid Credentials');
    }
  };
}

export function getMyInfo(callbacks) {
  return async dispatch => {
    try {
      const userRes = await Axios.get('/auth/me');
      console.log('USER INFO: ', userRes.data);
      // Success!
      dispatch(await init());
      dispatch({
        type: AUTHENTICATE,
        payload: userRes.data
      });
    } finally {
      callbacks && callbacks();
    }
  };
}

export function logout(onSuccess) {
  return async dispatch => {
    const logoutRes = await Axios.get('/auth/logout');
    onSuccess && onSuccess();
    dispatch({
      type: LOGOUT
    });
  };
}
