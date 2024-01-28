const express = require("express");
const vehiclesController = require("../../controllers/vehiclesController.js");
const router = express.Router();
const adminOnlyAccess = require('../../middleware/adminOnlyAccess.js');

router.get("/", vehiclesController.getAllVehicles);
router.get("/active", vehiclesController.getActiveVehicles);

router.get("/byStation/:stationId", vehiclesController.getVehicleByStationId);

router.get("/rented/:id", vehiclesController.getRentedVehiclesByMemberId);

router.get("/:vehicleId", vehiclesController.getVehicleById);

router.post("/", adminOnlyAccess, vehiclesController.createVehicle);
router.put("/:vehicleId", adminOnlyAccess, vehiclesController.updateVehicle);
router.post("/", adminOnlyAccess, (req, res) => vehicleModule.createVehicle(req, res));
router.put("/:vehicleId", adminOnlyAccess, (req, res) => vehicleModule.updateVehicleById(req, res));
router.delete("/:vehicleId", adminOnlyAccess, (req, res) => vehicleModule.deleteVehicleById(req, res));


module.exports = router;
