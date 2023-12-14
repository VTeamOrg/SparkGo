const express = require("express");
const router = express.Router();
const subscriptionModule = require("../models/active_plan.js");

// GET all subscriptions
router.get("/", (req, res) => subscriptionModule.getSubscription(req, res));

// GET subscription by member ID
router.get("/memberid/:member_id", (req, res) => subscriptionModule.getSubscriptionByMemberId(req, res));

// PUT route to update a subscription by ID
router.put("/:id", (req, res) => subscriptionModule.updateSubscription(req, res));

module.exports = router;
