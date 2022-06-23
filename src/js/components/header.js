import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const { Navbar, Container, NavbarBrand } = ReactBootstrap;
export default class Header extends React.Component {
  render() {
    return (
      <header>
        <Navbar>
          <Container>
            <div className="navbar-header text-light">
              <NavbarBrand className="text-light">
                <img src="assets/logo.png" width="70" />
                <h1>Pastedeck</h1>
              </NavbarBrand>
            </div>
          </Container>
        </Navbar>
      </header>
    )
  }
};