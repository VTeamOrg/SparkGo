const database = require("../db/database.js");

const tokenModelTest = {
    storeToken: async function (userId, authToken, expiresAt) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "INSERT INTO auth_tokens (user_id, auth_token, expires_at) VALUES (?, ?, ?)",
                [userId, authToken, expiresAt]
            );
            await database.closeDb(db);

            return result; // Return the database operation result
        } catch (error) {
            console.error("Error storing token in test model:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    validateAuthTokenAndUserId: async function (authToken, userId) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "SELECT * FROM auth_tokens WHERE auth_token = ? AND user_id = ? AND expires_at > NOW()",
                [authToken, userId]
            );
            await database.closeDb(db);

            return result.length > 0; // Returns true if the token is found and is not expired
        } catch (error) {
            console.error("Error validating token in test model:", error.message);
            throw new Error("Internal Server Error");
        }
    }
};

module.exports = tokenModelTest;