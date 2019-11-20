import {
  LOAD_INCOMING_TRANSACTIONS,
  INSPECT_TRANSACTION,
  TRANSACTION_SELECTED,
  TRANSACTION_FORCE_UNSELECT,
  SELECT_ALL_TRANSACTIONS,
  TRANSACTION_ACCEPTED,
  BULK_ACCEPT_TRANSACTIONS,
  BULK_DISCARD_TRANSACTIONS,
  TRANSACTION_DISCARDED,
  FILTERABLE_COINS_RECEIVED
} from './types';

import QueryString from 'query-string';
import Axios from 'axios';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function loadIncomingTransactions(
  page = 1,
  limit = 100,
  sortBy = 'txTime',
  sortDirection = 'ASC',
  coinSymbol = 'ALL',
  isAcceptedByUser = false
) {
  const queryString = QueryString.stringify({
    isAcceptedByUser,
    page,
    limit,
    sortBy,
    sortDirection,
    coinSymbol
  });
  return async (dispatch, getState) => {
    //dispatch(AppActions.togglePageLoading(true));
    while (!getState().AppReducer.isInitialized) {
      console.log('WAITING FOR INIT');
      await sleep(500);
    }
    const transactionRes = await Axios.get(`/api/transactions?${queryString}`);
    dispatch({
      type: LOAD_INCOMING_TRANSACTIONS,
      payload: transactionRes.data
    });
    if (transactionRes.data.length > 0) {
      dispatch(transactionSelected(transactionRes.data[0]));
    }
  };
}

export function inspectTransaction(inspectedTransaction) {
  return (dispatch, getState) => {
    if (inspectedTransaction === null) {
      return dispatch({
        type: INSPECT_TRANSACTION,
        payload: null
      });
    }
    dispatch({
      type: TRANSACTION_FORCE_UNSELECT,
      payload: inspectedTransaction
    });
    const { accounts, wallets } = getState().AccountsReducer;
    const inspectedTxAccount = accounts.find(
      a => a._id === inspectedTransaction.account
    );
    const inspectedTxWallet = wallets.find(
      w => w._id === inspectedTransaction.wallet
    );
    dispatch({
      type: INSPECT_TRANSACTION,
      payload: {
        inspectedTransaction,
        inspectedTxAccount,
        inspectedTxWallet
      }
    });
  };
}

export function inspectTransactionFromRecord(record = null) {
  return async (dispatch, getState) => {
    if (record === null) {
      return dispatch({
        type: INSPECT_TRANSACTION,
        payload: null
      });
    }
    const { blockRecord } = record;

    const parentTransactionRes = await Axios.get(
      `/api/transactions/${blockRecord._id}`
    );

    const { accounts, wallets } = getState().AccountsReducer;

    const inspectedTransaction = parentTransactionRes.data;
    const inspectedTxAccount = accounts.find(
      a => a._id === inspectedTransaction.account
    );
    const inspectedTxWallet = wallets.find(
      w => w._id === inspectedTransaction.wallet
    );

    dispatch({
      type: INSPECT_TRANSACTION,
      payload: {
        inspectedTransaction,
        inspectedTxAccount,
        inspectedTxWallet
      }
    });
  };
}

export function selectTransaction(tx) {
  return dispatch => {
    dispatch({
      type: TRANSACTION_SELECTED,
      payload: tx
    });
  };
}

export function selectAllTransactions() {
  return {
    type: SELECT_ALL_TRANSACTIONS
  };
}

export function acceptTransaction(transaction, callbacks) {
  return async (dispatch, getState) => {
    const { _id } = transaction;
    const acceptedRes = await Axios.put(
      `/api/transactions/${_id}/accept`,
      transaction
    );
    dispatch({
      type: TRANSACTION_ACCEPTED,
      payload: acceptedRes.data
    });
    callbacks && callbacks();
  };
}

export function bulkAcceptTransactions(selectedTransactionIds, callbacks) {
  return async (dispatch, getState) => {
    const bulkAcceptedRes = await Axios.put(
      `/api/transactions/bulkAccept`,
      selectedTransactionIds
    );
    dispatch({
      type: BULK_ACCEPT_TRANSACTIONS,
      payload: bulkAcceptedRes.data
    });
    if (callbacks) {
      callbacks();
    }
  };
}

export function bulkDiscardTransactions(selectedTransactionIds, callbacks) {
  return async (dispatch, getState) => {
    const bulkDiscardedRes = await Axios.put(
      `/api/transactions/bulkDiscard`,
      selectedTransactionIds
    );
    dispatch({
      type: BULK_DISCARD_TRANSACTIONS,
      payload: bulkDiscardedRes.data
    });
    if (callbacks) {
      callbacks();
    }
  };
}

export function discardTransaction(transaction) {
  return async (dispatch, getState) => {
    const { _id } = transaction;
    const acceptedRes = await Axios.put(
      `/api/transactions/${_id}/discard`,
      transaction
    );
    dispatch({
      type: TRANSACTION_DISCARDED,
      payload: acceptedRes.data
    });

    // Next line is so that the TransactionInspectionWidget moves to next line
    const transactionsToApprove = [
      ...getState().TransactionsReducer.transactionsToApprove
    ];
    if (transactionsToApprove.length > 0) {
      dispatch(transactionSelected(transactionsToApprove[0]));
    }
  };
}

export function getFilterableCoins() {
  return async (dispatch, getState) => {
    const filterableCoinsRes = await Axios.get(
      `/api/transactions/filterableCoins`
    );
    dispatch({
      type: FILTERABLE_COINS_RECEIVED,
      payload: filterableCoinsRes.data
    });
  };
}
