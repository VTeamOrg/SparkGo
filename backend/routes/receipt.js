const express = require("express");
const router = express.Router();

let receiptModule;

receiptModule = require("../models/receipt.js");

// Get all receipt
router.get("/", receiptModule.getAllReceipt);

// Get all receipt by member id
router.get("/memberid", receiptModule.getReceiptByMemberId);

// Get one receipt by receipt id
router.get("/:id", receiptModule.getReceiptById);

// Generete receipt
router.post("/", receiptModule.generateReceipt);

module.exports = router;