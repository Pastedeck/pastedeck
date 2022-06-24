import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Container } = ReactBootstrap;

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <p className="text-muted">Pastedeck ©2022</p>
        </Container>
      </footer>
    )
  }
};