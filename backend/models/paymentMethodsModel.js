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

    createPaymentMethod: async function (req, res) {
        try {
          const db = await database.openDb();
          const { member_id, method_name, reference_info, is_selected } = req.body;
    
          const newPaymentMethod = await database.query(
            db,
            "INSERT INTO payment_method (member_id, method_name, reference_info, is_selected) VALUES (?, ?, ?, ?)",
            [member_id, method_name, reference_info, is_selected]
          );
    
          await database.closeDb(db);
    
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
        try {
          const db = await database.openDb();
          const paymentMethodId = req.params.paymentMethodId;
          const { member_id, method_name, reference_info, is_selected } = req.body;
      
          const updatedPaymentMethod = await database.query(
            db,
            "UPDATE payment_method SET member_id = ?, method_name = ?, reference_info = ?, is_selected = ? WHERE id = ?",
            [member_id, method_name, reference_info, is_selected, paymentMethodId]
          );
      
          await database.closeDb(db);
      
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
          const db = await database.openDb();
          const paymentMethodId = req.params.paymentMethodId;
    
          await database.query(db, "DELETE FROM payment_method WHERE id = ?", paymentMethodId);
    
          await database.closeDb(db);
    
          return res.json({
            message: "Payment method deleted successfully",
          });
        } catch (error) {
          console.error("Error deleting payment method:", error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      },
};

module.exports = paymentMethodsModel;
