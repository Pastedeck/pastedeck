import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Container } = ReactBootstrap;

export default function Footer() {
  return (
    <footer className="footer fixed-bottom">
      <Container>
        <p className="text-muted">Pastedeck ©2022</p>
      </Container>
    </footer>
  )
};