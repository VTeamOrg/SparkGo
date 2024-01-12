const express = require("express");
const router = express.Router();
const cityController = require("../../controllers/citiesController.js");

/* GET routes */
router.get("/", cityController.getAllCities);
router.get("/:cityId", cityController.getCityById);

router.post("/", cityController.createCity);

router.put("/:cityId", cityController.updateCity);

router.delete("/:cityId", cityController.deleteCity);

module.exports = router;
