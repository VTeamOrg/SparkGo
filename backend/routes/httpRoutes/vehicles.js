const express = require("express");
const vehiclesController = require("../../controllers/vehiclesController");
const router = express.Router();

router.get("/", vehiclesController.getAllVehicles);

router.get("/:vehicleId", vehiclesController.getVehicleById);

router.post("/", vehiclesController.createVehicle);

router.put("/:vehicleId", vehiclesController.updateVehicle);

module.exports = router;
