const express = require("express");
const router = express.Router();

const stations = require("../models/stations.js");

router.get("/", (req, res) => stations.getStationNames(req, res));

module.exports = router;
