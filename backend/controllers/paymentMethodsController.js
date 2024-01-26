const paymentMethodsModel = require("../models/paymentMethodsModel.js");

const paymentMethodsController = {
    getPaymentMethod: async function (req, res) {
        try {
            const allPaymentMethod = await paymentMethodsModel.getPaymentMethod();
            return res.json({
                data: allPaymentMethod,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: `Failed to get payment methods: ${error.message}` });
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
            return res.status(500).json({ error: `Failed to get payment methods by member ID: ${error.message}` });
        }
    },

    createPaymentMethod: async function (req, res) {
        try {
            const { member_id, method_name, reference_info, is_selected } = req.body;
            const newPaymentMethod = await paymentMethodsModel.createPaymentMethod(member_id, method_name, reference_info, is_selected);

            return res.status(201).json({
                message: "Payment method created successfully",
                data: newPaymentMethod,
            });
        } catch (error) {
            console.error("Error creating payment method:", error.message);
            return res.status(500).json({ error: `Failed to create payment method: ${error.message}` });
        }
    },

    updatePaymentMethod: async function (req, res) {
        try {
            const paymentMethodId = req.params.paymentMethodId;
            const { member_id, method_name, reference_info, is_selected } = req.body;

            console.log("Payment Method ID:", paymentMethodId);

            const updatedPaymentMethod = await paymentMethodsModel.updatePaymentMethod(paymentMethodId, member_id, method_name, reference_info, is_selected);

            console.log("Updated Payment Method:", updatedPaymentMethod);

            if (updatedPaymentMethod && updatedPaymentMethod.affectedRows > 0) {
                return res.json({
                    message: "Payment method updated successfully",
                    data: updatedPaymentMethod,
                });
            } else {
                console.log("No rows were updated.");
                return res.status(404).json({ error: "Payment method not found" });
            }
        } catch (error) {
            console.error("Error updating payment method:", error.message);
            return res.status(500).json({ error: `Failed to update payment method: ${error.message}` });
        }
    },

    deletePaymentMethod: async function (req, res) {
        try {
            await paymentMethodsModel.deletePaymentMethod(req, res); 
    
        } catch (error) {
            console.error("Error deleting payment method:", error.message);
            return res.status(500).json({ error: `Failed to delete payment method: ${error.message}` });
        }
    }
};

module.exports = paymentMethodsController;