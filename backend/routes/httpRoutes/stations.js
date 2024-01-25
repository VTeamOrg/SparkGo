const express = require("express");
const router = express.Router();

const stationsController = require("../../controllers/stationsController.js");
const adminOnlyAccess  = require('../../middleware/adminOnlyAccess.js');

router.get("/", stationsController.getAllStations);
router.get("/:stationId", stationsController.getStationById);

router.post("/", adminOnlyAccess, stationsController.createStation);
router.put("/:stationId", adminOnlyAccess, stationsController.updateStation);
router.delete("/:stationId", adminOnlyAccess, stationsController.deleteStation);

module.exports = router;
