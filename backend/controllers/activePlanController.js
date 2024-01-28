const activePlanModel = require("../models/activePlanModel");

const activePlanController = {
    getAllActivePlans: async function (req, res) {
        try {
            const allActivePlans = await activePlanModel.getAllActivePlans();
            return res.json({
                data: allActivePlans,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getActivePlanById: async function (req, res) {
        try {
            const activePlanId = req.params.activePlanId;
            const activePlan = await activePlanModel.getActivePlanById(activePlanId);

            return res.json({
                data: activePlan,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getActivePlanByMemberId: async function (req, res) {
        try {
            const memberId = req.params.memberId;
            const activePlan = await activePlanModel.getActivePlanByMemberId(memberId);

            return res.json({
                data: activePlan,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createActivePlan: async function (req, res) {
        try {
            const { plan_id, member_id, stripe_subscription_id, activation_id,  } = req.body;

            const newActivePlan = await activePlanModel.createActivePlan(subscription_id, start_date, end_date);

            return res.status(201).json({
                message: "ActivePlan created successfully",
                data: newActivePlan,
            });
        } catch (error) {
            console.error("Error creating activePlan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateActivePlan: async function (req, res) {
        try {
            const activePlanId = req.params.activePlanId;
            const { plan_id, member_id, stripe_subscription_id, activation_id } = req.body;
            const updatedActivePlan = await activePlanModel.updateActivePlan(activePlanId, plan_id, member_id, stripe_subscription_id, activation_id);

            return res.json({
                message: "ActivePlan updated successfully",
                data: updatedActivePlan,
            });
        }
        catch (error) {
            console.error("Error updating activePlan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteActivePlan: async function (req, res) {
        try {
            const activePlanId = req.params.activePlanId;
            await activePlanModel.deleteActivePlan(activePlanId);

            return res.json({
                message: "ActivePlan deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting activePlan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },



}

module.exports = activePlanController;