import React from "react";
import * as ReactBootstrap from "react-bootstrap";
import Required from "./required";

const { Container, Form, Button } = ReactBootstrap;
import sjcl from "sjcl";

export default class Body extends React.Component {
  render() {
    return (
      <Container>
        <div className="sliderspacer"></div>
        <div className="slider">
          <div className="line"></div>
          <div className="subline inc"></div>
          <div className="subline dec"></div>
        </div>
        <Form onSubmit={this.submit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Body text <Required /></Form.Label>
            <Form.Control as="textarea" rows="10" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Title</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">BTC Address</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
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
    document.getElementById("submittext").style.display = "block";
  }
};