const plansModel = require("../models/plansModel.js");

const plansController = {
    getAllPlans: async function (req, res) {
        try {
            const allPlans = await plansModel.getAllPlans();
            return res.json({
                data: allPlans,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPlanById: async function (req, res) {
        try {
            const planId = req.params.planId;
            const plan = await plansModel.getPlanById(planId);

            return res.json({
                data: plan,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createPlan: async function (req, res) {
        try {
            const newPlan = await plansModel.createPlan(req.body);

            return res.status(201).json({
                message: "Plan created successfully",
                data: newPlan,
            });
        } catch (error) {
            console.error("Error creating plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updatePlan: async function (req, res) {
        try {
            const planId = req.params.planId;
            const updatedPlan = await plansModel.updatePlan(planId, req.body);

            return res.json({
                message: "Plan updated successfully",
                data: updatedPlan,
            });
        } catch (error) {
            console.error("Error updating plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deletePlan: async function (req, res) {
        try {
            const planId = req.params.planId;
            await plansModel.deletePlan(planId);

            return res.json({
                message: "Plan deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting plan:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = plansController;
