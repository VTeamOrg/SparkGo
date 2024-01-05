const express = require("express");
const router = express.Router();

const paymentMethodsController = require("../../controllers/paymentMethodsController.js");

// GET all payment methods
router.get("/", paymentMethodsController.getPaymentMethod);

// GET payment method by member ID
router.get("/memberid/:memberId", paymentMethodsController.getPaymentMethodByMemberId);

// POST a new payment method
router.post("/", paymentMethodsController.createPaymentMethod);

// PUT (update) a payment method by ID
router.put("/:paymentMethodId", paymentMethodsController.updatePaymentMethod);

// DELETE a payment method by ID
router.delete("/:paymentMethodId", paymentMethodsController.deletePaymentMethod);

module.exports = router;
