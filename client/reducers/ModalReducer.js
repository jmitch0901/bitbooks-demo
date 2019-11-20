import { SHOW_MODAL, HIDE_MODAL, LOGOUT } from '../actions/types';

const store = {
  type: null,
  props: {}
};

export default function(state = store, action) {
  switch (action.type) {
    case SHOW_MODAL: {
      const { type, props } = action.payload;
      return { ...state, type, props };
    }
    case HIDE_MODAL: {
      return store;
    }
    case LOGOUT: {
      return store;
    }
  }

  return state;
}
