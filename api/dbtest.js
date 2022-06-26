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
});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB");
  const db = mongoose.model("pastedeck", schema);
  console.log("good");
  console.log(await db.find({}));
});
