const express = require("express");
const router = express.Router();

const plansController = require("../../controllers/plansController.js");

// GET all plans
router.get("/", plansController.getAllPlans);

// GET a plan by ID
router.get("/:planId", plansController.getPlanById);

// POST a new plan
router.post("/", plansController.createPlan);

// PUT (update) a plan by ID
router.put("/:planId", plansController.updatePlan);

// DELETE a plan by ID
router.delete("/:planId", plansController.deletePlan);

module.exports = router;
