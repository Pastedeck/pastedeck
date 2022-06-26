import React, { useEffect, useState } from "react";
import * as ReactBootstrap from "react-bootstrap";
import { FormGroupTextArea } from "./form-group";
import Error from "./error";
import sjcl from "sjcl";
import dSwal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Swal = withReactContent(dSwal);

import axios from "axios";
const { Container, Alert, Button, ButtonGroup, ButtonToolbar } = ReactBootstrap;
import Slider from "./slider";

export default function PasteBody() {
  const [showDelete, setShowDelete] = useState(false);
  useEffect(() => {
    load(setShowDelete);
  });
  return (
    <Container>
      <Slider />
      <Error id="pastealert" />
      <h2 id="paste-title"></h2>
      <ButtonToolbar className="justify-content-between">
        <ButtonGroup className="mb-2">
          <Button variant="secondary" id="copy-content" onClick={copyContent}>Copy content to clipboard</Button>
          <Button variant="secondary" id="copy-url" onClick={copyUrl}>Copy URL to clipboard</Button>
        </ButtonGroup>
        <ButtonGroup className="mb-2">
          <Button variant="secondary" id="save-paste">Download</Button>
          <Button variant="secondary" id="delete-paste" style={showDelete ? {} : { display: "none" }}>Delete paste</Button>
        </ButtonGroup>
      </ButtonToolbar>
      <FormGroupTextArea rows={10} readonly={true} id="body" value="Loading..." />
    </Container>
  )
}

function load(setShowDelete) {
  console.log("hello");
  const url = new URL(location.href);
  const key = url.searchParams.get("key")?.replaceAll(" ", "+")
  document.querySelector(".slider").style.display = "none";
  document.querySelector(".sliderspacer").style.display = "block";
  const code = new URL(location.href).pathname.split("/")[2];
  const cur = localStorage.getItem(code);
  axios.get(`/api/v1/paste/${code}?owner_key=${cur}`)
    .then(res => {
      document.getElementById("paste-title").innerText = res.data.title || "Untitled";
      if (res.data.isOwner) {
        setShowDelete(true);
      }
      if (!key) {
        window.showError(true);
        window.setErrorText("No key specified");
        document.getElementById("body").value = res.data.body;
        return;
      }
      try {
        console.log(res.data);
        const decrypted = sjcl.decrypt(key, res.data.body);
        document.getElementById("body").value = sjcl.codec.utf8String.fromBits(sjcl.codec.base64.toBits(decrypted));
      } catch (e) {
        console.error(e);
        window.showError(true);
        window.setErrorText("Invalid key");
      }
    })
    .catch((err) => {
      if (err.response.status === 404) {
        window.showError(true);
        window.setErrorText("Cannot find paste");
        document.getElementById("body").value = "";
      } else {
        window.showError(true);
        window.setErrorText(err.response.data);
        document.getElementById("body").value = "";
      }
    });
}

function copyContent() {
  const text = document.getElementById("body").value;
  navigator.clipboard.writeText(text)
    .then(() => {
      Swal.fire({
        title: <p>Copied!</p>,
        text: "Content copied to clipboard",
        icon: "success",
        confirmButtonText: <>OK</>
      });
    })
    .catch(err => {
      Swal.fire({
        title: <p>Error!</p>,
        text: "Failed to copy content",
        icon: "error",
        confirmButtonText: <>OK</>
      });
    });
}

function copyUrl() {
  const url = location.href;
  navigator.clipboard.writeText(url)
    .then(() => {
      Swal.fire({
        title: <p>Copied!</p>,
        text: "URL copied to clipboard",
        icon: "success",
        confirmButtonText: <>OK</>
      });
    })
    .catch(err => {
      Swal.fire({
        title: <p>Error!</p>,
        text: "Failed to copy URL",
        icon: "error",
        confirmButtonText: <>OK</>
      });
    });
}