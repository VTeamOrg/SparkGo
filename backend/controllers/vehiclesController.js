const vehiclesModel = require("../models/vehiclesModel.js");
const { connectedVehicles } = require("../routes/websocketRoutes/store.js")

const vehiclesController = {
    getAllVehicles: async function (req, res) {
        try {
            const allVehicles = await vehiclesModel.getAllVehicles();

            return res.json({
                data: allVehicles ?? [],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getVehicleById: async function (req, res) {
        try {
            const vehicleId = req.params.vehicleId;
            const vehicle = await vehiclesModel.getVehicleById(vehicleId);

            return res.json({data: [vehicle] ?? []});
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getVehicleByStationId: async function (req, res) {
        try {
            const stationId = req.params.stationId;
            const vehicle = await vehiclesModel.getVehiclesByStationId(stationId);

            return res.json({data: [vehicle] ?? []});
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getActiveVehicles: async function (req, res) {
        const { forClient } = req.query;

        try {
            const activeVehicles = await vehiclesModel.getActiveVehicles();

            if (forClient) {
                // for client will exclude vehicles that is rented and vehicles that have a low battery
                const result = activeVehicles.filter(vehicle => vehicle.rentedBy === -1 && vehicle.battery > 20);
                return res.json({
                    data: result ?? [],
                });

            }

            return res.json({
                data: activeVehicles ?? [],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createVehicle: async function (req, res) {
        try {
            const { city_id, type_id, rented_by } = req.body;
            const newVehicle = await vehiclesModel.createVehicle(city_id, type_id, rented_by);

            return res.status(201).json({
                message: "Vehicle created successfully",
                data: newVehicle,
            });
        } catch (error) {
            console.error("Error creating vehicle:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateVehicle: async function (req, res) {
        console.log("update vehicle controller");
        try {
            const vehicleId = req.params.vehicleId;
            const { city_id, type_id, vehicle_status, name, station_id } = req.body;
            const updatedVehicle = await vehiclesModel.updateVehicle(vehicleId, city_id, type_id, vehicle_status, name, station_id);
    
            return res.json({
                message: "Vehicle updated successfully",
                data: updatedVehicle,
            });
        } catch (error) {
            console.error("Error updating vehicle:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteVehicle: async function (req, res) {
        try {
            const vehicleId = req.params.vehicleId;
            await vehiclesModel.deleteVehicle(vehicleId);

            return res.json({
                message: "Vehicle deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting vehicle:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = vehiclesController;
