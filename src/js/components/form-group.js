import React from "react";
import Required from "./required";
import * as ReactBootstrap from "react-bootstrap";

const { Form } = ReactBootstrap;

class FormGroupText extends React.Component {
  render() {
    return (
      <Form.Group className={this.props.mb}>
        <Form.Label className="text-light">{this.props.label} {this.props.required ? <Required />:""}</Form.Label>
        <Form.Control required={this.props.required} type="text" id={this.props.id} />
      </Form.Group>
    )
  }
};

class FormGroupTextArea extends React.Component {
  render() {
    return (
      <Form.Group className={this.props.mb}>
        <Form.Label className="text-light">{this.props.label} {this.props.required ? <Required />:""}</Form.Label>
        <Form.Control as="textarea" rows={this.props.rows} required={this.props.required} id={this.props.id} readOnly={this.props.readonly} value={this.props.value} onChange={this.props.onChange} />
      </Form.Group>
    )
  }
};

FormGroupText.defaultProps = {
  mb: "mb-3",
  required: false,
}

FormGroupTextArea.defaultProps = {
  mb: "mb-3",
  required: false,
  rows: 10,
  readonly: false,
  value: "",
}

export { FormGroupText, FormGroupTextArea };