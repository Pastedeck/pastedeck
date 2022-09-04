import React, { useState } from "react";
import * as ReactBootstrap from "react-bootstrap";
import Slider from "./slider";
import { FormGroupText, FormGroupTextArea } from "./form-group";

const { Container, Form, Button, InputGroup } = ReactBootstrap;
import sjcl from "sjcl";
import axios from "axios";

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
  const [title, setTitle] = useState("");
  const [expires, setExpires] = useState(3);
  const [loading, setLoading] = useState(false);
  const [loadText, setLoadText] = useState("Submitting...");
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadText("Generating Key...");
    const content = body;
    const key = makeKey(256);
    setLoadText("Encoding base64...");
    const junbi = sjcl.codec.utf8String.toBits(content);
    const encoded = sjcl.codec.base64.fromBits(junbi);
    setLoadText("Encryting...");
    const encrypted = sjcl.encrypt(key, encoded);
    setLoadText("Sending to server...");
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (expires) params.append("expires", expires);
    params.append("content", encrypted);
    const url = `/api/v1/paste`;
    axios.post(url, params)
      .then(res => {
        setLoadText("Success!");
        localStorage.setItem(res.data.code, res.data.ownerKey);
        location.href = `/paste/${res.data.code}?key=${key}`;
      })
      .catch((err) => {
        setLoadText(`Error: ${err.response.data}`);
        setLoading(false);
      })
  }
  return (
    <Container>
      <Slider loading={loading} />
      <Form onSubmit={submit}>
        <FormGroupTextArea required={true} label="Body text" id="body" value={body} onChange={(e) => setBody(e.target.value)} />
        <FormGroupText label="Title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <hr className="my-4" />
        <InputGroup className="mb-3">
          <InputGroup.Text>Expires: </InputGroup.Text>
          <Form.Select id="expires" value={expires} onChange={(e) => setExpires(e.target.value)}>
            <option value={1}>Burn after read</option>
            <option value={2}>One day</option>
            <option value={3}>One Month</option>
            <option value={0}>Never</option>
          </Form.Select>
        </InputGroup>
        <span id="submitspan">
          <Button variant="primary" type="submit" id="submitbtn" disabled={loading}>Submit</Button>
          <p style={loading ? { display: "block" }:{ display: "none" }} className="text-muted" id="submittext">{loadText}</p>
        </span>
      </Form>
    </Container>
  )
};