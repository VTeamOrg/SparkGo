const express = require("express");
const router = express.Router();
const tokenModel = require("../../models/tokenModel.js");
const userModel = require("../../models/userModel.js"); // Assuming userModel is correctly imported

router.get('/', async (req, res) => {
    const userId = req.cookies.userId;
    const authToken = req.cookies.authToken;

    const isValid = await tokenModel.validateAuthTokenAndUserId(authToken, userId);
    
    if (isValid) {
        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // If the user is an admin
        res.json({ userLoggedIn: true, userId, userRole: user.role });
    } else {
        res.json({ userLoggedIn: false });
    }
});



module.exports = router;