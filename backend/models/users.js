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

    createUser: async function (req, res) {
        try {
            const db = await database.openDb();
            const { role, email, name, personal_number, address, wallet } =
                req.body; // Assuming these are required fields for creating a user

            const newUser = await database.query(
                db,
                "INSERT INTO member (role, email, name, personal_number, address, wallet) VALUES (?, ?, ?, ?, ?, ?)",
                [role, email, name, personal_number, address, wallet]
            );

            await database.closeDb(db);

            return res.status(201).json({
                message: "User created successfully",
                data: newUser,
            });
        } catch (error) {
            console.error("Error creating user:", error.message);
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
                role,
                email,
                name,
                personal_number,
                address,
                wallet,
                /* Other fields you might need to update */
            } = req.body;

            // Construct the SET part of the SQL query dynamically
            const setFields = [];
            const updateParams = [];

            if (role) {
                setFields.push("role = ?");
                updateParams.push(role);
            }
            if (email) {
                setFields.push("email = ?");
                updateParams.push(email);
            }
            if (name) {
                setFields.push("name = ?");
                updateParams.push(name);
            }
            if (personal_number) {
                setFields.push("personal_number = ?");
                updateParams.push(personal_number);
            }
            if (address) {
                setFields.push("address = ?");
                updateParams.push(address);
            }
            if (wallet) {
                setFields.push("wallet = ?");
                updateParams.push(wallet);
            }

            // Prepare the SQL query
            const setFieldsStr = setFields.join(", ");
            const updateQuery = `UPDATE member SET ${setFieldsStr} WHERE id = ?`;
            updateParams.push(userId); // Adding userId to the parameters

            // Perform the update query
            const updatedUser = await database.query(
                db,
                updateQuery,
                updateParams
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
