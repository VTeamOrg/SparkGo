const express = require("express");
const router = express.Router();
const paymentModule = require("../../models/paymentMethods.js");

// GET all payment method
router.get("/", (req, res) => paymentModule.getPaymentMethod(req, res));

// GET payment method by member ID
router.get("/memberid/:memberId", (req, res) => paymentModule.getPaymentMethodByMemberId(req, res));



module.exports = router;
