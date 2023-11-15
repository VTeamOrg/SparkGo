const database = require("../db/database.js");

const users = {
    getAllUsers: async function getAllUsers(req, res) {
        try {
            const db = await database.openDb();
            const allUsers = await database.query(
                db,
                "SELECT * FROM member ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allUsers,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getUserById: async function getUserById(req, res) {
        try {
            const db = await database.openDb();
            const userId = req.params.userId;
            const user = await database.query(
                db,
                "SELECT * FROM member WHERE id = ?",
                userId
            );

            await database.closeDb(db);

            return res.json({
                data: user[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Rest of the CRUD operations with a similar structure...
};

module.exports = users;
