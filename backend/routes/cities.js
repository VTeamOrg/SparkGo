const express = require("express");
const router = express.Router();

let cityModule;

cityModule = require("../models/cities.js");

router.get("/", (req, res) => cityModule.getAllCities(req, res));

router.get("/:cityId", (req, res) => cityModule.getCityById(req, res));

module.exports = router;
