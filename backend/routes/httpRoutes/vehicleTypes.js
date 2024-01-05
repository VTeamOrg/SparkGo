const express = require("express");
const router = express.Router();

const vehicleTypeController = require("../../controllers/vehicleTypeController.js");


// GET all vehicle types
router.get("/", vehicleTypeController.getAllVehicleTypes);

// GET vehicle type by ID
router.get("/:id", vehicleTypeController.getVehicleTypeById);

// POST create vehicle type
router.post("/", vehicleTypeController.createVehicleType);

// PUT update vehicle type by ID
router.put("/:id", vehicleTypeController.updateVehicleType);

// DELETE delete vehicle type by ID
router.delete("/:id", vehicleTypeController.deleteVehicleType);

module.exports = router;
