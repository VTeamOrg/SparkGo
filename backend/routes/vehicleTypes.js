const express = require("express");
const router = express.Router();
const vehicleTypeModule = require("../models/vehicleTypes.js");

// GET all vehicle types
router.get("/", (req, res) => vehicleTypeModule.getAllVehicleTypes(req, res));

// GET vehicle type by ID
router.get("/:id", (req, res) => vehicleTypeModule.getVehicleTypeById(req, res));

// POST create vehicle type
router.post("/", (req, res) => vehicleTypeModule.createVehicleType(req, res));

// PUT update vehicle type by ID
router.put("/:id", (req, res) => vehicleTypeModule.updateVehicleType(req, res));

// DELETE delete vehicle type by ID
router.delete("/:id", (req, res) => vehicleTypeModule.deleteVehicleType(req, res));

module.exports = router;
