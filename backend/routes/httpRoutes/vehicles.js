const express = require("express");
const vehiclesController = require("../../controllers/vehiclesController.js");
const router = express.Router();

router.get("/", vehiclesController.getAllVehicles);

router.get("/:vehicleId", vehiclesController.getVehicleById);

router.post("/", vehiclesController.createVehicle);

router.put("/:vehicleId", vehiclesController.updateVehicle);

router.post("/", (req, res) => vehicleModule.createVehicle(req, res));

router.put("/:vehicleId", (req, res) => vehicleModule.updateVehicleById(req, res));

router.delete("/:vehicleId", (req, res) => vehicleModule.deleteVehicleById(req, res));

module.exports = router;
