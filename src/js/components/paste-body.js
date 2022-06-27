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
  }, []);
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
          <Button variant="secondary" id="save-paste" onClick={download}>Download</Button>
          <Button variant="secondary" id="delete-paste" style={showDelete ? {} : { display: "none" }} onClick={deletePaste}>Delete paste</Button>
        </ButtonGroup>
      </ButtonToolbar>
      <FormGroupTextArea rows={10} readonly={true} id="body" value="Loading..." />
    </Container>
  )
}

function load(setShowDelete) {
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

function download() {
  const body = document.getElementById("body").value;
  const blob = new Blob([body], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  const filename = (document.getElementById("paste-title").innerText === "Untitled" ? new URL(location.href).pathname.split("/")[2] : document.getElementById("paste-title").innerText) + ".txt";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
  Swal.fire({
    title: <p>Downloaded!</p>,
    text: "Paste downloaded",
    icon: "success",
    confirmButtonText: <>OK</>
  });
}

function deletePaste() {
  const url = new URL(location.href);
  const code = url.pathname.split("/")[2];
  const cur = localStorage.getItem(code);
  Swal.fire({
    title: <p>Are you sure?</p>,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: <>Yes, delete it!</>,
    showLoaderOnConfirm: true,
    preConfirm: () => {
      return axios.delete(`/api/v1/paste/${code}?owner_key=${cur}`)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          Swal.showValidationMessage(
            `Delete failed: ${err.response.data}`
          );
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: <p>Deleted!</p>,
          text: "Paste deleted",
          icon: "success",
          confirmButtonText: <>OK</>
        });
        window.location.href = "/";
      }
    });
}