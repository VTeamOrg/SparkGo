const database = require("../db/database.js");

const stationsModel = {
    getAllStations: async function () {
        try {
            const db = await database.openDb();
            const allStations = await database.query(
                db,
                "SELECT * FROM v_renting_station ORDER BY id DESC"
            );
            await database.closeDb(db);
            return allStations;
        } catch (error) {
            throw error;
        }
    },

    getStationById: async function (stationId) {
        try {
            const db = await database.openDb();
            const station = await database.query(
                db,
                "SELECT * FROM v_renting_station WHERE id = ?",
                stationId
            );
            await database.closeDb(db);
            return station[0];
        } catch (error) {
            throw error;
        }
    },

    createStation: async function ({ name, coords_lat, coords_long, city_id }) {
        try {
            const db = await database.openDb();
            const newStation = await database.query(
                db,
                "INSERT INTO renting_station (name, coords_lat, coords_long, city_id) VALUES (?, ?, ?, ?)",
                [name, coords_lat, coords_long, city_id]
            );
            await database.closeDb(db);
            return newStation;
        } catch (error) {
            throw error;
        }
    },

    updateStation: async function (stationId, { name, coords_lat, coords_long, city_id }) {
        try {
            const db = await database.openDb();
            const updatedStation = await database.query(
                db,
                "UPDATE renting_station SET name = ?, coords_lat = ?, coords_long = ?, city_id = ? WHERE id = ?",
                [name, coords_lat, coords_long, city_id, stationId]
            );
            await database.closeDb(db);
            return updatedStation;
        } catch (error) {
            throw error;
        }
    },

    deleteStation: async function (stationId) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "DELETE FROM renting_station WHERE id = ?",
                stationId
            );
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = stationsModel;
