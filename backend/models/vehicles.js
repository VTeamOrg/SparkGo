const database = require("../db/database.js");

const vehicles = {
    getAllVehicles: async function getAllVehicles(req, res) {
        try {
            const db = await database.openDb();
            const allVehicles = await database.query(
                db,
                "SELECT * FROM vehicle ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allVehicles,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getVehicleById: async function getVehicleById(req, res) {
        try {
            const db = await database.openDb();
            const vehicleId = req.params.vehicleId;
            const vehicle = await database.query(
                db,
                "SELECT * FROM vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);

            return res.json({
                data: vehicle[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createVehicle: async function (req, res) {
        try {
            const db = await database.openDb();
            const { city_id, type_id, rented_by } = req.body; // Assuming these are required fields for creating a vehicle

            const newVehicle = await database.query(
                db,
                "INSERT INTO vehicle (city_id, type_id, rented_by) VALUES (?, ?, ?)",
                [city_id, type_id, rented_by]
            );

            await database.closeDb(db);

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
        try {
            const db = await database.openDb();
            const vehicleId = req.params.vehicleId;
            const { city_id, type_id, rented_by } = req.body; // Fields to update

            const updatedVehicle = await database.query(
                db,
                "UPDATE vehicle SET city_id = ?, type_id = ?, rented_by = ? WHERE id = ?",
                [city_id, type_id, rented_by, vehicleId]
            );

            await database.closeDb(db);

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
            const db = await database.openDb();
            const vehicleId = req.params.vehicleId;

            await database.query(
                db,
                "DELETE FROM vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);

            return res.json({
                message: "Vehicle deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting vehicle:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = vehicles;
