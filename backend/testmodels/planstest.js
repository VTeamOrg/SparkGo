const database = require("../db/database.js");

const plans = {
    getAllPlans: async function () {
        try {
            const db = await database.openDb();
            const allPlans = await database.query(
                db,
                "SELECT * FROM v_plan ORDER BY id DESC"
            );

            await database.closeDb(db);

            return allPlans;
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    getPlanById: async function (planId) {
        try {
            const db = await database.openDb();
            const plan = await database.query(
                db,
                "SELECT * FROM plan WHERE id = ?",
                planId
            );

            await database.closeDb(db);

            return plan[0];
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    createPlan: async function ({
        title,
        description,
        price,
        price_frequency_id,
        included_unlocks,
        included_unlocks_frequency_id,
        included_minutes,
        included_minutes_frequency_id,
    }) {
        try {
            const db = await database.openDb();

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

            return newPlan;
        } catch (error) {
            console.error("Error creating plan:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    updatePlan: async function (
        planId,
        {
            title,
            description,
            price,
            price_frequency_id,
            included_unlocks,
            included_unlocks_frequency_id,
            included_minutes,
            included_minutes_frequency_id,
        }
    ) {
        try {
            const db = await database.openDb();

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

            return updatedPlan;
        } catch (error) {
            console.error("Error updating plan:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    deletePlan: async function (planId) {
        try {
            const db = await database.openDb();

            await database.query(db, "DELETE FROM plan WHERE id = ?", planId);

            await database.closeDb(db);

            return { message: "Plan deleted successfully" };
        } catch (error) {
            console.error("Error deleting plan:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = plans;
