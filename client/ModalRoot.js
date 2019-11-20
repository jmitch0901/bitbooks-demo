import React from 'react';

// Modal Types
import {
  MODAL_ADD_ACCOUNT,
  MODAL_ADD_WALLET,
  MODAL_VIEW_PARENT_TRANSACTION
} from './modals/types';

// Forms for Modal
import { AddAccountForm, AddWalletForm } from './forms';

// Modal Components
import { FormModal, TransactionInspectionModal } from './modals';

const MODAL_COMPONENTS = {
  [MODAL_ADD_ACCOUNT]: {
    title: 'Create New Account',
    modal: FormModal,
    form: AddAccountForm
  },
  [MODAL_ADD_WALLET]: {
    title: 'Add a Wallet',
    modal: FormModal,
    form: AddWalletForm
  },
  [MODAL_VIEW_PARENT_TRANSACTION]: {
    title: 'Parent Transaction from Record',
    modal: TransactionInspectionModal,
    form: null
  }
};

const ModalRoot = ({ type, props }) => {
  if (!type) {
    return null;
  }

  const ModalComponent = MODAL_COMPONENTS[type].modal;
  const FormComponent = MODAL_COMPONENTS[type].form;
  const title = MODAL_COMPONENTS[type].title;

  return (
    <ModalComponent
      {...props}
      formComponent={FormComponent}
      title={title}
      extras={props.extras}
    />
  );
};

// Redux
import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { type, props } = state.ModalReducer;
  return { type, props };
}

export default connect(mapStateToProps)(ModalRoot);
