const express = require("express");
const router = express.Router();
const paymentModule = require("../models/payment_method.js");

// GET all payment method
router.get("/", (req, res) => paymentModule.getPaymentMethod(req, res));

// GET payment method by member ID
router.get("/memberid/:member_id", (req, res) => paymentModule.getPaymentMethodByMemberId(req, res));


module.exports = router;
