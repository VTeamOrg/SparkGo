require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db/database'); // Ensure this path is correct

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        console.error('No token provided');
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; 

        db.openDb().then(connection => {
            db.query(connection, 'SELECT * FROM member WHERE id = ?', [userId])
                .then(user => {
                    if (user.length > 0) {
                        req.user = user[0];
                        next();
                    } else {
                        console.error('User not found');
                        res.status(401).send('Unauthorized');
                    }
                    db.closeDb(connection);
                })
                .catch(err => {
                    console.error('Database error:', err.message);
                    res.status(500).send('Internal Server Error');
                    db.closeDb(connection);
                });
        });
    } catch (ex) {
        console.error('Token verification error:', ex.message);
        res.status(400).send('Invalid token.');
    }
};

module.exports = authenticate;