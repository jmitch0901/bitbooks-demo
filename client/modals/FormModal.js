import React, { Component } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import { FaTimes } from 'react-icons/fa';

class FormModal extends Component {
  state = {
    showModal: true
  };

  dismiss = () => {
    this.setState({ showModal: false });
    setTimeout(() => {
      this.props.hideModal();
    }, 100);
  };

  onSubmit = () => {
    this.dismiss();
  };

  render() {
    const { type } = this.props;
    const PotentialForm = this.props.formComponent;

    return (
      <Modal
        isOpen={type !== null && this.state.showModal}
        toggle={this.dismiss}
      >
        <div style={styles.modalHeader}>
          <h3>{this.props.title}</h3>
          <Button color="link" style={styles.exitButton} onClick={this.dismiss}>
            <FaTimes />
          </Button>
        </div>
        <ModalBody>
          <PotentialForm extras={this.props.extras} onSubmit={this.onSubmit} />
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

function mapStateToProps(state) {
  const { type } = state.ModalReducer;
  return { type };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ModalActions, dispatch);
}

FormModal = connect(mapStateToProps, mapDispatchToProps)(FormModal);

export { FormModal };
