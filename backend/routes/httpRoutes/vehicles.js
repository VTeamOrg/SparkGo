const express = require("express");
const router = express.Router();

let vehicleModule;

vehicleModule = require("../../models/vehicles.js");

router.get("/", (req, res) => vehicleModule.getAllVehicles(req, res));

router.get("/:vehicleId", (req, res) => vehicleModule.getVehicleById(req, res));

router.post("/", (req, res) => vehicleModule.createVehicle(req, res));

router.put("/:vehicleId", (req, res) => vehicleModule.updateVehicleById(req, res));

router.delete("/:vehicleId", (req, res) => vehicleModule.deleteVehicleById(req, res));

module.exports = router;
