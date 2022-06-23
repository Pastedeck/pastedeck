import React from "react";
import * as ReactBootstrap from "react-bootstrap";

const Navbar = ReactBootstrap.Navbar;
export default class Header extends React.Component {
  render() {
    return (
      <header>
        <Navbar>
          ...
        </Navbar>
      </header>
    )
  }
};