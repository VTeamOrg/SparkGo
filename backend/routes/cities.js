const express = require("express");
const router = express.Router();
const cityModule = require("../models/cities.js");

router.get("/", (req, res) => cityModule.getAllCities(req, res));

router.get("/:cityId", (req, res) => cityModule.getCityById(req, res));

router.post("/", (req, res) => cityModule.createCity(req, res));

router.put("/:cityId", (req, res) => cityModule.updateCity(req, res));

router.delete("/:cityId", (req, res) => cityModule.deleteCity(req, res));

module.exports = router;
