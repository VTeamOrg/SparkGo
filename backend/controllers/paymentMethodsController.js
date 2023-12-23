const paymentMethodsModel = require("../models/paymentMethodsModel");

const paymentMethodsController = {
    getPaymentMethod: async function (req, res) {
        try {
            const allPaymentMethod = await paymentMethodsModel.getPaymentMethod();
            return res.json({
                data: allPaymentMethod,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPaymentMethodByMemberId: async function (req, res) {
        try {
            const memberId = req.params.memberId;
            const memberPaymentMethod = await paymentMethodsModel.getPaymentMethodByMemberId(memberId);

            return res.json({
                data: memberPaymentMethod,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = paymentMethodsController;
