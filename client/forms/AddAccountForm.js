import React, { Component } from 'react';
import { Button, Form, FormGroup } from 'reactstrap';

import { FormField } from './';

class AddAccountForm extends Component {
  onSubmit = formValues => {
    this.props.addAccount(formValues);
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  render() {
    const { fields } = this.props;

    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit).bind(this)}>
        <FormGroup>
          <FormField
            label="Coin Type"
            name="coinSymbol"
            type="select"
            component="select"
          >
            <option value="" disabled selected>
              (Select Coin)
            </option>
            <option>ETH</option>
          </FormField>
        </FormGroup>
        <FormGroup>
          <FormField
            label="Account Name"
            name="name"
            type="text"
            component="input"
            placeholder="ETH Mining Account"
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

AddAccountForm = reduxForm({
  form: 'addAccount',
  fields: ['accountName', 'coinSymbol'],
  validate
})(AddAccountForm);

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../actions/AccountActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch);
}

AddAccountForm = connect(null, mapDispatchToProps)(AddAccountForm);

export { AddAccountForm };
