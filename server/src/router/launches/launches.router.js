const {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch,
} = require("./launches.controller");
const express = require("express");
const launchRouter = express.Router();
launchRouter.get("/", httpGetAllLaunches);
launchRouter.post("/", httpPostLaunch);
launchRouter.delete("/:id", httpAbortLaunch);
module.exports = launchRouter;
