const vehiclesModel = require("../models/vehiclesModel.js");
const { connectedVehicles, connectedUsers } = require("../routes/websocketRoutes/store.js")

const vehiclesController = {
    getAllVehicles: async function (req, res) {
        try {
            const allVehicles = await vehiclesModel.getAllVehicles();

            return res.json({
                data: allVehicles ?? [],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Failed to fetch all vehicles from the database" });
        }
    },

    getVehicleById: async function (req, res) {
        try {
            const vehicleId = req.params.vehicleId;
            const vehicle = await vehiclesModel.getVehicleById(vehicleId);

            return res.json({ data: [vehicle] ?? [] });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Failed to fetch vehicle by ID from the database" });
        }
    },

    getVehicleByStationId: async function (req, res) {
        try {
            const stationId = req.params.stationId;
            const vehicle = await vehiclesModel.getVehiclesByStationId(stationId);

            return res.json({ data: [vehicle] ?? [] });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Failed to fetch vehicle by station ID from the database" });
        }
    },

    getActiveVehicles: async function (req, res) {
        const { forClient } = req.query;

        // when auth is implemented, change this to the user's ID
        const userId = 1;

        try {
            const activeVehicles = await vehiclesModel.getActiveVehicles();

            if (forClient) {
                // for the client will exclude vehicles that are rented and vehicles that have low battery
                const result = activeVehicles.filter(vehicle => (vehicle.rentedBy === -1 || vehicle.rentedBy === userId) && vehicle.battery > 20);
                return res.json({
                    data: result ?? [],
                });
            }

            return res.json({
                data: activeVehicles ?? [],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Failed to fetch active vehicles from the database" });
        }
    },

    getRentedVehiclesByMemberId: async function (req, res) {
        try {
            const memberId = req.params.id;
            const connectedUser = connectedUsers.get().find(user => user.id == memberId);

            if (!connectedUser) return res.json({ vehicleId: -1, memberId: -1 });


            return res.json({
                vehicleId: connectedUser.rentedVehicle,
                memberId: connectedUser.id,
                isStarted: connectedUser.isStarted,
            });

        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Failed to fetch rented vehicles by member ID from the database" });
        }
    },


    createVehicle: async function (req, res) {
        try {
            const { city_id, type_id, vehicle_status, name, station_id } = req.body;

            const normalizedStationId = station_id === "" ? null : station_id;

            const newVehicle = await vehiclesModel.createVehicle(city_id, type_id, vehicle_status, name, normalizedStationId);

            return res.status(201).json({
                message: "Vehicle created successfully",
                data: newVehicle,
            });
        } catch (error) {
            console.error("Error creating vehicle:", error.message);
            return res.status(500).json({ error: "Failed to create a new vehicle in the database" });
        }
    },

    updateVehicle: async function (req, res) {
        console.log("update vehicle controller");
        try {
            const vehicleId = req.params.vehicleId;
            const { city_id, type_id, vehicle_status, name, station_id } = req.body;
            console.log(station_id);
            const updatedVehicle = await vehiclesModel.updateVehicle(vehicleId, city_id, type_id, vehicle_status, name, station_id);

            return res.json({
                message: "Vehicle updated successfully",
                data: updatedVehicle,
            });
        } catch (error) {
            console.error("Error updating vehicle:", error.message);
            return res.status(500).json({ error: "Failed to update the vehicle in the database" });
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
            return res.status(500).json({ error: "Failed to delete the vehicle from the database" });
        }
    },
};

module.exports = vehiclesController;