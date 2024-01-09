const express = require("express");
const router = express.Router();

const paymentMethodsController = require("../../controllers/paymentMethodsController.js");

// GET all payment methods
router.get("/", (req, res) => paymentModule.getPaymentMethod(req, res));
// GET all payment method
router.get("/", paymentMethodsController.getPaymentMethod);

// GET payment methods by member ID
router.get("/memberid/:memberId", (req, res) =>
  paymentModule.getPaymentMethodByMemberId(req, res)
);

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
