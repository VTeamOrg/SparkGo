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
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPaymentMethodByMemberId: async function (req, res) {
        console.log("get pyament by id");
        try {
            const memberId = req.params.memberId;
            console.log("memberId ", memberId);
            const memberPaymentMethod = await paymentMethodsModel.getPaymentMethodByMemberId(memberId);

            return res.json({
                data: memberPaymentMethod,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createPaymentMethod: async function (req, res) {
        try {
          const { member_id, method_name, reference_info, is_selected } = req.body;
          console.log("Received data:", req.body);
          const newPaymentMethod = await paymentMethodsModel.createPaymentMethod(member_id, method_name, reference_info, is_selected);
    
          return res.status(201).json({
            message: "Payment method created successfully",
            data: newPaymentMethod,
          });
        } catch (error) {
          console.error("Error creating payment method:", error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      },

    updatePaymentMethod: async function (req, res) {
        console.log(res.body);
        try {
            const paymentMethodId = req.params.paymentMethodId;
            const { member_id, method_name, reference_info, is_selected } = req.body;
            const updatedPaymentMethod = await paymentMethodsModel.updatePaymentMethod(paymentMethodId, member_id, method_name, reference_info, is_selected);

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
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deletePaymentMethod: async function (req, res) {
        try {
            const paymentMethodId = req.params.paymentMethodId;
            await paymentMethodsModel.deletePaymentMethod(paymentMethodId);

            return res.json({
                message: "Payment method deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting payment method:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = paymentMethodsController;
