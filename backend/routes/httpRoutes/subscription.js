const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const subscriptionModule = require("../../models/subscription.js");
const stripeController = require("../../controllers/stripeController.js");
const stripe = require('stripe')(process.env.STIPE_SECRET_KEY)
=======

const subscriptionController = require("../../controllers/subscriptionController.js");
>>>>>>> 6e79ebfb1aa658866c4508fe94b00d6440739e33

// GET all subscriptions
router.get("/", subscriptionController.getSubscription);

// GET subscription by member ID
router.get("/memberid/:memberId", subscriptionController.getSubscriptionByMemberId);

// PUT route to update a subscription by ID
// router.put("/memberid/:memberId", subscriptionController.updateSubscriptionByMemberId);

router.post('/session', stripeController.session);

router.get('/process', stripeController.process);


module.exports = router;
