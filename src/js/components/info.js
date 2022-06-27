import React, { useState } from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Alert } = ReactBootstrap;

export default function Info({ id }) {
  const [show, setShow] = useState(false);
  window.showInfo = setShow;
  const [messageText, setMessageText] = useState("");
  window.setInfoText = setMessageText;
  return (
    <Alert variant="info" style={show ? { display: "block"}: { display: "none"} } id={id}>
      <p>{messageText}</p>
    </Alert>
  )
};