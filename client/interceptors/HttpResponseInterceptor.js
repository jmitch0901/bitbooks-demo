import { LOGOUT } from '../actions/types';
import Axios from 'axios';

export const configureInterceptor = function(reduxStore) {
  Axios.interceptors.response.use(
    res => {
      return res;
    },
    error => {
      const errorRes = error.response;
      console.log(
        'AXIOS REPONSE INTERCEPT ERROR: ',
        errorRes,
        ' STATUS: ',
        errorRes.status
      );
      switch (errorRes.status) {
        case 401: {
          // Unauthorized
          console.log('UNAUTHORIZED!');
          reduxStore.dispatch({
            type: LOGOUT
          });
          break;
        }
      }
      return Promise.reject(error);
    }
  );
};
