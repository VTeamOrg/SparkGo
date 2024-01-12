
const express = require('express');
const router = express.Router();
const StripeController = require('../../controllers/stripeController'); 

// Handle payment confirmation from Stripe webhook
router.post('/webhook', StripeController.handlePaymentConfirmation);

// Create a payment (for frontend integration)
//router.post('/create', StripeController.createPayment);

module.exports = router;
