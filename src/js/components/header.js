import React from "react";
import * as ReactBootstrap from "react-bootstrap";
//import Icon from "../../../public/assets/logo.png";

const Navbar = ReactBootstrap.Navbar;
export default class Header extends React.Component {
  render() {
    return (
      <header>
        <Navbar>
          <img src="assets/logo.png" />
        </Navbar>
      </header>
    )
  }
};