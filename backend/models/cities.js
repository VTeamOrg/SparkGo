const database = require("../db/database.js");

const cities = {
    getAllCities: async function (req, res) {
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

    getCityById: async function (req, res) {
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

    createCity: async function (req, res) {
        try {
            const db = await database.openDb();
            const { name } = req.body; 

            const newCity = await database.query(
                db,
                "INSERT INTO city (name) VALUES (?)",
                [name]
            );

            await database.closeDb(db);

            return res.status(201).json({
                message: "City created successfully",
                data: newCity,
            });
        } catch (error) {
            console.error("Error creating city:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateCity: async function (req, res) {
        try {
            const db = await database.openDb();
            const cityId = req.params.cityId;
            const { name, population } = req.body; // Fields to update

            const updatedCity = await database.query(
                db,
                "UPDATE city SET name = ? WHERE id = ?",
                [name, cityId]
            );

            await database.closeDb(db);

            return res.json({
                message: "City updated successfully",
                data: updatedCity,
            });
        } catch (error) {
            console.error("Error updating city:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteCity: async function (req, res) {
        try {
            const db = await database.openDb();
            const cityId = req.params.cityId;

            await database.query(db, "DELETE FROM city WHERE id = ?", cityId);

            await database.closeDb(db);

            return res.json({
                message: "City deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting city:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = cities;
