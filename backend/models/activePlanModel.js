const database = require("../db/database.js");

const activePlanModel = {
    getAllActivePlans: async function (req, res) {
        try {
            const db = await database.openDb();
            const allActivePlans = await database.query(
                db,
                "SELECT * FROM active_plan"
            );

            await database.closeDb(db);

            return res.json({
                data: allActivePlans,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getActivePlanById: async function (req, res) {
        try {
            const db = await database.openDb();
            const activePlanId = req.params.activePlanId;
            const activePlan = await database.query(
                db,
                "SELECT * FROM active_plan WHERE plan_id = ?",
                activePlanId
            );

            await database.closeDb(db);

            return res.json({
                data: activePlan[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateActivePlan: async function (req, res) {
        try {
          const db = await database.openDb();
          const activePlanId = req.params.activePlanId;
          const { plan_id, member_id, creation_date, activation_date, available_minutes, available_unlocks, is_paused } = req.body; // Fields to update
      
            // Convert date strings to 'YYYY-MM-DD hh:mm:ss' format
            const creationDate = new Date(creation_date);
            const formattedCreationDate = creationDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

            const activationDate = new Date(activation_date);
            const formattedActivationDate = activationDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

          const updatedActivePlan = await database.query(
            db,
            `
            UPDATE active_plan 
            SET 
              plan_id = ?,
              member_id = ?,
              creation_date = ?,
              activation_date = ?,
              available_minutes = ?,
              available_unlocks = ?,
              is_paused = ? 
            WHERE 
              plan_id = ? AND member_id = ?;
            `,
            [plan_id, member_id, formattedCreationDate, formattedActivationDate, available_minutes, available_unlocks, is_paused, activePlanId, member_id]
          );
          
      
          await database.closeDb(db);
      
          return res.json({
            message: "Active Plan updated successfully",
            data: updatedActivePlan,
          });
        } catch (error) {
          console.error("Error updating Active Plan:", error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      },
      

    deleteActivePlan: async function (req, res) {
        try {
            const db = await database.openDb();
            const activePlanId = req.params.activePlanId;

            await database.query(db, "DELETE FROM active_plan WHERE plan_id = ?", activePlanId);

            await database.closeDb(db);

            return res.json({
                message: "Active Plan deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting Active Plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = activePlanModel;

