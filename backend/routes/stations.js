const express = require("express");
const router = express.Router();

let stationsModule;

stationsModule = require("../models/stations.js");

router.get("/", (req, res) => stationsModule.getAllStations(req, res));

router.get("/:cityId", (req, res) => stationsModule.getStationsById(req, res));

module.exports = router;
