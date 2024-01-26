const database = require("../db/database.js");

const tokenModel = {
    storeToken: async function (userId, authToken, expiresAt) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "INSERT INTO auth_tokens (user_id, auth_token, expires_at) VALUES (?, ?, ?)",
                [userId, authToken, expiresAt]
            );

            console.log(result);
            await database.closeDb(db);
    
            console.log(`Token stored for user ID ${userId}`, result);
        } catch (error) {
            console.error('Error storing token:', error);
            throw error;
        }
    },

    validateAuthTokenAndUserId: async function (authToken, userId) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "SELECT * FROM auth_tokens WHERE auth_token = ? AND user_id = ? AND expires_at > NOW() ORDER BY expires_at ASC",
                [authToken, userId]
            );
            await database.closeDb(db);

            console.log(result);

            return result.length > 0; // Returns true if the token is found and is not expired
        } catch (error) {
            throw error;
        }
    }
};

module.exports = tokenModel;