const database = require("../db/database.js");

const parkingZoneModel = {
    getAllParkingZones: async function () {
        try {
            const db = await database.openDb();
            const allParkingZones = await database.query(
                db,
                "SELECT * FROM v_parking_zone ORDER BY id DESC"
            );
            await database.closeDb(db);
            return allParkingZones;
        } catch (error) {
            throw error;
        }
    },

    getParkingZoneById: async function (parkingZoneId) {
        try {
            const db = await database.openDb();
            const parkingZone = await database.query(
                db,
                "SELECT * FROM v_parking_zone WHERE id = ?",
                parkingZoneId
            );
            await database.closeDb(db);
            return parkingZone[0];
        } catch (error) {
            throw error;
        }
    },

    createParkingZone: async function ({ name, coords_lat, coords_long, city_id }) {
        try {
            const db = await database.openDb();
            const newParkingZone = await database.query(
                db,
                "INSERT INTO parking_zone (name, coords_lat, coords_long, city_id) VALUES (?, ?, ?, ?)",
                [name, coords_lat, coords_long, city_id]
            );
            await database.closeDb(db);
            return newParkingZone;
        } catch (error) {
            throw error;
        }
    },

    updateParkingZone: async function (parkingZoneId, { name, coords_lat, coords_long, city_id }) {
        try {
            const db = await database.openDb();
            const updatedParkingZone = await database.query(
                db,
                "UPDATE parking_zone SET name = ?, coords_lat = ?, coords_long = ?, city_id = ? WHERE id = ?",
                [name, coords_lat, coords_long, city_id, parkingZoneId]
            );
            await database.closeDb(db);
            return updatedParkingZone;
        } catch (error) {
            throw error;
        }
    },

    deleteParkingZone: async function (parkingZoneId) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "DELETE FROM parking_zone WHERE id = ?",
                parkingZoneId
            );
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = parkingZoneModel;