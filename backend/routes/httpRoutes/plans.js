const express = require("express");
const router = express.Router();
const planModule = require("../../models/plans.js");

// GET all plans
router.get("/", (req, res) => planModule.getAllPlans(req, res));

// GET a plan by ID
router.get("/:planId", (req, res) => planModule.getPlanById(req, res));

// POST a new plan
router.post("/", (req, res) => planModule.createPlan(req, res));

// PUT (update) a plan by ID
router.put("/:planId", (req, res) => planModule.updatePlan(req, res));

// DELETE a plan by ID
router.delete("/:planId", (req, res) => planModule.deletePlan(req, res));

module.exports = router;
