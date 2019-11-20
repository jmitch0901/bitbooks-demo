import Moment from 'moment';

import {
  LOAD_TRANSACTIONS,
  LOAD_INCOMING_TRANSACTIONS,
  INSPECT_TRANSACTION,
  TRANSACTION_FORCE_UNSELECT,
  TRANSACTION_SELECTED,
  SELECT_ALL_TRANSACTIONS,
  TRANSACTION_ACCEPTED,
  TRANSACTION_DISCARDED,
  FILTERABLE_COINS_RECEIVED,
  LOGOUT
} from '../actions/types';

const store = {
  transactions: [],

  transactionsToApprove: [],
  selectedTransactionIds: new Set(),

  transactionsToApprovePagination: {
    total: 0,
    pages: 0,
    page: 1,
    limit: 50
  },

  filterableCoins: [],

  availableYears: [],
  selectedYear: null,

  inspectedTransaction: null,
  inspectedTxWallet: null,
  inspectedTxAccount: null
};

function getChartMeta(tx) {
  const {
    blockheight,
    txTime,
    receiveTx,
    spendTx,
    coinSymbol,
    txFee,
    timeOfTxValue
  } = tx;

  // Generate chart meta. Isolate logic here
  const chartMeta = {};

  chartMeta.blockheight = blockheight;
  chartMeta.coinSymbol = coinSymbol;
  chartMeta.txDate = Moment(txTime).format('MM/DD/YYYY');
  chartMeta.txTime = Moment(txTime).format('hh:mma');
  chartMeta.timeOfTxValue = parseFloat(timeOfTxValue.toFixed(2));
  chartMeta.receiveTx = parseFloat(receiveTx.toFixed(8));
  chartMeta.spendTx = parseFloat(spendTx.toFixed(8));
  chartMeta.txFee = parseFloat(txFee.toFixed(8));
  chartMeta.netTotal = parseFloat((receiveTx - (spendTx + txFee)).toFixed(8));
  chartMeta.netValue = parseFloat(
    (chartMeta.netTotal * timeOfTxValue).toFixed(2)
  );

  return chartMeta;
}

export default function(state = store, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS: {
      const transactions = action.payload.docs
        // .sort((a,b) => {
        //   return new Date(b.txTime) - new Date(a.txTime);
        // })
        .map(tx => {
          const toReturn = { ...tx };
          toReturn.chartMeta = getChartMeta(toReturn);
          return toReturn;
        });
      return { ...state, transactions };
    }
    case LOAD_INCOMING_TRANSACTIONS: {
      const payloadCopy = { ...action.payload };
      delete payloadCopy.docs;
      const transactionsToApprovePagination = payloadCopy;
      const transactionsToApprove = action.payload.docs
        // .sort((a,b) => {
        //   return new Date(a.txTime) - new Date(b.txTime);
        // })
        .map(tx => {
          const toReturn = { ...tx };
          toReturn.chartMeta = getChartMeta(toReturn);
          return toReturn;
        });
      return {
        ...state,
        transactionsToApprovePagination,
        transactionsToApprove,
        selectedTransactionIds: new Set()
      };
    }
    case INSPECT_TRANSACTION: {
      const selected = action.payload;
      if (selected === null) {
        // then we are unselecting a transaction
        return {
          ...state,
          inspectedTransaction: null,
          inspectedTxWallet: null,
          inspectedTxAccount: null
        };
      }
      const {
        inspectedTransaction,
        inspectedTxWallet,
        inspectedTxAccount
      } = selected;
      const shouldUninspect =
        state.inspectedTransaction &&
        inspectedTransaction._id === state.inspectedTransaction._id;
      return {
        ...state,
        inspectedTransaction: shouldUninspect ? null : inspectedTransaction,
        inspectedTxWallet,
        inspectedTxAccount
      };
    }
    case TRANSACTION_SELECTED: {
      const selected = action.payload;
      if (
        state.inspectedTransaction &&
        state.inspectedTransaction._id === selected._id
      ) {
        return state;
      }
      const copiedSet = new Set(state.selectedTransactionIds);
      if (copiedSet.has(selected._id)) {
        copiedSet.delete(selected._id);
      } else {
        copiedSet.add(selected._id);
      }
      return { ...state, selectedTransactionIds: copiedSet };
    }
    case TRANSACTION_FORCE_UNSELECT: {
      const unselected = action.payload;
      const copiedSet = new Set(state.selectedTransactionIds);
      copiedSet.delete(unselected._id);
      return { ...state, selectedTransactionIds: copiedSet };
    }
    case SELECT_ALL_TRANSACTIONS: {
      if (
        state.selectedTransactionIds.size === state.transactionsToApprove.length
      ) {
        return { ...state, selectedTransactionIds: new Set() };
      }
      // Should only show transactions currently shown to user
      const transactionsToShow = state.transactionsToApprove.map(tx => tx._id);
      return { ...state, selectedTransactionIds: new Set(transactionsToShow) };
    }
    case TRANSACTION_ACCEPTED: {
      const transaction = action.payload;
      if (transaction.isAcceptedByUser) {
        const transactionsToApprove = [...state.transactionsToApprove].filter(
          t => {
            return t._id !== transaction._id;
          }
        );
        return { ...state, transactionsToApprove };
      }
    }
    case TRANSACTION_DISCARDED: {
      const transaction = action.payload;
      if (transaction.isDiscardedByUser) {
        const transactionsToApprove = [...state.transactionsToApprove].filter(
          t => {
            return t._id !== transaction._id;
          }
        );
        return { ...state, transactionsToApprove };
      }
    }
    case FILTERABLE_COINS_RECEIVED: {
      const filterableCoins = action.payload;
      return { ...state, filterableCoins };
    }
    case LOGOUT: {
      return store;
    }
  }
  return state;
}
