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
};

module.exports = receiptModel;
