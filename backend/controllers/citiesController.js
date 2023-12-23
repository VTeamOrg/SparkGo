const cityModel = require("../models/cityModel");

const citiesController = {
    getAllCities: async function (req, res) {
        try {
            const allCities = await cityModel.getAllCities();
            return res.json({
                data: allCities,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getCityById: async function (req, res) {
        try {
            const cityId = req.params.cityId;
            const city = await cityModel.getCityById(cityId);

            return res.json({
                data: city,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createCity: async function (req, res) {
        try {
            const { name } = req.body;

            const newCity = await cityModel.createCity(name);

            return res.status(201).json({
                message: "City created successfully",
                data: newCity,
            });
        } catch (error) {
            console.error("Error creating city:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateCity: async function (req, res) {
        try {
            const cityId = req.params.cityId;
            const { name } = req.body; // Fields to update

            const updatedCity = await cityModel.updateCity(cityId, name);

            return res.json({
                message: "City updated successfully",
                data: updatedCity,
            });
        } catch (error) {
            console.error("Error updating city:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteCity: async function (req, res) {
        try {
            const cityId = req.params.cityId;

            await cityModel.deleteCity(cityId);

            return res.json({
                message: "City deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting city:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = citiesController;
