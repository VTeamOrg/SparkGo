const database = require("../db/database.js");

const stations = {
    getAllStations: async function getAllStations(req, res) {
        try {
            const db = await database.openDb();
            const allStations = await database.query(
                db,
                "SELECT * FROM renting_station ORDER BY id DESC"
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

    getStationsById: async function getStationsById(req, res) {
        try {
            const db = await database.openDb();
            const stationId = req.params.stationId;
            const station = await database.query(
                db,
                "SELECT * FROM renting_station WHERE id = ?",
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

    // Rest of the CRUD operations with a similar structure...
};

module.exports = stations;
