import {
  SHOW_MODAL,
  HIDE_MODAL
} from './types';

export const showModal = (type, data={}) => {
  
  const { props={}, extras={} } = data;
  const newProps = {...props, extras};

  return {
    type: SHOW_MODAL,
    payload: {
      type,
      props: newProps
    }
  };
};

export const hideModal = () => {
  return {
    type: HIDE_MODAL
  }
};
