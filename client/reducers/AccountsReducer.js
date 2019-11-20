import Moment from "moment";

import {
  LOAD_ACCOUNTS,
  LOAD_ACCOUNTS_SUMMARY,
  LOAD_ACCOUNTS_AVAILABLE_YEARS,
  LOAD_WALLETS,
  ACCOUNT_SELECTED,
  ACCOUNT_ADDED,
  WALLET_SELECTED,
  ADD_WALLET,
  YEAR_SELECTED,
  LOGOUT
} from "../actions/types";

function accountSorter(a, b) {
  if (a.coinSymbol === b.coinSymbol) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  if (a.coinSymbol < b.coinSymbol) {
    return -1;
  } else if (a.coinSymbol > b.coinSymbol) {
    return 1;
  }
  return 0;
}

const store = {
  accountLookup: {},
  accounts: [],
  accountsSummary: {},
  trackedIncome: {},
  trackedExpenses: {},

  wallets: [],

  availableYears: [],
  selectedYear: null
};

function getTransactionsFromWallet(state, selectedWallet) {
  return state.transactions
    .filter(tx => {
      return tx.wallet == selectedWallet._id;
    })
    .map(t => {
      const tx = { ...t };
      const {
        blockheight,
        txTime,
        receiveTx,
        spendTx,
        priceUSDTimeOfTx,
        coinSymbol,
        txFee
      } = tx;
      // Generate chart meta. Isolate logic here
      tx.chartMeta = {};
      tx.chartMeta.blockheight = blockheight;
      tx.chartMeta.coinSymbol = coinSymbol;
      tx.chartMeta.txDate = Moment(txTime).format("MM/DD/YYYY");
      tx.chartMeta.txTime = Moment(txTime).format("hh:mma");
      tx.chartMeta.priceUSDTimeOfTx = parseFloat(priceUSDTimeOfTx.toFixed(2));
      tx.chartMeta.receiveTx = parseFloat(receiveTx.toFixed(8));
      tx.chartMeta.spendTx = parseFloat(spendTx.toFixed(8));
      tx.chartMeta.txFee = parseFloat(txFee.toFixed(8));
      tx.chartMeta.netTotal = parseFloat(
        (receiveTx - (spendTx + txFee)).toFixed(8)
      );
      tx.chartMeta.netUSDTotal = parseFloat(
        (tx.chartMeta.netTotal * priceUSDTimeOfTx).toFixed(2)
      );
      return tx;
    });
}

export default function(state = store, action) {
  switch (action.type) {
    case LOAD_ACCOUNTS: {
      const accounts = action.payload.sort(accountSorter);
      const accountLookup = {};
      accounts.forEach(a => (accountLookup[a._id] = a));
      console.log("ACCOUNT LOOKUP: ", accountLookup);
      return { ...state, accounts, accountLookup };
    }
    case LOAD_ACCOUNTS_SUMMARY: {
      const {
        accountsSummary,
        trackedIncome,
        trackedExpenses
      } = action.payload;
      return {
        ...state,
        accountsSummary,
        trackedIncome,
        trackedExpenses
      };
    }
    case LOAD_ACCOUNTS_AVAILABLE_YEARS: {
      const availableYears = [...action.payload];
      const currentYear = parseInt(new Date().getFullYear());
      if (
        availableYears.length === 0 ||
        !availableYears.find(y => y === currentYear)
      ) {
        availableYears.unshift(currentYear);
      }
      const selectedYear =
        state.selectedYear === null ? availableYears[0] : state.selectedYear;
      return { ...state, availableYears, selectedYear };
    }
    case YEAR_SELECTED: {
      const selectedYear = action.payload;
      return { ...state, selectedYear };
    }
    case LOAD_WALLETS: {
      return { ...state, wallets: action.payload };
    }
    case ACCOUNT_SELECTED: {
      const selectedAccount = action.payload;
      const selectedWallets = state.wallets.filter(
        w => w.account === selectedAccount._id
      );
      const selectedTransactions = selectedWallets
        .reduce((prev, curr) => {
          return [...prev, ...getTransactionsFromWallet(state, curr)];
        }, [])
        .reverse();
      return { ...state, selectedTransactions };
    }
    case ACCOUNT_ADDED: {
      const account = action.payload;
      const accounts = [...state.accounts, account].sort(accountSorter);
      const accountLookup = { ...state.accountLookup, [account._id]: account };
      return { ...state, accounts, accountLookup };
    }
    case WALLET_SELECTED: {
      const selectedWallet = action.payload;
      const selectedTransactions = getTransactionsFromWallet(
        state,
        selectedWallet
      ).reverse();
      return { ...state, selectedTransactions };
    }
    case ADD_WALLET: {
      const wallets = [...state.wallets, action.payload];
      return { ...state, wallets };
    }
    case LOGOUT: {
      return store;
    }
  }
  return state;
}
