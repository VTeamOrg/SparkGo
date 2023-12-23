const database = require("../db/database.js");

const plansModel = {
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
            throw error;
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
            throw error;
        }
    },

    createPlan: async function (planData) {
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
            } = planData;

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
            throw error;
        }
    },

    updatePlan: async function (planId, updatedFields) {
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
            } = updatedFields;

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
            throw error;
        }
    },

    deletePlan: async function (planId) {
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM plan WHERE id = ?", planId);
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = plansModel;
