import {
  LOAD_RECORD_TYPES,
  LOAD_RECORDS,
  LOAD_FEE_RECORDS,
  LOGOUT
} from '../actions/types';

const store = {
  recordTypes: [],
  loadedRecords: [],
  loadedCoin: null,

  total: 0,
  coinTotal: 0,

  pagination: {
    total: 0,
    pages: 0,
    page: 1,
    limit: 50
  }
};

export default function(state = store, action) {
  switch (action.type) {
    case LOAD_RECORD_TYPES: {
      const recordTypes = action.payload;
      return { ...state, recordTypes };
    }
    case LOAD_RECORDS: {
      const recordsCopy = { ...action.payload.recordResponse.records };
      delete recordsCopy.docs;
      const { loadedCoin } = action.payload;
      const { records, total, coinTotal } = action.payload.recordResponse;
      const loadedRecords = records.docs;
      return {
        ...state,
        loadedRecords,
        pagination: recordsCopy,
        total,
        coinTotal,
        loadedCoin
      };
    }
    case LOAD_FEE_RECORDS: {
      const loadedRecords = action.payload;
      return { ...state, loadedRecords };
    }
    case LOGOUT: {
      return store;
    }
  }
  return state;
}
