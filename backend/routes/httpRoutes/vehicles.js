const express = require("express");
const router = express.Router();

let vehicleModule;

vehicleModule = require("../../models/vehicles.js");

router.get("/", (req, res) => vehicleModule.getAllVehicles(req, res));

router.get("/:vehicleId", (req, res) => vehicleModule.getVehicleById(req, res));

module.exports = router;
