const express = require("express");
const router = express.Router();

const receiptController = require("../../controllers/receiptController.js");

// GET all receipts
router.get("/", receiptController.getAllReceipts);

// GET receipt by ID
router.get("/:id", receiptController.getReceiptById);

// GET receipts by member ID
router.get("/memberid/:member_id", receiptController.getReceiptByMemberId);

// POST generate receipt
router.post("/", receiptController.generateReceipt);


module.exports = router;
