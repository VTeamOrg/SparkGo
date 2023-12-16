const database = require("../db/database.js");

const frequencies = {
    getAllFrequencies: async function (req, res) {
        try {
            const db = await database.openDb();
            const allFrequencies = await database.query(
                db,
                "SELECT * FROM frequencies"
            );

            await database.closeDb(db);

            return res.json({
                data: allFrequencies,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getFrequencyById: async function (req, res) {
        try {
            const db = await database.openDb();
            const frequencyId = req.params.frequencyId;
            const frequency = await database.query(
                db,
                "SELECT * FROM frequencies WHERE id = ?",
                frequencyId
            );

            await database.closeDb(db);

            return res.json({
                data: frequency[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = frequencies;
