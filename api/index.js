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
  ownerKey: String,
  expires: Number,
  created: Date,
  accessCount: Number,
});

/**
 * @enum {number}
 */
const Expires = {
  BURN_AFTER_READING: 1,
  ONE_DAY: 2,
  ONE_MONTH: 3,
  NEVER: 0
}

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

app.get("/client.min.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/client.min.js"));
})

app.get("/api/v1/paste/:code", async (req, res) => {
  if (req.params.code) {
    const doc = await db.findOne({ code: req.params.code });
    if (!doc) return res.status(404).send("Not found");
    if (doc.expires === Expires.ONE_DAY) {
      const now = new Date();
      const diff = now.getTime() - doc.created.getTime();
      if (diff > 864_000_00) {
        await db.deleteOne({ code: req.params.code });
        return res.status(404).send("Not found");
      }
    } else if (doc.expires === Expires.ONE_MONTH) {
      const now = new Date();
      const diff = now.getTime() - doc.created.getTime();
      if (diff > 2592_000_00) {
        await db.deleteOne({ code: req.params.code });
        return res.status(404).send("Not found");
      }
    } else if (doc.expires === Expires.BURN_AFTER_READING) {
      if (doc.accessCount === 0 || doc.accessCount === 1) {
        doc.accessCount += 1;
        await doc.save();
      } else {
        await db.deleteOne({ code: req.params.code });
        return res.status(404).send("Not found");
      }
    }
    const trueDoc = doc.toObject();
    if (req.query.owner_key === trueDoc.ownerKey) {
      delete trueDoc.ownerKey;
      res.send({ ...trueDoc, isOwner: true });  
    } else {
      delete trueDoc.ownerKey;
      res.send({ ...trueDoc, isOwner: false });
    }
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
  if (req.body.expires && !Object.values(Expires).includes(Number(req.body.expires))) {
    res.status(400).send("Invalid expires value");
  }
  const cont = JSON.parse(req.body.content);
  const naiy = {
    iv: cont.iv,
    salt: cont.salt,
    ct: cont.ct,
  };
  const code = randomStr(8);
  const ownerKey = crypto.randomBytes(32).toString("hex");
  const m = new db({ title: req.body.title, body: JSON.stringify(naiy), btc: req.body.btc, code, ownerKey, created: new Date(), expires: req.body.expires || Expires.ONE_MONTH, accessCount: 0 });
  m.save().then(() => {
    res.json({ code, ownerKey });
  });
});

app.delete("/api/v1/paste/:code", async (req, res) => {
  if (req.params.code) {
    const doc = await db.findOne({ code: req.params.code });
    if (!doc) return res.status(404).send("Not found");
    if (req.query.owner_key === doc.ownerKey) {
      await doc.remove();
      res.status(204).send();
    } else {
      res.status(403).send("Owner Key does not match");
    }
  } else {
    res.status(400).send("No code specified");
  }
});

app.get("/paste/:code", (req, res) => {
  const code = req.params.code;
  if (!code) {
    res.status(400).send("No code specified");
    return;
  }
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

