import React from "react";
import Required from "./required";
import * as ReactBootstrap from "react-bootstrap";

const { Form } = ReactBootstrap;

const FormGroupText = React.memo(({ mb = "mb-3", label, required = false, id, value = "", onChange }) => {
  return (
    <Form.Group className={mb}>
      <Form.Label className="text-light">{label} {required ? <Required /> : ""}</Form.Label>
      <Form.Control required={required} type="text" id={id} value={value} onChange={onChange} />
    </Form.Group>
  )
});

const FormGroupTextArea = React.memo(({ mb = "mb-3", label, required = false, id, onChange, readonly = false, value = "", rows = 10 }) => {
  return (
    <Form.Group className={mb}>
      <Form.Label className="text-light">{label} {required ? <Required /> : ""}</Form.Label>
      <Form.Control as="textarea" rows={rows} required={required} id={id} readOnly={readonly} value={value} onChange={onChange} />
    </Form.Group>
  )
});


export { FormGroupText, FormGroupTextArea };