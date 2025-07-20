const express = require("express");
const cors = require("cors");
const connectDatabase = require("../config/DBConnection.js");
const app = express();
connectDatabase().then((res) => {});
const planetRouter = require("./router/planets/planets.router.js");
const launchRouter = require("./router/launches/launches.router.js");
// Load environment variables from .env file
// Connect to MongoDB

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
