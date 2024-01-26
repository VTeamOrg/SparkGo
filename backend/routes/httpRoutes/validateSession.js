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

        console.log("Validated User Role:", user.role); // Log the validated user's role

        // Send response for both admin and non-admin users
        res.json({ userLoggedIn: true, userId, userRole: user.role });
    } else {
        res.json({ userLoggedIn: false });
    }
});


module.exports = router;