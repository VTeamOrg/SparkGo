const express = require("express");
const vehiclesController = require("../../controllers/vehiclesController.js");
const router = express.Router();
const adminOnlyAccess = require('../../middleware/adminOnlyAccess.js');

router.get("/", vehiclesController.getAllVehicles);
router.get("/active", vehiclesController.getActiveVehicles);

router.get("/byStation/:stationId", vehiclesController.getVehicleByStationId);

router.get("/:vehicleId", vehiclesController.getVehicleById);

router.post("/", vehiclesController.createVehicle);
router.put("/:vehicleId", vehiclesController.updateVehicle);
router.post("/", (req, res) => vehicleModule.createVehicle(req, res));
router.put("/:vehicleId", adminOnlyAccess, (req, res) => vehicleModule.updateVehicleById(req, res));
router.delete("/:vehicleId", adminOnlyAccess, (req, res) => vehicleModule.deleteVehicleById(req, res));

module.exports = router;
