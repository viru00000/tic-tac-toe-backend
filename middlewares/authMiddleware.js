const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Ensure token extraction from the header is correct.
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


module.exports = authenticateToken;
