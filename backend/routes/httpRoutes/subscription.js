const express = require("express");
const router = express.Router();
const stripeController = require("../../controllers/stripeController.js");
const subscriptionController = require("../../controllers/subscriptionController.js");

// GET all subscriptions
router.get("/", subscriptionController.getSubscription);

// GET subscription by member ID
router.get("/memberid/:memberId", subscriptionController.getSubscriptionByMemberId);

router.post('/session', stripeController.session);

router.get('/process', stripeController.process);


module.exports = router;

