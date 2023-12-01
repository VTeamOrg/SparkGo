const database = require("../db/database.js");

const receipt = {
    getAllReceipt: async function getAllReceipt(req, res) {
        try {
            const db = await database.openDb();
            const allReceipt = await database.query(
                db,
                "SELECT * FROM receipt"
            );

            await database.closeDb(db);

            return res.json({
                data: allReceipt,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getReceiptByMemberId: async function getReceiptByMemberId(req, res) {
        try {
            const db = await database.openDb();
            const userId = req.params.member_id;
            const user = await database.query(
                db,
                "SELECT * FROM receipt WHERE member_id = ?",
                userId
            );

            await database.closeDb(db);

            return res.json({
                data: user[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getReceiptById: async function getReceiptById(req, res) {
        try {
            const db = await database.openDb();
            const userId = req.params.id;
            const user = await database.query(
                db,
                "SELECT * FROM receipt WHERE id = ?",
                userId
            );

            await database.closeDb(db);

            return res.json({
                data: user[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    generateReceipt: async function generateReceipt(req, res) {
        try {
            const db = await database.openDb();
            // Assuming there is data stored in the database tables rent, payment_method and price_list. 
            const { rent_id } = req.body; 

            const receipt_res = await database.query(
                db,
                "CALL generate_receipt(?)"
                [rent_id]
            );

            await database.closeDb(db);

            return res.status(201).json({
                message: "Receipt generated successfully",
                data: receipt_res,
            });
        } catch (error) {
            console.error("Error generating receipt:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = receipt;
