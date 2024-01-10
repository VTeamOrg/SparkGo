const rateLimit = require('express-rate-limit');

const generalApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Authentication API limiter
const authApiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15,
    message: "Too many login attempts, please try again after an hour."
  });


// Exporting rate limiters and HTTP route loader function
module.exports = { generalApiLimiter, authApiLimiter };