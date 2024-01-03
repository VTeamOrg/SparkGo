const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} =require('google-auth-library');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;



router.post('/', async (req, res) => {
    res.header('Access-Control-Allow-Origin','http://127.0.0.1:5173')
    res.header('Referred-Policy','no-reffered-when-downgrade')
    
    REDIRECT_URI='http://localhost:3000/v1/auth'

    const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope:'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt:'consent'
    });

    res.json({url: authorizeUrl})

});


module.exports = router