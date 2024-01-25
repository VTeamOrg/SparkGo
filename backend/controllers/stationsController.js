const stationsModel = require("../models/stationsModel.js");

const stationsController = {
    getAllStations: async function (req, res) {
        try {
            const allStations = await stationsModel.getAllStations();
            return res.json({
                data: allStations,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getStationById: async function (req, res) {
        try {
            const stationId = req.params.stationId;
            const station = await stationsModel.getStationById(stationId);

            return res.json({
                data: station,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createStation: async function (req, res) {
        try {
            const { name, coords_lat, coords_long, city_id } = req.body;
            const newStation = await stationsModel.createStation({ name, coords_lat, coords_long, city_id });

            return res.status(201).json({
                message: "Station created successfully",
                data: newStation,
            });
        } catch (error) {
            console.error("Error creating station:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateStation: async function (req, res) {
        console.log("update");
        try {
            const stationId = req.params.stationId;
            console.log("update ", stationId);
            const { name, coords_lat, coords_long, city_id } = req.body;
            const updatedStation = await stationsModel.updateStation(stationId, { name, coords_lat, coords_long, city_id });

            return res.json({
                message: "Station updated successfully",
                data: updatedStation,
            });
        } catch (error) {
            console.error("Error updating station:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteStation: async function (req, res) {
        try {
            const stationId = req.params.stationId;
            await stationsModel.deleteStation(stationId);

            return res.json({
                message: "Station deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting station:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = stationsController;
