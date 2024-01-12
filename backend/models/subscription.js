const database = require("../db/database.js");

const subscription = {
    getSubscription: async function getSubscription(req, res) {
        try {
            const db = await database.openDb();
            const allSubscription = await database.query(
                db,
                "SELECT * FROM active_plan"
            );

            await database.closeDb(db);

            return res.json({
                data: allSubscription,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getSubscriptionByMemberId: async function getSubscriptionByMemberId(req, res) {
        try {
            const db = await database.openDb();
            const memberId = req.params.memberId;
            const memberSubscription = await database.query(
                db,
                "SELECT * FROM active_plan WHERE member_id = ?",
                memberId
            );

            await database.closeDb(db);

            return res.json({
                data: memberSubscription[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    
    updateSubscription: async function updateSubscription(req, res) {
        try {
            const db = await database.openDb();
            const subscriptionID = req.params.memberId;
            const { is_paused } = req.body;
    
            const updateSubscription = await database.query(
                db,
                "UPDATE active_plan SET is_paused = ? WHERE plan_id = ?",
                [is_paused, subscriptionID]
            );

            await database.closeDb(db);
    
            return res.json({
                message: "Subscription updated successfully",
                data: updateSubscription,
            });
        } catch (error) {
            console.error("Error updating subscription:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },    
};

const createActivePlan = async (checkoutSession) => {
    try {
        const db = await database.openDb();

        // Extract relevant information from the checkout session
        const { subscription, customer } = checkoutSession;
        console.log(checkoutSession);

        // Check if there is an existing active plan for the member
        const existingActivePlan = await database.query(
            db,
            "SELECT * FROM active_plan WHERE member_id = ? AND is_active = ?",
            [customer, true]
        );

        if (existingActivePlan.length > 0) {
            // If an active plan exists, deactivate it
            const deactivateExistingPlan = await database.query(
                db,
                "UPDATE active_plan SET is_active = ? WHERE member_id = ? AND is_active = ?",
                [false, customer, true]
            );

            console.log("Existing active plan deactivated:", deactivateExistingPlan);
        }

        // Create a new active plan in the database
        const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const createNewActivePlan = await database.query(
            db,
            "INSERT INTO active_plan (member_id, stripe_subscription_id, is_active, creation_date, activation_date) VALUES (?, ?, ?, ?, ?)",
            [customer, subscription, true, currentDate, currentDate]
        );

        await database.closeDb(db);

        console.log("New active plan created in the database:", createNewActivePlan);

        return createNewActivePlan;
    } catch (error) {
        console.error("Error updating/creating subscription in the database:", error.message);
        throw error; // Rethrow the error for handling in the calling function
    }
};


module.exports = {
    subscription,
    createActivePlan,
};
