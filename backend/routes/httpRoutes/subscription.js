const express = require("express");
const router = express.Router();

const subscriptionController = require("../../controllers/subscriptionController.js");

// GET all subscriptions
router.get("/", subscriptionController.getSubscription);

// GET subscription by member ID
router.get("/memberid/:memberId", subscriptionController.getSubscriptionByMemberId);

// PUT route to update a subscription by ID
// router.put("/memberid/:memberId", subscriptionController.updateSubscriptionByMemberId);

module.exports = router;
