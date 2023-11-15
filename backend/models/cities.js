const database = require("../db/database.js");

const cities = {
    getAllCities: async function getAllCities(req, res) {
        try {
            const db = await database.openDb();
            const allCities = await database.query(
                db,
                "SELECT * FROM city ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allCities,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getCityById: async function getCityById(req, res) {
        try {
            const db = await database.openDb();
            const cityId = req.params.cityId;
            const city = await database.query(
                db,
                "SELECT * FROM city WHERE id = ?",
                cityId
            );

            await database.closeDb(db);

            return res.json({
                data: city[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Rest of the CRUD operations with a similar structure...
};

module.exports = cities;
