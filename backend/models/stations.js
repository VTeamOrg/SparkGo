const database = require("../db/database.js");

const stations = {
    getAllStations: async function (req, res) {
        try {
            const db = await database.openDb();
            const allStations = await database.query(
                db,
                "SELECT * FROM v_renting_station ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allStations,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getStationById: async function (req, res) {
        try {
            const db = await database.openDb();
            const stationId = req.params.stationId;
            const station = await database.query(
                db,
                "SELECT * FROM v_renting_station WHERE id = ?",
                stationId
            );

            await database.closeDb(db);

            return res.json({
                data: station[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createStation: async function (req, res) {
        try {
            const db = await database.openDb();
            const { name, coords_lat, coords_long, city_id } = req.body; // Assuming these are required fields for creating a station

            const newStation = await database.query(
                db,
                "INSERT INTO renting_station (name, coords_lat, coords_long, city_id) VALUES (?, ?, ?, ?)",
                [name, coords_lat, coords_long, city_id]
            );

            await database.closeDb(db);

            return res.status(201).json({
                message: "Station created successfully",
                data: newStation,
            });
        } catch (error) {
            console.error("Error creating station:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateStation: async function (req, res) {
        try {
            const db = await database.openDb();
            const stationId = req.params.stationId;
            const { name, coords_lat, coords_long, city_id } = req.body; // Fields to update

            const updatedStation = await database.query(
                db,
                "UPDATE renting_station SET name = ?, coords_lat = ?, coords_long = ?, city_id = ? WHERE id = ?",
                [name, coords_lat, coords_long, city_id, stationId]
            );

            await database.closeDb(db);

            return res.json({
                message: "Station updated successfully",
                data: updatedStation,
            });
        } catch (error) {
            console.error("Error updating station:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteStation: async function (req, res) {
        try {
            const db = await database.openDb();
            const stationId = req.params.stationId;

            await database.query(
                db,
                "DELETE FROM renting_station WHERE id = ?",
                stationId
            );

            await database.closeDb(db);

            return res.json({
                message: "Station deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting station:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = stations;
