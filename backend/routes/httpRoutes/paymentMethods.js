const express = require("express");
const router = express.Router();

const paymentMethodsController = require("../../controllers/paymentMethodsController.js");

// GET all payment method
router.get("/", paymentMethodsController.getPaymentMethod);

// GET payment method by member ID
router.get("/memberid/:memberId", paymentMethodsController.getPaymentMethodByMemberId);

// POST a new payment method
router.post("/", (req, res) => paymentModule.createPaymentMethod(req, res));

// PUT (update) a payment method by ID
router.put("/:paymentMethodId", (req, res) =>
  paymentModule.updatePaymentMethod(req, res)
);

// DELETE a payment method by ID
router.delete("/:paymentMethodId", (req, res) =>
  paymentModule.deletePaymentMethod(req, res)
);

module.exports = router;
