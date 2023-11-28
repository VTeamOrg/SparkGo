const database = require("../db/database.js");

const vehicles = {
    getAllVehicles: async function getAllVehicles() {
        try {
            const db = await database.openDb();
            const allVehicles = await database.query(
                db,
                "SELECT * FROM v_vehicle ORDER BY id DESC"
            );

            await database.closeDb(db);

            return allVehicles;
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    getVehicleById: async function getVehicleById(vehicleId) {
        try {
            const db = await database.openDb();
            const vehicle = await database.query(
                db,
                "SELECT * FROM v_vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);

            return vehicle[0];
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    createVehicle: async function ({ city_id, type_id, rented_by }) {
        try {
            const db = await database.openDb();
            const newVehicle = await database.query(
                db,
                "INSERT INTO vehicle (city_id, type_id, rented_by) VALUES (?, ?, ?)",
                [city_id, type_id, rented_by]
            );

            await database.closeDb(db);

            return newVehicle;
        } catch (error) {
            console.error("Error creating vehicle:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    updateVehicle: async function (vehicleId, { city_id, type_id, rented_by }) {
        try {
            const db = await database.openDb();
            const updatedVehicle = await database.query(
                db,
                "UPDATE vehicle SET city_id = ?, type_id = ?, rented_by = ? WHERE id = ?",
                [city_id, type_id, rented_by, vehicleId]
            );

            await database.closeDb(db);

            return updatedVehicle;
        } catch (error) {
            console.error("Error updating vehicle:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    deleteVehicle: async function (vehicleId) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "DELETE FROM vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);

            return { message: "Vehicle deleted successfully" };
        } catch (error) {
            console.error("Error deleting vehicle:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = vehicles;
