const express = require("express");
const router = express.Router();

let cityModule;

cityModule = require("../models/cities.js");

/* GET routes */
router.get("/", (req, res) => cityModule.getAllCities(req, res));
router.get("/:cityId", (req, res) => cityModule.getCityById(req, res));

/* POST routes */
router.post("/", (req, res) => cityModule.createCity(req, res)); 

/* PUT routes */
router.put("/:cityId", (req, res) => cityModule.updateCityById(req, res));

/* DELETE routes */
router.delete("/:cityId", (req, res) => cityModule.deleteCityById(req, res));


module.exports = router;
