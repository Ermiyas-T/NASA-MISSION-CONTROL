const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

const planetRouter = require("./router/planets/planets.router.js");
const launchRouter = require("./router/launches/launches.router.js");
const pathname = require("path");
// Load environment variables from .env file
// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    console.error("-----Error connecting to MongoDB:", error);
  });

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// app.use(express.static(pathname.join(__dirname, "..", "public")));
app.use("/planets", planetRouter);
app.use("/launches", launchRouter);
// app.get("/", (req, res) => {
//   res.sendFile(this.path.join(__dirname, "..", "public", "index.html"));
// });

module.exports = app;
