const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const usersController = require("../../controllers/usersController.js"); // Import the usersController

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  console.log('data', data);
  return data;
}

router.get('/', async function(req, res, next) {
  const code = req.query.code;
  console.log(code);
  
  try {
    const redirectURL = "http://localhost:3000/v1/auth"
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );
    const r =  await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(r.tokens);

    console.info('Tokens acquired.');

    const user = oAuth2Client.credentials;
    console.log('credentials', user);

    const userData = await getUserData(oAuth2Client.credentials.access_token);

    // Use the email to fetch user data by email
    if (userData.email) {
      const userEmail = userData.email;
      console.log('userEmail', userEmail);
      const apiUrl = 'http://localhost:3000'; // Update with your server's URL
      const response = await fetch(`${apiUrl}/v1/users/email/${encodeURIComponent(userEmail)}`);
      
      const userByEmail = await response.json();

      if (userByEmail) {
        // User found by email
        console.log('User found by email:', userByEmail);
      } else {
        // User not found by email
        console.log('User not found by email');
      }
    } 

  } catch (err) {
    console.log('Error logging in with OAuth2 user', err);
  }

  res.redirect(303, 'http://127.0.0.1:5173/');
});

module.exports = router;
