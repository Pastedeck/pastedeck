import React from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/header";
import Footer from "./components/footer";
import Body from "./components/body";
import PasteBody from "./components/paste-body";
import * as ReactBootstrap from "react-bootstrap";

function Layout() {
  return (
    <div className="bg-dark text-light" id="wrapper">
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

function PasteLayout() {
  return (
    <div className="bg-dark text-light" id="wrapper">
      <Header />
      <PasteBody />
      <Footer />
    </div>
  );
}

if (location.pathname === "/") {
  const app = document.getElementById('app');
  const root = createRoot(app);
  root.render(<Layout />);
} else if (location.pathname.startsWith("/paste")) {
  const app = document.getElementById('app');
  const root = createRoot(app);
  root.render(<PasteLayout />);
}