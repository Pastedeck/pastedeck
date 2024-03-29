import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Navbar, Container, NavbarBrand } = ReactBootstrap;
export default function Header() {
  return (
    <header>
      <Navbar>
        <Container className="text-light">
          <NavbarBrand className="text-light">
            <a href="/" style={{ display: "inline-flex", color: "white", textDecoration: "none" }} id="brandbar">
              <img src="/assets/logo.png" width="70" />
              <h1>Pastedeck</h1>
            </a>
          </NavbarBrand>
        </Container>
      </Navbar>
    </header>
  )
};