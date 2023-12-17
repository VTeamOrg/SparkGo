const database = require("../db/database.js");

const paymentMethods = {
    getPaymentMethod: async function getPaymentMethod() {
        try {
            const db = await database.openDb();
            const allPaymentMethod = await database.query(
                db,
                "SELECT * FROM payment_method"
            );

            await database.closeDb(db);

            return allPaymentMethod; // Return the data directly without using res.json()
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error"); // Throw the error to be caught elsewhere
        }
    },

    getPaymentMethodByMemberId: async function getPaymentMethodByMemberId(
        memberId
    ) {
        try {
            const db = await database.openDb();
            const memberPaymentMethod = await database.query(
                db,
                "SELECT * FROM payment_method WHERE member_id = ?",
                memberId
            );

            await database.closeDb(db);

            return memberPaymentMethod[0]; // Return the data directly without using res.json()
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error"); // Throw the error to be caught elsewhere
        }
    },
};

module.exports = paymentMethods;
