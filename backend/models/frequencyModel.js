const database = require("../db/database.js");

const frequencyModel = {
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
            throw error;
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
            throw error;
        }
    },
};

module.exports = frequencyModel;
