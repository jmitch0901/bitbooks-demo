//dependencies
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

//reducers
import AuthReducer from './AuthReducer';
import AccountsReducer from './AccountsReducer';
import TransactionsReducer from './TransactionsReducer';
import RecordsReducer from './RecordsReducer';
import AppReducer from './AppReducer';
import ModalReducer from './ModalReducer';

export default combineReducers({
  form,
  AuthReducer,
  AccountsReducer,
  TransactionsReducer,
  RecordsReducer,
  AppReducer,
  ModalReducer
});
