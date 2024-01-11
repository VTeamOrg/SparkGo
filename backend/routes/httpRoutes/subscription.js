const express = require("express");
const router = express.Router();
const subscriptionModule = require("../../models/subscription.js");
const stripeController = require("../../controllers/stripeController.js");
const stripe = require('stripe')(process.env.STIPE_SECRET_KEY)

// GET all subscriptions
router.get("/", (req, res) => subscriptionModule.getSubscription(req, res));

// GET subscription by member ID
router.get("/memberid/:memberId", (req, res) => subscriptionModule.getSubscriptionByMemberId(req, res));

// PUT route to update a subscription by ID
router.put("/memberid/:memberId", (req, res) => subscriptionModule.updateSubscription(req, res));

router.post('/session', stripeController.session);

router.get('/process', stripeController.process);


module.exports = router;
