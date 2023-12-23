const express = require("express");
const router = express.Router();

const paymentMethodsController = require("../../controllers/paymentMethodsController.js");

// GET all payment method
router.get("/", paymentMethodsController.getPaymentMethod);

// GET payment method by member ID
router.get("/memberid/:memberId", paymentMethodsController.getPaymentMethodByMemberId);



module.exports = router;
