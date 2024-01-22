const database = require("../db/database.js");

const receiptModel = {
    getAllReceipts: async function () {
        try {
            const db = await database.openDb();
            const allReceipt = await database.query(
                db,
                "SELECT * FROM v_receipt"
            );
            await database.closeDb(db);
            return allReceipt;
        } catch (error) {
            throw error;
        }
    },

    getReceiptByMemberId: async function (memberId) {
        try {
            const db = await database.openDb();
            const userReceipt = await database.query(
                db,
                "SELECT * FROM v_receipt WHERE member_id = ?",
                memberId
            );
            await database.closeDb(db);
            return userReceipt[0];
        } catch (error) {
            throw error;
        }
    },

    getReceiptById: async function (receiptId) {
        try {
            const db = await database.openDb();
            const receipt = await database.query(
                db,
                "SELECT * FROM v_receipt WHERE id = ?",
                receiptId
            );
            await database.closeDb(db);
            return receipt[0];
        } catch (error) {
            throw error;
        }
    },

    generateReceipt: async function (rentId) {
        try {
            const db = await database.openDb();
            const receiptResult = await database.query(
                db,
                "CALL generate_receipt(?)",
                [rentId]
            );
            await database.closeDb(db);
            return receiptResult;
        } catch (error) {
            throw error;
        }
    },
   
    insertReceipt: async function (receiptData) {
        try {
            // console.log("Parameters:", userId, payment_details, payment_type, receipt_details, sum, payment_date);
            const db = await database.openDb();
            const receiptResult = await database.query(
                db,
                "CALL insert_receipt(?, ?, ?, ?, ?, ?)",
                // "INSERT INTO receipt (member_id, payment_details, payment_type, receipt_details, sum, payment_date) VALUES (?, ?, ?, ?, ?, ?)",
                [receiptData.userId, receiptData.payment_details, receiptData.payment_type, receiptData.receipt_details, receiptData.sum, receiptData.payment_date]
            );
            await database.closeDb(db);
            return receiptResult;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = receiptModel;
