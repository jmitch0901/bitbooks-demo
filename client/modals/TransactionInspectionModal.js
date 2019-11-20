import React, { Component } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import { FaTimes } from 'react-icons/fa';

import { TransactionInspectionWidget } from '../components/widgets';

class TransactionInspectionModal extends Component {
  state = {
    showModal: true
  };

  componentWillMount() {
    this.props.inspectTransactionFromRecord(this.props.extras.record);
  }

  componentWillUnmount() {
    this.props.inspectTransactionFromRecord(null);
  }

  dismiss = () => {
    this.setState({ showModal: false });
    setTimeout(() => {
      this.props.hideModal();
    }, 100);
  };

  _onActionComplete = () => {
    this.props.reloadRecords();
    this.dismiss();
  };

  render() {
    const { type } = this.props;

    return (
      <Modal
        isOpen={type !== null && this.state.showModal}
        toggle={this.dismiss}
        size="lg"
        style={{ maxWidth: '1800px' }}
      >
        <div style={styles.modalHeader}>
          <h3>{this.props.title}</h3>
          <Button color="link" style={styles.exitButton} onClick={this.dismiss}>
            <FaTimes />
          </Button>
        </div>
        <ModalBody>
          <TransactionInspectionWidget
            title="Record Breakdown"
            inspectionFromRecord={this.props.extras.record}
            onActionComplete={this._onActionComplete}
          />
        </ModalBody>
      </Modal>
    );
  }
}

const styles = {
  modalHeader: {
    fontSize: '18pt',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  exitButton: {
    fontSize: '18pt',
    color: 'black'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as ModalActions from '../actions/ModalActions';
import * as TransactionActions from '../actions/TransactionActions';
import * as RecordActions from '../actions/RecordActions';

function mapStateToProps(state) {
  const { type } = state.ModalReducer;
  return { type };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...ModalActions, ...TransactionActions, ...RecordActions },
    dispatch
  );
}

TransactionInspectionModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionInspectionModal);

export { TransactionInspectionModal };
