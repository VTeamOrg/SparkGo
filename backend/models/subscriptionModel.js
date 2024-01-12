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
    }
};

module.exports = subscriptionModel;
