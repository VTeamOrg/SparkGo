const database = require("../db/database.js");

const subscription = {
    getSubscription: async function getSubscription() {
        try {
            const db = await database.openDb();
            const allSubscription = await database.query(
                db,
                "SELECT * FROM active_plan"
            );

            await database.closeDb(db);

            return {
                data: allSubscription,
            };
        } catch (error) {
            console.error("Error querying database:", error.message);
            return { error: "Internal Server Error" };
        }
    },

    getSubscriptionByMemberId: async function getSubscriptionByMemberId(
        memberId
    ) {
        try {
            const db = await database.openDb();
            const memberSubscription = await database.query(
                db,
                "SELECT * FROM active_plan WHERE member_id = ?",
                memberId
            );

            await database.closeDb(db);

            return {
                data: memberSubscription[0],
            };
        } catch (error) {
            console.error("Error querying database:", error.message);
            return { error: "Internal Server Error" };
        }
    },

    updateSubscription: async function updateSubscription(memberId, isPaused) {
        try {
            const db = await database.openDb();
            const updateSubscription = await database.query(
                db,
                "UPDATE active_plan SET is_paused = ? WHERE plan_id = ?",
                [isPaused, memberId]
            );

            await database.closeDb(db);

            return {
                message: "Subscription updated successfully",
                data: updateSubscription,
            };
        } catch (error) {
            console.error("Error updating subscription:", error.message);
            return { error: "Internal Server Error" };
        }
    },
};

module.exports = subscription;
