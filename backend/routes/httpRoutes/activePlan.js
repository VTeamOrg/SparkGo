const express = require("express");
const router = express.Router();
const activePlanModule = require("../../models/activePlan.js");

/* GET routes */
router.get("/", (req, res) => activePlanModule.getAllActivePlans(req, res));
router.get("/:activePlanId", (req, res) => activePlanModule.getActivePlanById(req, res));

router.post("/", (req, res) => activePlanModule.createActivePlan(req, res));

router.put("/:activePlanId", (req, res) => activePlanModule.updateActivePlan(req, res));

router.delete("/:activePlanId", (req, res) => activePlanModule.deleteActivePlan(req, res));

module.exports = router;
