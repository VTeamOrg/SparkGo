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
    updateUser: async function updateUser(req, res) {
        try {
            const db = await database.openDb();
            const userId = req.params.userId;
            const {
                /* fields to update */
            } = req.body;

            // Perform an update query based on fields sent in the request
            const updatedUser = await database.query(
                db,
                "UPDATE member SET /* fields to update */ WHERE id = ?",
                [, /* updated field values */ userId]
            );

            await database.closeDb(db);

            return res.json({
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error) {
            console.error("Error updating user:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteUser: async function deleteUser(req, res) {
        try {
            const db = await database.openDb();
            const userId = req.params.userId;

            // Delete user query
            await database.query(db, "DELETE FROM member WHERE id = ?", userId);

            await database.closeDb(db);

            return res.json({
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting user:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = users;
