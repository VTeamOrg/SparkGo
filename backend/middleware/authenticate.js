const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../usersController.js'); // Update with the correct path to your user model

const app = express();

app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            // ... same as before
        });
        const accessToken = tokenResponse.data.access_token;

        // Fetch user info from Google
        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
        const userData = userResponse.data;

        // Use userModel to check if the user exists
        try {
            const existingUser = await userModel.getUserByEmail(userData.email);
            
            if (existingUser) {
                // User found, issue JWT with user ID and role
                const userToken = jwt.sign({ 
                    user_id: existingUser.id, 
                    role: existingUser.role 
                }, process.env.JWT_SECRET);

                // Send the JWT back to the client
                res.send({ token: userToken });
            } else {
                // Handle registration for new user
                // You can create a new user in the database here
                // ...
            }
        } catch (error) {
            console.error('Error handling user data:', error.message);
            res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));