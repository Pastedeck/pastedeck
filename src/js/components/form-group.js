import React from "react";
import Required from "./required";

class FormGroupText extends React.Component {
  render() {
    return (
      <Form.Group className={this.props.mb}>
        <Form.Label className="text-light">{this.props.label} {this.props.required ? <Required />:""}</Form.Label>
        <Form.Control required={this.props.required} type="text" />
      </Form.Group>
    )
  }
};

class FormGroupTextArea extends React.Component {
  render() {
    return (
      <Form.Group className={this.props.mb}>
        <Form.Label className="text-light">{this.props.label} {this.props.required ? <Required />:""}</Form.Label>
        <Form.Control as="textarea" rows={this.props.rows} required={this.props.required} />
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
}

export { FormGroupText, FormGroupTextArea };