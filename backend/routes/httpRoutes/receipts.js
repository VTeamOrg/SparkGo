const express = require("express");
const router = express.Router();
const receiptModule = require("../../models/receipts.js");

// GET all receipts
router.get("/", (req, res) => receiptModule.getAllReceipt(req, res));

// GET receipt by ID
router.get("/:id", (req, res) => receiptModule.getReceiptById(req, res));

// GET receipts by member ID
router.get("/memberid/:member_id", (req, res) => receiptModule.getReceiptByMemberId(req, res));

// POST generate receipt
router.post("/", (req, res) => receiptModule.generateReceipt(req, res));

module.exports = router;
