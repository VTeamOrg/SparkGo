const activePlanModel = {
    getAllActivePlans: async function () {
        try {
            const db = await database.openDb();
            const allActivePlans = await database.query(
                db,
                "SELECT * FROM v_active_plan"
            );
            await database.closeDb(db);
            return allActivePlans;
        } catch (error) {
            throw error;
        }
    },

    getActivePlanById: async function (activePlanId) {
        try {
            const db = await database.openDb();
            const activePlan = await database.query(
                db,
                "SELECT * FROM v_active_plan WHERE id = ?;",
                activePlanId
            );
            await database.closeDb(db);
            return activePlan[0];
        } catch (error) {
            throw error;
        }
    },

    createActivePlan: async function ({ plan_id, member_id, stripe_subscription_id, activation_id,  }) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "INSERT INTO active_plan (plan_id, member_id, stripe_subscription_id, activation_id) VALUES (?, ?, ?, ?)",
                [plan_id, member_id, stripe_subscription_id, activation_id]
            );
            await database.closeDb(db);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    updateActivePlan: async function (activePlanId, { plan_id, member_id, stripe_subscription_id, activation_id }) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "UPDATE active_plan SET plan_id = ?, member_id = ?, stripe_subscription_id = ?, activation_id = ? WHERE id = ?",
                [plan_id, member_id, stripe_subscription_id, activation_id, activePlanId]
            );
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },

    deleteActivePlan: async function (activePlanId) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "DELETE FROM active_plan WHERE id = ?",
                activePlanId
            );
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    }

};

module.exports = activePlanModel;
