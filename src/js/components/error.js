import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Alert } = ReactBootstrap;

export default function Error({ style, id, message}) {
  return (
    <Alert variant="danger" style={style} id={id}>
      <b>Error!</b>
      <p>{message}</p>
    </Alert>
  )
};