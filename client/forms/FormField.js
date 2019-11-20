// Wrapper class for reduxForm with reactstrap input

import React from 'react';
import { Field } from 'redux-form';
import { Input, Label } from 'reactstrap';

const FormField = (props) => {


  const { label, children } = props;

  let copiedProps = { ...props };

  delete copiedProps['label'];
  delete copiedProps['children'];

  return (
    <div>
      <Label>{label}</Label>
      <Input {...copiedProps} tag={Field}>
        {children}
      </Input>
    </div>
  );
};

const styles = {
  error: {
    color: 'red'
  }
}
export { FormField };
