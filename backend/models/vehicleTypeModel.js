const database = require("../db/database.js");

const vehicleTypeModel = {
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
            throw error;
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
            throw error;
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
            return result;
        } catch (error) {
            throw error;
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
        } catch (error) {
            throw error;
        }
    },

    deleteVehicleType: async function (typeId) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "DELETE FROM vehicle_type WHERE id = ?",
                typeId
            );

            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = vehicleTypeModel;
