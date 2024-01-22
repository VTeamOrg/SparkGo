const express = require("express");
const router = express.Router();

const parkingZoneController = require("../../controllers/parkingController.js");
const adminOnlyAccess  = require('../../middleware/adminOnlyAccess.js');

router.get("/", parkingZoneController.getAllParkingZones);
router.get("/:parkingZoneId", parkingZoneController.getParkingZoneById);

router.post("/", adminOnlyAccess, parkingZoneController.createParkingZone);
router.put("/:parkingZoneId", adminOnlyAccess, parkingZoneController.updateParkingZone);
router.delete("/:parkingZoneId", adminOnlyAccess, parkingZoneController.deleteParkingZone);

module.exports = router;