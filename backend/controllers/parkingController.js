const parkingZoneModel = require("../models/parkingModel.js");

const parkingZoneController = {
    getAllParkingZones: async function (req, res) {
        try {
            const allParkingZones = await parkingZoneModel.getAllParkingZones();
            return res.json({
                data: allParkingZones,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getParkingZoneById: async function (req, res) {
        try {
            const parkingZoneId = req.params.parkingZoneId;
            const parkingZone = await parkingZoneModel.getParkingZoneById(parkingZoneId);

            return res.json({
                data: parkingZone,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createParkingZone: async function (req, res) {
        try {
            const { name, coords_lat, coords_long, city_id } = req.body;
            const newParkingZone = await parkingZoneModel.createParkingZone({ name, coords_lat, coords_long, city_id });

            return res.status(201).json({
                message: "Parking Zone created successfully",
                data: newParkingZone,
            });
        } catch (error) {
            console.error("Error creating parking zone:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateParkingZone: async function (req, res) {
        try {
            const parkingZoneId = req.params.parkingZoneId;
            const { name, coords_lat, coords_long, city_id } = req.body;
            const updatedParkingZone = await parkingZoneModel.updateParkingZone(parkingZoneId, { name, coords_lat, coords_long, city_id });

            return res.json({
                message: "Parking Zone updated successfully",
                data: updatedParkingZone,
            });
        } catch (error) {
            console.error("Error updating parking zone:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteParkingZone: async function (req, res) {
        try {
            const parkingZoneId = req.params.parkingZoneId;
            await parkingZoneModel.deleteParkingZone(parkingZoneId);

            return res.json({
                message: "Parking Zone deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting parking zone:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = parkingZoneController;