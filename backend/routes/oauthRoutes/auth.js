const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const userModel = require("../../models/userModel.js");
const tokenModel = require("../../models/tokenModel.js"); 
const { createUserIfNotExists} = require("../../middleware/authMiddleware.js"); // Update the path as needed

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
  const data = await response.json();
  console.log('data', data);
  return data; 
}

router.get('/', async function (req, res) {
  const { code, redirect } = req.query;
  console.log(code);
  console.log(redirect);
  console.log(req.query);
  try {
    const redirectURL = `http://localhost:3000/v1/auth?redirect=${redirect}`;
    console.log(">", redirectURL);
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

    const userData = await getUserData(r.tokens.access_token);

    let user = await userModel.getUserByEmail(userData.email);
    if (!user) {
      user = await createUserIfNotExists(userData);
    } 

    const isAdmin = await userModel.isAdminByEmail(user.email);
    const isRepair = await userModel.isRepairByEmail(user.email);

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Set the token to expire in 1 hour, for example

    await tokenModel.storeToken(user.id, r.tokens.access_token, tokenExpiration);



    res.cookie('authToken', r.tokens.access_token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the token
      secure: true, // Set to true in production to ensure cookies are sent over HTTPS
      sameSite: 'strict',
      path: '/v1'
  });
  
  res.cookie('userRole', isAdmin ? 'admin' : (isRepair ? 'repair' : 'user'), {
      signed: true, // Sign the cookie
      httpOnly: true, // Assuming the client-side JavaScript does not need to read the user role
      secure: true, // Set to true in production
      sameSite: 'strict',
      path: '/v1'
  });
  
  res.cookie('userId', user.id, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the user ID
      secure: true, // Set to true in production
      sameSite: 'strict',
      path: '/v1'
  });
    

    console.log('Setting userRole cookie to:', isAdmin ? 'admin' : (isRepair ? 'repair' : 'user'));
    console.log("Setting Cookies - isAdmin:", isAdmin, "userID:", user.id, "authToken:", r.tokens.access_token);

    const redirectTo = "http://localhost:5173/v1?success=true";

    
    // Redirect to the client-side URL
    res.redirect(303, redirectTo);

  } catch (err) {
    console.log('Error logging in with OAuth2 user', err);
    res.redirect(303, 'http://localhost:5173/v1?success=false');
  }
});

module.exports = router;
