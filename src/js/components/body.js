import React from "react";
import * as ReactBootstrap from "react-bootstrap";
import Slider from "./slider";
import { FormGroupText, FormGroupTextArea } from "./form-group";

const { Container, Form, Button } = ReactBootstrap;
import sjcl from "sjcl";
import axios from "axios";

export default class Body extends React.Component {
  constructor() {
    super();
    this.state = {
      body: "",
    };
  }
  render() {
    return (
      <Container>
        <Slider />
        <Form onSubmit={this.submit}>
          <FormGroupTextArea required={true} label="Body text" id="body" value={this.state.body} onChange={(e) => this.setState({ body: e.target.value })} />
          <FormGroupText label="Title" id="title" />
          <FormGroupText label="BTC Address" id="btc" />
          <span id="submitspan">
            <Button variant="primary" type="submit" id="submitbtn">Submit</Button>
            <p style={{ display: "none" }} className="text-muted" id="submittext">Submitting...</p>
          </span>
        </Form>
      </Container>
    )
  }
  submit(e) {
    e.preventDefault();
    console.log("submit");
    document.getElementById("submitbtn").disabled = true;
    document.querySelector(".slider").style.display = "block";
    document.querySelector(".sliderspacer").style.display = "none";
    const text = document.getElementById("submittext")
    text.style.display = "block";
    text.innerText = "Generating Key...";
    const content = document.getElementById("body").value;
    const title = document.getElementById("title").value;
    const btc = document.getElementById("btc").value;
    const key = Body.makeKey(256);
    text.innerText = "Encoding base64...";
    const junbi = sjcl.codec.utf8String.toBits(content);
    const encoded = sjcl.codec.base64.fromBits(junbi);
    text.innerText = "Encryting...";
    const encrypted = sjcl.encrypt(key, encoded);
    text.innerText = "Sending to server...";
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (btc) params.append("btc", btc);
    params.append("content", encrypted);
    const url = `/api/v1/paste`;
    axios.post(url, params)
    .then(res => {
      text.innerText = "Success!";
      location.href = `/paste/${res.data.code}?key=${key}`;
    })
    .catch((err) => {
      text.innerText = `Error: ${err.response.data}`;
      document.getElementById("submitbtn").disabled = false;
      document.querySelector(".slider").style.display = "none";
      document.querySelector(".sliderspacer").style.display = "block";
    })
  }
  static makeKey(entropy) {
    entropy = Math.ceil(entropy / 6) * 6;
    const key = sjcl.bitArray.clamp(
      sjcl.random.randomWords(Math.ceil(entropy / 32), 0),
      entropy
    );
    return sjcl.codec.base64
      .fromBits(key)
      .replace(/\=+$/, "")
      .replace(/\//, "-");
  }
};