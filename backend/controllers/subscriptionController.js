const subscriptionModel = require("../models/subscriptionModel.js");

const subscriptionController = {
    getSubscription: async function (req, res) {
        try {
            const allSubscription = await subscriptionModel.getSubscription();
            return res.json({
                data: allSubscription,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getSubscriptionByMemberId: async function (req, res) {
        try {
            const memberId = req.params.memberId;
            const memberSubscription = await subscriptionModel.getSubscriptionByMemberId(memberId);

            return res.json({
                data: memberSubscription,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = subscriptionController;
