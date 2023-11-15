const database = require("../db/database.js");

const vehicles = {
    getAllVehicles: async function getAllVehicles(req, res) {
        try {
            const db = await database.openDb();
            const allVehicles = await database.query(
                db,
                "SELECT * FROM vehicle ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allVehicles,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getVehicleById: async function getVehicleById(req, res) {
        try {
            const db = await database.openDb();
            const vehicleId = req.params.vehicleId;
            const vehicle = await database.query(
                db,
                "SELECT * FROM vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);

            return res.json({
                data: vehicle[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Rest of the CRUD operations with a similar structure...
};

module.exports = vehicles;
