import { LOAD_RECORD_TYPES, LOAD_RECORDS, LOAD_FEE_RECORDS } from './types';

import QueryString from 'query-string';
import Axios from 'axios';

export function loadRecordTypes() {
  return async (dispatch, getState) => {
    const { recordTypes } = getState().RecordsReducer;
    if (recordTypes && recordTypes.length > 0) {
      return;
    }
    const recordTypesRes = await Axios.get(`/api/records/types`);
    dispatch({
      type: LOAD_RECORD_TYPES,
      payload: recordTypesRes.data
    });
  };
}

export function loadCoinRecords(
  coinSymbol = 'ALL',
  page = 1,
  limit = 100,
  recordType = 'INC'
) {
  return async (dispatch, getState) => {
    const { selectedYear } = getState().AccountsReducer;
    const queryString = QueryString.stringify({
      year: selectedYear,
      page,
      limit,
      coinSymbol,
      recordType
    });
    const recordsRes = await Axios.get(`/api/records?${queryString}`);
    const recordResponse = recordsRes.data;
    dispatch({
      type: LOAD_RECORDS,
      payload: { recordResponse, loadedCoin: coinSymbol }
    });
  };
}

export function reloadRecords() {
  return (dispatch, getState) => {
    const { loadedCoin } = getState().RecordsReducer;
    return dispatch(loadCoinRecords(loadedCoin));
  };
}

export function loadFeeRecords() {
  return async (dispatch, getState) => {
    const { selectedYear } = getState().AccountsReducer;
    const feeRecordRes = await Axios.get(
      `/api/accounts/records?year=${selectedYear}&type=FEE`
    );
    dispatch({
      type: LOAD_FEE_RECORDS,
      payload: feeRecordRes.data
    });
  };
}
