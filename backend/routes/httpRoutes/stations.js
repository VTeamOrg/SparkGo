const express = require("express");
const router = express.Router();

let stationsModule;

stationsModule = require("../../models/stations.js");

router.get("/", (req, res) => stationsModule.getAllStations(req, res));
router.get("/:stationId", (req, res) =>
    stationsModule.getStationById(req, res)
);

router.post("/", (req, res) => stationsModule.createStation(req, res));

router.put("/:stationId", (req, res) => stationsModule.updateStation(req, res));

router.delete("/:stationId", (req, res) =>
    stationsModule.deleteStation(req, res)
);

module.exports = router;
