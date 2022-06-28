import React, { useState } from "react";
import * as ReactBootstrap from "react-bootstrap";
import Slider from "./slider";
import { FormGroupText, FormGroupTextArea } from "./form-group";

const { Container, Form, Button, InputGroup, ButtonGroup } = ReactBootstrap;
import sjcl from "sjcl";
import axios from "axios";

import dSwal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Swal = withReactContent(dSwal);

const submit = (e) => {
  e.preventDefault();
  document.getElementById("submitbtn").disabled = true;
  document.querySelector(".slider").style.display = "block";
  document.querySelector(".sliderspacer").style.display = "none";
  const text = document.getElementById("submittext")
  text.style.display = "block";
  text.innerText = "Generating Key...";
  const content = document.getElementById("body").value;
  const title = document.getElementById("title").value;
  const expires = document.getElementById("expires").value;
  const key = makeKey(256);
  text.innerText = "Encoding base64...";
  const junbi = sjcl.codec.utf8String.toBits(content);
  const encoded = sjcl.codec.base64.fromBits(junbi);
  text.innerText = "Encryting...";
  const encrypted = sjcl.encrypt(key, encoded);
  text.innerText = "Sending to server...";
  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (expires) params.append("expires", expires);
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

function clickUploadButton() {
  document.getElementById("upload-file").click();
}

async function fileUpload() {
  /** @type {File} */
  const file = document.getElementById("upload-file").files[0];
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      document.getElementById("body").style.display = "none";
      const img = document.getElementById("preview");
      img.src = reader.result;
      img.style.display = "block";
      Swal.fire({
        title: <>Uploaded!</>,
        text: 'Image uploaded!',
        imageUrl: reader.result,
      });
    }
  }
}

export default function Body() {
  const [body, setBody] = useState("");
  return (
    <Container>
      <Slider />
      <ButtonGroup>
        <Button variant="secondary" onClick={clickUploadButton}>Upload File</Button>
      </ButtonGroup>
      <input type={"file"} id="upload-file" style={{ display: "none" }} onChange={fileUpload} />
      <Form onSubmit={submit}>
        <div id="dataarea">
          <FormGroupTextArea required={true} label="Body" id="body" value={body} onChange={(e) => setBody(e.target.value)} />
          <img style={{ display: "none" }} id="preview" />
        </div>
        <FormGroupText label="Title" id="title" />
        <hr className="my-4" />
        <InputGroup className="mb-3">
          <InputGroup.Text>Expires: </InputGroup.Text>
          <Form.Select id="expires">
            <option value={1}>Burn after read</option>
            <option value={2}>One day</option>
            <option value={3} selected>One Month</option>
            <option value={0}>Never</option>
          </Form.Select>
        </InputGroup>
        <span id="submitspan">
          <Button variant="primary" type="submit" id="submitbtn">Submit</Button>
          <p style={{ display: "none" }} className="text-muted" id="submittext">Submitting...</p>
        </span>
      </Form>
    </Container>
  )
};