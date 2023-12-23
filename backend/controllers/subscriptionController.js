const subscriptionModel = require("../models/subscriptionModel");

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

    // updateSubscriptionByMemberId: async function (req, res) {
    //     try {
    //         const memberId = req.params.memberId;
    //         const { is_paused } = req.body;

    //         if (is_paused === undefined) {
    //             return res.status(400).json({ error: "Bad Request" });
    //         }

    //         const updateSubscription = await subscriptionModel.updateSubscriptionByMemberId(memberId, is_paused);

    //         return res.json({
    //             message: "Subscription updated successfully",
    //             data: updateSubscription,
    //         });
    //     } catch (error) {
    //         console.error("Error updating subscription:", error.message);
    //         return res.status(500).json({ error: "Internal Server Error" });
    //     }
    // },
};

module.exports = subscriptionController;
