const express = require("express");
const router = express.Router();
const stripeController = require("../../controllers/stripeController.js");

router.post('/createCheckoutSession', stripeController.createCheckoutSession);
//router.get('/process', stripeController.process);

module.exports = router;

