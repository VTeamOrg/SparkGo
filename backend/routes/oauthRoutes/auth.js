const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const userModel = require("../../models/userModel.js"); // Import the usersController

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
  const data = await response.json();
  console.log('data', data);
  return data; // This should now include the email if the scope was correctly requested and consented to
}

// Check if the user is an admin route
router.get('/check-admin', async function (req, res, next) {
  try {
    // Check if the isAdmin flag is set in the session
    const isAdmin = req.session.isAdmin || false; // Default to false if not set
    const isLoggedIn = req.session.isLoggedIn || false; // You can also check if the user is logged in
console.log("isadmin: ", isAdmin);
console.log("isLoggedIn: ", isLoggedIn);

    res.json({ isAdmin, isLoggedIn });
  } catch (err) {
    console.log('Error checking admin status', err);
    res.status(500).json({ error: 'Error checking admin status' });
  }
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  const code = req.query.code;
  console.log(code);
  try {
    const redirectURL = "http://localhost:3000/v1/auth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );

    const r = await oAuth2Client.getToken({
      code,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    });

    await oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.');

    const userData = await getUserData(oAuth2Client.credentials.access_token);
    console.log('User Email:', userData.email);

    const user = await userModel.getUserByEmail(userData.email);
    if (user) {
      // If user exists, check if they are an admin
      const isAdmin = await userModel.isAdminByEmail(userData.email);
      if (isAdmin) {
        console.log('User is an admin');
        req.session.isAdmin = true;
        req.session.isLoggedIn = true;
        // Add admin-specific logic here
      } else {
        console.log('User is not an admin');
        req.session.isAdmin = false;
        req.session.isLoggedIn = false;
        // Handle non-admin user logic here
      }
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
      });
    } else {
      console.log('User not found');
      // Handle logic for when the user is not found
    }
  } catch (err) {
    console.log('Error logging in with OAuth2 user', err);
  }

  res.redirect(303, 'http://127.0.0.1:5173/');
});

module.exports = router;
