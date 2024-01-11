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

const updateSubscriptionInDatabase = async (checkoutSession) => {
    try {
        const db = await database.openDb();

        // Extract relevant information from the checkout session
        const { subscription, customer, items } = checkoutSession;

        // Assume you have a table named 'subscriptions' in your database
        // Update the table with the relevant information
        const updateSubscription = await database.query(
            db,
            "UPDATE subscriptions SET stripe_subscription_id = ?, plan_id = ?, is_active = ?, start_date = ?, end_date = ? WHERE member_id = ?",
            [subscription, items.data[0].price.product, true, items.data[0].price.recurring.start_date, items.data[0].price.recurring.end_date, customer]
        );

        await database.closeDb(db);

        console.log("Subscription updated in the database:", updateSubscription);

        return updateSubscription;
    } catch (error) {
        console.error("Error updating subscription in the database:", error.message);
        throw error; // Rethrow the error for handling in the calling function
    }
};

module.exports = {
    subscription,
    updateSubscriptionInDatabase,
};
