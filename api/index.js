require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");

const schema = new mongoose.Schema({
  title: String,
  body: String,
  btc: String,
  code: String,
});

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected to MongoDB"));

const db = mongoose.model("pastedeck", schema);

const randomStr = (length) => {
  const strings = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += strings[Math.floor(Math.random() * strings.length)];
  }
  return str;
};

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

app.get("/api/v1/paste/:code", (req, res) => {
  if (req.params.code) {
    db.findOne({ code: req.params.code }, (err, doc) => {
      if (err) {
        res.status(500).send(err);
      } else if (doc) {
        res.json(doc);
      } else {
        res.status(404).send("Not found");
      }
    });
  } else {
    res.status(400).send("No code specified");
  }
});
app.post("/api/v1/paste", (req, res) => {
  if (!req.body.content) {
    res.status(400).send("No content specified");
    return;
  }
  if (req.body.content.length > 40000) {
    res.status(400).send("Content exceeds 40KB");
    return;
  }
  if (req.body.title && req.body.title.length > 100) {
    res.status(400).send("Title exceeds 100 characters");
    return;
  }
  if (req.body.btc && req.body.btc.length > 60) {
    res.status(400).send("BTC address exceeds 60 characters");
    return;
  }
  const cont = JSON.parse(req.body.content);
  const naiy = {
    iv: cont.iv,
    salt: cont.salt,
    ct: cont.ct,
  };
  const code = randomStr(8);
  const m = new db({ title: req.body.title, body: JSON.stringify(naiy), btc: req.body.btc, code });
  m.save().then(() => {
    res.json({ code });
  });
});

app.get("/paste/:code", (req, res) => {
  const code = req.params.code;
  if (!code) {
    res.status(400).send("No code specified");
    return;
  }
  db.findOne({ code }, (err, doc) => {
    if (err) {
      res.status(500).send(err);
    } else if (doc) {
      res.sendFile(path.join(__dirname, "..", "/public/index.html"));
    } else {
      res.status(404).send("Paste not found");
    }
  });
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

