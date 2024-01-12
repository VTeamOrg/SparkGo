const express = require("express");
const router = express.Router();
const activePlanModel = require("../../models/activePlanModel.js");

/* GET routes */
router.get("/", (req, res) => activePlanModel.getAllActivePlans(req, res));
router.get("/:activePlanId", (req, res) => activePlanModel.getActivePlanById(req, res));

router.post("/", (req, res) => activePlanModel.createActivePlan(req, res));

router.put("/:activePlanId", (req, res) => activePlanModel.updateActivePlan(req, res));

router.delete("/:activePlanId", (req, res) => activePlanModel.deleteActivePlan(req, res));

module.exports = router;
