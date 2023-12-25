const frequencyModel = require("../models/frequencyModel.js");

const frequenciesController = {
    getAllFrequencies: async function (req, res) {
        try {
            const allFrequencies = await frequencyModel.getAllFrequencies();
            return res.json({
                data: allFrequencies,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getFrequencyById: async function (req, res) {
        try {
            const frequencyId = req.params.frequencyId;
            const frequency = await frequencyModel.getFrequencyById(frequencyId);

            return res.json({
                data: frequency,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = frequenciesController;
