const database = require("../db/database.js");

const paymentMethodsModel = {
    getPaymentMethod: async function () {
        try {
            const db = await database.openDb();
            const allPaymentMethod = await database.query(
                db,
                "SELECT * FROM payment_method"
            );
            await database.closeDb(db);
            return allPaymentMethod;
        } catch (error) {
            throw error;
        }
    },

    getPaymentMethodByMemberId: async function (memberId) {
        try {
            const db = await database.openDb();
            const memberPaymentMethod = await database.query(
                db,
                "SELECT * FROM payment_method WHERE member_id = ?",
                memberId
            );
            await database.closeDb(db);
            return memberPaymentMethod[0];
        } catch (error) {
            throw error;
        }
    },
};

module.exports = paymentMethodsModel;
