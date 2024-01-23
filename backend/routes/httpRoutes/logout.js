const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    res.clearCookie('authToken', { path: '/v1' });
    res.clearCookie('userId', { path: '/v1' });
    res.clearCookie('authToken', { path: '/' });
    res.clearCookie('userId', { path: '/' });
    // Optionally redirect to the home page
    res.status(200).json({ message: 'Logged out successfully' });
  });

  module.exports = router;