const express = require("express");
const router = express.Router();
const freqModule = require("../../models/frequencies.js");

// GET all freqs
router.get("/", (req, res) => freqModule.getAllFrequencies(req, res));

// GET a freq by ID
router.get("/:freqId", (req, res) => freqModule.getFrequencyById(req, res));

module.exports = router;