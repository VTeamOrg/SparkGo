

// adminOnlyAccess.js
const adminOnlyAccess = (req, res, next) => {
  // Assume the user's role is stored in a cookie named 'userRole'
  const userRole = req.cookies.userRole;
  console.log('userRole from cookie:', req.cookies.userRole);


  if (userRole !== 'admin') {
    // If the user is not an admin, return a 403 Forbidden response
    return res.status(403).json({ message: 'Access forbidden. Admins only.' });
  }

  // If the user is an admin, proceed to the next middleware/route handler
  next();
};

module.exports = adminOnlyAccess;

