import React, { useEffect } from "react";
import * as ReactBootstrap from "react-bootstrap";
import { FormGroupTextArea } from "./form-group";
import Error from "./error";
import sjcl from "sjcl";

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
      <Error id="pastealert" />
      <h2 id="paste-title"></h2>
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
  document.querySelector(".slider").style.display = "none";
  document.querySelector(".sliderspacer").style.display = "block";
  axios.get(`/api/v1${new URL(location.href).pathname}`)
    .then(res => {
      document.getElementById("paste-title").innerText = res.data.title || "Untitled";
      if (!key) {
        window.showError(true);
        window.setErrorText("No key specified");
        document.getElementById("body").value = res.data.body;
        return;
      }
      try {
        const decrypted = sjcl.decrypt(key, res.data.body);
        document.getElementById("body").value = sjcl.codec.utf8String.fromBits(sjcl.codec.base64.toBits(decrypted));
      } catch (e) {
        console.error(e);
        window.showError(true);
        window.setErrorText("Invalid key");
      }
    })
    .catch((err) => {
      if (err.response.status === 404) {
        window.showError(true);
        window.setErrorText("Cannot find paste");
        document.getElementById("body").value = "";
      } else {
        window.showError(true);
        window.setErrorText(err.response.data);
        document.getElementById("body").value = "";
      }
    });
}