import React, { Component } from 'react';
import { Button, Form, FormGroup, Jumbotron, Alert } from 'reactstrap';

import { FormField } from './';

class AddWalletForm extends Component {
  onSubmit = formValues => {
    const { parentAccount } = this.props.extras;
    if (parentAccount) {
      this.props.addWallet(parentAccount, formValues);
    } else {
      const account = this.props.accounts.find(
        acc => acc.name === formValues.account
      );
      this.props.addWallet(account, formValues);
    }

    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  renderAccountOptions = () => {
    return this.props.accounts.map(acc => {
      return <option key={acc._id}>{acc.name}</option>;
    });
  };

  renderAccountSelectionArea = () => {
    const { parentAccount } = this.props.extras;

    if (!parentAccount) {
      return (
        <FormGroup>
          <FormField
            label="Select Account"
            name="account"
            type="select"
            component="select"
          >
            <option value="" disabled selected>
              (Select Account)
            </option>
            {this.renderAccountOptions()};
          </FormField>
        </FormGroup>
      );
    }

    return (
      <div>
        <center>
          <h4>
            Wallet will be under <strong>{parentAccount.coinSymbol}</strong>{' '}
            account:
          </h4>
        </center>
        <Jumbotron style={{ padding: '2rem' }}>
          <h4>
            <strong>
              <center>{parentAccount.name}</center>
            </strong>
          </h4>
        </Jumbotron>
        <Alert color="warning">
          Please use the following Wallet Address for Demo:
          <br />
          0x9ba3756de13a43f15c9f40a973c03f6b35565c9d
        </Alert>
      </div>
    );
  };

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit).bind(this)}>
        {this.renderAccountSelectionArea()}
        <FormGroup>
          <FormField
            label="Wallet Name"
            name="name"
            type="text"
            component="input"
            placeholder="Mining Wallet"
          />
        </FormGroup>
        <FormGroup>
          <FormField
            label="Wallet Address"
            name="publicAddress"
            type="text"
            component="input"
            placeholder="0x9ba3756de13a43f15c9f40a973c03f6b35565c9d"
          />
        </FormGroup>
        <FormGroup>
          <Button type="submit">Submit</Button>
        </FormGroup>
      </Form>
    );
  }
}

function validate() {
  const errors = {};

  return errors;
}

import { reduxForm } from 'redux-form';

AddWalletForm = reduxForm({
  form: 'addWallet',
  fields: ['walletAddress', 'coinSymbol'],
  validate
})(AddWalletForm);

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../actions/AccountActions';

function mapStateToProps(state) {
  const { accounts } = state.AccountsReducer;
  return { accounts };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch);
}

AddWalletForm = connect(mapStateToProps, mapDispatchToProps)(AddWalletForm);

export { AddWalletForm };
