import React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';

export const ReactstrapInput = ({
  field: { ...fields },
  form: { isSubmitting, touched, errors },
  ...props
}) => (
  <FormGroup>
    <Label for={fields.name} className="label-color">
      {props.label}
    </Label>
    <Input
      {...props}
      {...fields}
      invalid={Boolean(touched[fields.name] && errors[fields.name])}
      disabled={isSubmitting}
    />
    {touched[fields.name] && errors[fields.name] ? (
      <FormFeedback>{errors[fields.name]}</FormFeedback>
    ) : (
      ''
    )}
  </FormGroup>
);

export const ReactstrapSelect = ({
  field: { ...fields },
  form: { setFieldValue, touched, errors, isSubmitting },
  ...props
}) => {
  const error = errors[fields.name];
  const touch = touched[fields.name];

  return (
    <FormGroup>
      <Label for={fields.name} className="label-color">
        {props.label}
      </Label>
      <Select
        {...props}
        {...fields}
        value={props.value}
        onChange={option => setFieldValue(fields.name, option)}
        onBlur={fields.onBlur}
        isDisabled={isSubmitting}
      />
      {touch && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

export const ReactstrapCheckbox = ({
  field: { ...fields },
  form: { isSubmitting, touched, errors },
  ...props
}) => (
  <FormGroup check>
    <Label className="label-color" check>
      <Input
        {...props}
        {...fields}
        checked={fields.value}
        invalid={Boolean(touched[fields.name] && errors[fields.name])}
        disabled={isSubmitting}
      />
      {props.label}
    </Label>
    {touched[fields.name] && errors[fields.name] ? (
      <FormFeedback>{errors[fields.name]}</FormFeedback>
    ) : (
      ''
    )}
  </FormGroup>
);

/* export const ReactstrapRadioInput = ({
  field: { name, value },
  form: { setFieldValue, values },
  disabled = false,
  label,
  ...props
}) => (
  <FormGroup check inline>
    <Label for="inp">
      <Input
        type="radio"
        name={field.name}
        checked={values[field.name] === field.value}
        value={field.value}
        onChange={(event, value) => setFieldValue(field.name, field.value)}
      />
      {label}
    </Label>
  </FormGroup>
); */
