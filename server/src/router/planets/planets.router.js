const express = require("express");
const planetRouter = express.Router();
const { httpGetAllPlanets } = require("./planets.controller.js");

planetRouter.get("/", httpGetAllPlanets);
module.exports = planetRouter;
