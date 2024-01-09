const { v4: uuidv4 } = require('uuid');

const sessionSecret = uuidv4(); // Generate the session secret once

const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'none', // Set sameSite to 'none' for cross-site requests
  },
};

console.log("session config");
module.exports = sessionOptions;
