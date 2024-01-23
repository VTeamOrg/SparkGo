const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;



router.post('/', async (req, res) => {
    
    const {redirect} = req.query;
    console.log(redirect);
    res.header('Access-Control-Allow-Origin',
    'http://localhost:5173',)
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Referred-Policy','no-reffered-when-downgrade');
    
    const REDIRECT_URI=`http://localhost:3000/v1/auth?redirect=${redirect}`;
    console.log(REDIRECT_URI);
    const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt:'consent'
    });

    res.json({url: authorizeUrl})

});

module.exports = router
