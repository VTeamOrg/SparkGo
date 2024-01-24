const database = require("../db/database.js");

const cities = {
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
            console.error("Error querying database:", error.message);
            throw new Error("Database query failed"); 
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
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
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
            console.error("Error creating city:", error.message);
            throw new Error("Database connection failed");
        }
    },

    updateCity: async function (name, cityId) {
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
            console.error("Error updating city:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    deleteCity: async function (cityId) {
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM city WHERE id = ?", cityId);

            await database.closeDb(db);

            return { message: "City deleted successfully" };
        } catch (error) {
            console.error("Error deleting city:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = cities;
