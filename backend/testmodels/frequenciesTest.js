const database = require("../db/database.js");

const frequencies = {
    getAllFrequencies: async function () {
        try {
            const db = await database.openDb();
            const allFrequencies = await database.query(
                db,
                "SELECT * FROM frequencies"
            );

            await database.closeDb(db);

            return allFrequencies;
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    getFrequencyById: async function (frequencyId) {
        try {
            const db = await database.openDb();
            const frequency = await database.query(
                db,
                "SELECT * FROM frequencies WHERE id = ?",
                frequencyId
            );

            await database.closeDb(db);

            return frequency[0];
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = frequencies;
