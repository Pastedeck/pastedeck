import React, { useState } from "react";
import * as ReactBootstrap from "react-bootstrap";
import Slider from "./slider";
import { FormGroupText, FormGroupTextArea } from "./form-group";

const { Container, Form, Button } = ReactBootstrap;
import sjcl from "sjcl";
import axios from "axios";

const submit = (e) => {
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
  const key = makeKey(256);
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
      localStorage.setItem(res.data.code, res.data.ownerKey);
      location.href = `/paste/${res.data.code}?key=${key}`;
    })
    .catch((err) => {
      text.innerText = `Error: ${err.response.data}`;
      document.getElementById("submitbtn").disabled = false;
      document.querySelector(".slider").style.display = "none";
      document.querySelector(".sliderspacer").style.display = "block";
    })
}

const makeKey = (entropy) => {
  entropy = Math.ceil(entropy / 6) * 6;
  const key = sjcl.bitArray.clamp(
    sjcl.random.randomWords(Math.ceil(entropy / 32), 0),
    entropy
  );
  return sjcl.codec.base64
    .fromBits(key)
    .replace(/\=+$/, "")
    .replace(/\//, "-");
};

export default function Body() {
  const [body, setBody] = useState("");
  return (
    <Container>
      <Slider />
      <Form onSubmit={submit}>
        <FormGroupTextArea required={true} label="Body text" id="body" value={body} onChange={(e) => setBody(e.target.value)} />
        <FormGroupText label="Title" id="title" />
        <FormGroupText label="BTC Address" id="btc" />
        <span id="submitspan">
          <Button variant="primary" type="submit" id="submitbtn">Submit</Button>
          <p style={{ display: "none" }} className="text-muted" id="submittext">Submitting...</p>
        </span>
      </Form>
    </Container>
  )
};
