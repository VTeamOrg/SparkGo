const database = require("../db/database.js");

const parkingZones = {
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
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
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
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    createParkingZone: async function (name, coords_lat, coords_long, city_id) {
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
            console.error("Error creating parking zone:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    updateParkingZone: async function (name, coords_lat, coords_long, city_id, parkingZoneId) {
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
            console.error("Error updating parking zone:", error.message);
            throw new Error("Internal Server Error");
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
            return { message: "Parking zone deleted successfully" };
        } catch (error) {
            console.error("Error deleting parking zone:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = parkingZones;