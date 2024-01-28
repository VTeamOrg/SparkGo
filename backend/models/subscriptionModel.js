const database = require("../db/database.js");

const subscriptionModel = {
    getSubscription: async function () {
        try {
            const db = await database.openDb();
            const allSubscription = await database.query(
                db,
                "SELECT * FROM active_plan"
            );
            await database.closeDb(db);
            return allSubscription;
        } catch (error) {
            throw error;
        }
    },

    getSubscriptionByMemberId: async function (memberId) {
        try {
            if (memberId == null) {
                return null;
            }

            const db = await database.openDb();
            const memberSubscription = await database.query(
                db,
                "SELECT * FROM active_plan WHERE member_id = ?",
                memberId
            );
            await database.closeDb(db);
            return memberSubscription[0];
        } catch (error) {
            throw error;
        }
    },

    updateSubscriptionPause : async function (memberId, is_paused) {
        try {
            const db = await database.openDb();
            const updateSubscription = await database.query(
                db,
                "UPDATE active_plan SET is_paused = ? WHERE member_id = ?",
                [is_paused, memberId]
            );
            await database.closeDb(db);
            return updateSubscription;
        } catch (error) {
            throw error;
        }
    },

    updateAvailableMinutes: async function (memberId, available_minutes) {
        try {
            const db = await database.openDb();
            const updateSubscription = await database.query(
                db,
                "UPDATE active_plan SET available_minutes = ? WHERE member_id = ?",
                [available_minutes, memberId]
            );
            await database.closeDb(db);
            return updateSubscription;
        } catch (error) {
            throw error;
        }
    },

    updateAvailableUnlocks: async function (memberId, available_unlocks) {
        try {
            const db = await database.openDb();
            const updateSubscription = await database.query(
                db,
                "UPDATE active_plan SET available_unlocks = ? WHERE member_id = ?",
                [available_unlocks, memberId]
            );
            await database.closeDb(db);
            return updateSubscription;
        } catch (error) {
            throw error;
        }
    },
    
    createActivePlan: async function (planId, subscriptionId, customerId) {
        try {
            const db = await database.openDb();
       
            // Create a new active plan in the database
            const createNewActivePlan = await database.query(
                db,
                "CALL create_active_plan(?, ?, ?, ?)",
                [planId, customerId, subscriptionId, new Date().toISOString().split('T')[0]]
            );
    
            await database.closeDb(db);
            return createNewActivePlan;
        } catch (error) {
            console.error("Error updating/creating subscription in the database:", error.message);
            throw error; // Rethrow the error for handling in the calling function
        }  
    },

    cancelActivePlan: async function (memberId) {
        try {
            const db = await database.openDb();
            const cancelActivePlan = await database.query(
                db,
                "DELETE FROM active_plan WHERE member_id = ?",
                [memberId]
            );
            await database.closeDb(db);
            return cancelActivePlan;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = subscriptionModel;
