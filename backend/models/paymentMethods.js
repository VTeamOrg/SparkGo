const database = require("../db/database.js");

const paymentMethods = {
    getPaymentMethod: async function getPaymentMethod(req, res) {
        try {
            const db = await database.openDb();
            const paymentMethods = await database.query(
                db,
                "SELECT * FROM payment_method"
            );

            await database.closeDb(db);

            return res.json({
                data: paymentMethods,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPaymentMethodByMemberId: async function getPaymenmethodByMemberId(req, res) {
        try {
            const db = await database.openDb();
            const memberId = req.params.memberId;
            const member = await database.query(
                db,
                "SELECT * FROM payment_method WHERE member_id = ?",
                memberId
            );

            await database.closeDb(db);

            return res.json({
                data: member[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = paymentMethods;
