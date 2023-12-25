const receiptModel = require("../models/receiptModel.js");

const receiptController = {
    getAllReceipts: async function (req, res) {
        try {
            const allReceipt = await receiptModel.getAllReceipts();
            return res.json({
                data: allReceipt,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getReceiptByMemberId: async function (req, res) {
        try {
            const memberId = req.params.member_id;
            const userReceipt = await receiptModel.getReceiptByMemberId(memberId);

            return res.json({
                data: userReceipt,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getReceiptById: async function (req, res) {
        try {
            const receiptId = req.params.id;
            const receipt = await receiptModel.getReceiptById(receiptId);

            return res.json({
                data: receipt,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    generateReceipt: async function (req, res) {
        try {
            const { rent_id } = req.body;
            const receiptResult = await receiptModel.generateReceipt(rent_id);

            return res.status(201).json({
                message: "Receipt generated successfully",
                data: receiptResult,
            });
        } catch (error) {
            console.error("Error generating receipt:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = receiptController;
