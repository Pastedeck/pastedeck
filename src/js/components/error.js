import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Alert } = ReactBootstrap;

export default class Error extends React.Component {
  render() {
    return (
      <Alert variant="danger" style={this.props.style} id={this.props.id}>
        <b>Error!</b>
        <p>{this.props.message}</p>
      </Alert>
    )
  }
};