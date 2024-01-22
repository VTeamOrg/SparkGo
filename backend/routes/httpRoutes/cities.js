const express = require("express");
const router = express.Router();
const cityController = require("../../controllers/citiesController.js");
const adminOnlyAccess  = require('../../middleware/adminOnlyAccess.js');

/* GET routes */
router.get("/", cityController.getAllCities);
router.get("/:cityId", cityController.getCityById);

router.post("/", adminOnlyAccess, cityController.createCity);
router.put("/:cityId", adminOnlyAccess, cityController.updateCity);
router.delete("/:cityId", adminOnlyAccess, cityController.deleteCity);

module.exports = router;
