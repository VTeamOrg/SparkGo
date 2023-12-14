const database = require("../db/database.js");

const receipt = {
    getPaymentMethod: async function getPaymentMethod(req, res) {
        console.log("get Payment Method");
        try {
            console.log("try");
            const db = await database.openDb();
            const paymentMethods = await database.query(
                db,
                "SELECT * FROM payment_method"
            );
            console.log("Data from database query:", paymentMethods);

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
            const userId = req.params.member_id;
            const user = await database.query(
                db,
                "SELECT * FROM payment_method WHERE member_id = ?",
                userId
            );
            console.log("Data from database query:", paymentMethods);

            await database.closeDb(db);

            return res.json({
                data: user[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = receipt;
