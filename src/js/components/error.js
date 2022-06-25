import React, { useState } from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Alert } = ReactBootstrap;

export default function Error({ id }) {
  const [show, setShow] = useState(false);
  window.showError = setShow;
  const [messageText, setMessageText] = useState("");
  window.setErrorText = setMessageText;
  return (
    <Alert variant="danger" style={show ? { display: "block"}: { display: "none"} } id={id}>
      <b>Error!</b>
      <p>{messageText}</p>
    </Alert>
  )
};