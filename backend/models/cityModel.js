const database = require("../db/database.js");

const cityModel = {
    getAllCities: async function () {
        try {
            const db = await database.openDb();
            const allCities = await database.query(
                db,
                "SELECT * FROM city ORDER BY id DESC"
            );
            await database.closeDb(db);
            return allCities;
        } catch (error) {
            throw error;
        }
    },

    getCityById: async function (cityId) {
        try {
            const db = await database.openDb();
            const city = await database.query(
                db,
                "SELECT * FROM city WHERE id = ?",
                cityId
            );
            await database.closeDb(db);
            return city[0];
        } catch (error) {
            throw error;
        }
    },

    createCity: async function (name) {
        try {
            const db = await database.openDb();
            const newCity = await database.query(
                db,
                "INSERT INTO city (name) VALUES (?)",
                [name]
            );
            await database.closeDb(db);
            return newCity;
        } catch (error) {
            throw error;
        }
    },

    updateCity: async function (cityId, name) {
        try {
            const db = await database.openDb();
            const updatedCity = await database.query(
                db,
                "UPDATE city SET name = ? WHERE id = ?",
                [name, cityId]
            );
            await database.closeDb(db);
            return updatedCity;
        } catch (error) {
            throw error;
        }
    },

    deleteCity: async function (cityId) {
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM city WHERE id = ?", cityId);
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = cityModel;
