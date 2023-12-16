const database = require("../db/database.js");

const plans = {
    getAllPlans: async function (req, res) {
        try {
            const db = await database.openDb();
            const allPlans = await database.query(
                db,
                "SELECT * FROM v_plan ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allPlans,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPlanById: async function (req, res) {
        try {
            const db = await database.openDb();
            const planId = req.params.planId;
            const plan = await database.query(
                db,
                "SELECT * FROM plan WHERE id = ?",
                planId
            );

            await database.closeDb(db);

            return res.json({
                data: plan[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createPlan: async function (req, res) {
        try {
            const db = await database.openDb();
            const {
                title,
                description,
                price,
                price_frequency_id,
                included_unlocks,
                included_unlocks_frequency_id,
                included_minutes,
                included_minutes_frequency_id,
            } = req.body;

            const newPlan = await database.query(
                db,
                "INSERT INTO plan (title, description, price, price_frequency_id, included_unlocks, included_unlocks_frequency_id, included_minutes, included_minutes_frequency_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    title,
                    description,
                    price,
                    price_frequency_id,
                    included_unlocks,
                    included_unlocks_frequency_id,
                    included_minutes,
                    included_minutes_frequency_id,
                ]
            );

            await database.closeDb(db);

            return res.status(201).json({
                message: "Plan created successfully",
                data: newPlan,
            });
        } catch (error) {
            console.error("Error creating plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updatePlan: async function (req, res) {
        try {
            const db = await database.openDb();
            const planId = req.params.planId;
            const {
                title,
                description,
                price,
                price_frequency_id,
                included_unlocks,
                included_unlocks_frequency_id,
                included_minutes,
                included_minutes_frequency_id,
            } = req.body; // Fields to update

            const updatedPlan = await database.query(
                db,
                "UPDATE plan SET title = ?, description = ?, price = ?, price_frequency_id = ?, included_unlocks = ?, included_unlocks_frequency_id = ?, included_minutes = ?, included_minutes_frequency_id = ? WHERE id = ?",
                [
                    title,
                    description,
                    price,
                    price_frequency_id,
                    included_unlocks,
                    included_unlocks_frequency_id,
                    included_minutes,
                    included_minutes_frequency_id,
                    planId,
                ]
            );

            await database.closeDb(db);

            return res.json({
                message: "Plan updated successfully",
                data: updatedPlan,
            });
        } catch (error) {
            console.error("Error updating plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deletePlan: async function (req, res) {
        try {
            const db = await database.openDb();
            const planId = req.params.planId;

            await database.query(db, "DELETE FROM plan WHERE id = ?", planId);

            await database.closeDb(db);

            return res.json({
                message: "Plan deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = plans;
