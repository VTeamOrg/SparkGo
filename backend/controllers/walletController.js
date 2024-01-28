const userModel = require("../models/userModel");

const walletController = {
    getWalletCredits: async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await userModel.getUserById(userId);
            const credits = user.wallet;
            res.json({ credits });
        } catch (error) {
            console.error("Error in getWalletCredits:", error.message);
            return res.status(500).json({ error: `Failed to get wallet credits: ${error.message}` });
        }
    }
}

module.exports = walletController;