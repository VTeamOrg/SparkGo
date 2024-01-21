const tokenModel = require("../models/tokenModel.js");
const userModel = require("../models/userModel.js");

// adminOnlyAccess.js
const adminOnlyAccess = async (req, res, next) => {
  try {
      const userId = req.cookies.userId;
      const authToken = req.cookies.authToken;

      const isValidToken = await tokenModel.validateAuthTokenAndUserId(authToken, userId);
      if (!isValidToken) {
          return res.status(403).json({ message: 'Invalid session or token expired' });
      }

      // Retrieve user email or role based on userId
      const user = await userModel.getUserById(userId);
      if (!user) {
          return res.status(403).json({ message: 'User not found' });
      }

      // Check if the user has an admin role
      if (user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied. Admins only.' });
      }

      // Optionally, add userRole to request object for use in subsequent routes
      req.userRole = user.role;

      next();
  } catch (error) {
      console.error('Session validation error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = adminOnlyAccess;

