const database = require("../db/database.js");

const vehicleType = {
    getAllVehicleTypes: async function () {
        try {
            const db = await database.openDb();
            const allVehicleTypes = await database.query(
                db,
                "SELECT * FROM vehicle_type"
            );

            await database.closeDb(db);

            return allVehicleTypes;
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    getVehicleTypeById: async function (typeId) {
        try {
            const db = await database.openDb();
            const vehicleType = await database.query(
                db,
                "SELECT * FROM vehicle_type WHERE id = ?",
                typeId
            );

            await database.closeDb(db);

            return vehicleType[0];
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    createVehicleType: async function (name) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "INSERT INTO vehicle_type (name) VALUES (?)",
                [name]
            );

            await database.closeDb(db);

            return {
                message: "Vehicle type created successfully",
                insertedId: result.insertId,
            };
        } catch (error) {
            console.error("Error creating vehicle type:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    updateVehicleType: async function (typeId, name) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "UPDATE vehicle_type SET name = ? WHERE id = ?",
                [name, typeId]
            );

            await database.closeDb(db);

            return { message: "Vehicle type updated successfully" };
        } catch (error) {
            console.error("Error updating vehicle type:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    deleteVehicleType: async function (typeId) {
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM vehicle_type WHERE id = ?", [
                typeId,
            ]);

            await database.closeDb(db);

            return { message: "Vehicle type deleted successfully" };
        } catch (error) {
            console.error("Error deleting vehicle type:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = vehicleType;
