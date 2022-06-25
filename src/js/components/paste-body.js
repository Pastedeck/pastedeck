import React, { useEffect } from "react";
import * as ReactBootstrap from "react-bootstrap";
import { FormGroupTextArea } from "./form-group";
import Error from "./error";

import axios from "axios";
const { Container, Alert } = ReactBootstrap;
import Slider from "./slider";

export default function PasteBody() {
  useEffect(() => {
    load();
  });
  return (
    <Container>
      <Slider />
      <Error id="pastealert" style={{ display: "none" }} message="" />
      <FormGroupTextArea rows={10} readonly={true} id="body" value="Loading..." />

    </Container>
  )
}

function load() {
  console.log("hello");
  const url = new URL(location.href);
  console.log(url);
  const key = url.searchParams.get("key");
  console.log(key);
  if (!code) {
    document.getElementById("pastealert").style.display = "block";
    document.getElementById("pastealert").innerText = "No key specified";
    document.getElementById("body").value = "";
    return;
  }
}