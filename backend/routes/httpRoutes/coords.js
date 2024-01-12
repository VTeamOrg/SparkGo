const express = require("express");
const router = express.Router();
const coordController = require("../../controllers/coordsController.js");

/* GET routes */
router.get("/", coordController.getGeoJson);
router.get("/cities", coordController.getCities);

module.exports = router;
