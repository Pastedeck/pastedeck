import React from "react";
import * as ReactBootstrap from "react-bootstrap";
import { FormGroupTextArea } from "./form-group";
import Error from "./error";

import axios from "axios";
const { Container, Alert } = ReactBootstrap;
import Slider from "./slider";

export default class PasteBody extends React.Component {
  render() {
    return (
      <Container onLoad={this.load}>
        <Slider />
        <Error id="pastealert" style={{ display: "none" }} message="" />
        <FormGroupTextArea rows={10} readonly={true} id="body" value="Loading..." />

      </Container>
    )
  }
  load() {
    const url = new URL(location.href);
    const code = url.searchParams.get("code");
    if (!code) {
      document.getElementById("pastealert").style.display = "block";
      document.getElementById("pastealert").innerText = "No code specified";
      document.getElementById("body").value = "";
      return;
    }
  }
}