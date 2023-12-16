const express = require("express");
const router = express.Router();
const subscriptionModule = require("../../models/subscription.js");

// GET all subscriptions
router.get("/", (req, res) => subscriptionModule.getSubscription(req, res));

// GET subscription by member ID
router.get("/memberid/:memberId", (req, res) => subscriptionModule.getSubscriptionByMemberId(req, res));

// PUT route to update a subscription by ID
router.put("/memberid/:memberId", (req, res) => subscriptionModule.updateSubscription(req, res));

module.exports = router;
