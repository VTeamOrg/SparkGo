const tokenModelTest = {
    storeToken: async function (userId, authToken, expiresAt) {
        // Simulating the storing of a token in the database
        console.log(`Mock: Storing token for user ID ${userId} with token ${authToken} that expires at ${expiresAt}`);
        return { userId, authToken, expiresAt }; // Mock response
    },

    validateAuthTokenAndUserId: async function (authToken, userId) {
        // Simulating token validation logic
        console.log(`Mock: Validating token ${authToken} for user ID ${userId}`);
        const isValid = (authToken === "validToken" && userId === "adminUserId"); // Mock condition
        return isValid; // Returns true if the conditions are met
    }
};

module.exports = tokenModelTest;