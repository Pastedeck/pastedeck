import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const Container = ReactBootstrap.Container;

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <p className="text-muted">Pastedeck</p>
        </Container>
      </footer>
    )
  }
};