const express = require("express");
const router = express.Router();

const stationsController = require("../../controllers/stationsController.js");

router.get("/", stationsController.getAllStations);
router.get("/:stationId", stationsController.getStationById);

router.post("/", stationsController.createStation);

router.put("/:stationId", stationsController.updateStation);

router.delete("/:stationId", stationsController.deleteStation);

module.exports = router;
