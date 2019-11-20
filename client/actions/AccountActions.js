import Axios from "axios";
import {
  LOAD_ACCOUNTS,
  LOAD_WALLETS,
  LOAD_ACCOUNTS_SUMMARY,
  LOAD_ACCOUNTS_AVAILABLE_YEARS,
  ACCOUNT_SELECTED,
  ACCOUNT_ADDED,
  WALLET_SELECTED,
  ADD_WALLET,
  YEAR_SELECTED
} from "./types";

export function loadAccountsSummary() {
  return async (dispatch, getState) => {
    const { selectedYear } = getState().AccountsReducer;
    const url = selectedYear
      ? `/api/accounts/summary?year=${selectedYear}`
      : `/api/accounts/summary`;
    const accountsSummaryRes = await Axios.get(url);
    dispatch({
      type: LOAD_ACCOUNTS_SUMMARY,
      payload: accountsSummaryRes.data
    });
  };
}

export function loadAccountsAvailableYears() {
  return async dispatch => {
    const accountsAvailableYearsRes = await Axios.get(
      `/api/accounts/availableYears`
    );
    dispatch({
      type: LOAD_ACCOUNTS_AVAILABLE_YEARS,
      payload: accountsAvailableYearsRes.data
    });
  };
}

export function loadAccountsAndWallets() {
  return async dispatch => {
    const accountsRes = await Axios.get(`/api/accounts`);
    dispatch({
      type: LOAD_ACCOUNTS,
      payload: accountsRes.data
    });

    const walletsRes = await Axios.get(`/api/wallets`);
    dispatch({
      type: LOAD_WALLETS,
      payload: walletsRes.data
    });
  };
}

export function selectAccount(account) {
  return {
    type: ACCOUNT_SELECTED,
    payload: account
  };
}

export function addAccount(account) {
  return async dispatch => {
    const accountRes = await Axios.post("/api/accounts", account);
    dispatch({
      type: ACCOUNT_ADDED,
      payload: accountRes.data
    });
    dispatch(loadAccountsSummary());
  };
}

export function selectWallet(wallet) {
  return {
    type: WALLET_SELECTED,
    payload: wallet
  };
}

export function addWallet(account, wallet) {
  return async dispatch => {
    const { _id, coinSymbol } = account;
    const walletRes = await Axios.post(`/api/accounts/${_id}/wallets`, {
      coinSymbol,
      ...wallet
    });
    dispatch({
      type: ADD_WALLET,
      payload: walletRes.data
    });
    dispatch(loadAccountsSummary());
  };
}

export function deleteWallet(walletId, callbacks) {
  return async dispatch => {
    await Axios.delete(`/api/wallets/${walletId}`);
    callbacks && callbacks();
  };
}

export function commitAccountChange(account, accountWallets, callbacks) {
  return async dispatch => {
    const accountChangePromise = Axios.put(`/api/accounts/${account._id}`, {
      name: account.name
    });
    const walletChangePromises = accountWallets.map(aw =>
      Axios.put(`/api/wallets/${aw._id}`, aw)
    );
    await Promise.all([accountChangePromise, ...walletChangePromises]);
    callbacks && callbacks();
  };
}

export function selectYear(year) {
  return async dispatch => {
    dispatch({
      type: YEAR_SELECTED,
      payload: year
    });
    const accountsSummaryRes = await Axios.get(
      `/api/accounts/summary?year=${year}`
    );
    dispatch({
      type: LOAD_ACCOUNTS_SUMMARY,
      payload: accountsSummaryRes.data
    });
  };
}
