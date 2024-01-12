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
    },

    createActivePlan: async function (checkoutSession) {
        try {
            const db = await database.openDb();
    
            // Extract relevant information from the checkout session
            const { subscription, customer } = checkoutSession;
            const priceId = checkoutSession.line_items[0].price;
            console.log(checkoutSession);
    
            // Check if there is an existing active plan for the member
            const existingActivePlan = await database.query(
                db,
                "SELECT * FROM active_plan WHERE member_id = ? AND is_paused = ?",
                [customer, 'N']
            );
    
            if (existingActivePlan.length > 0) {
                // If an active plan exists, deactivate it
                const deactivateExistingPlan = await database.query(
                    db,
                    "UPDATE active_plan SET is_paused = ? WHERE member_id = ? AND is_paused = ?",
                    ['N', customer, 'Y']
                );
    
                console.log("Existing active plan deactivated:", deactivateExistingPlan);
            }
    
            // Create a new active plan in the database
            const createNewActivePlan = await database.query(
                db,
                "CALL create_active_plan(?, ?, NOW(), @result_message)",
                [priceId, customer, subscription]
            );
    
            // Retrieve the result message from the stored procedure
            const resultMessage = await database.query(db, "SELECT @result_message");
    
            await database.closeDb(db);
    
            console.log(resultMessage[0]['@result_message']);
    
            return createNewActivePlan;
        } catch (error) {
            console.error("Error updating/creating subscription in the database:", error.message);
            throw error; // Rethrow the error for handling in the calling function
        }  
    },
};

module.exports = subscriptionModel;
