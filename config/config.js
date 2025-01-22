require('dotenv').config(); // Load environment variables from .env file

const config = {
  jwtSecret: process.env.JWT_SECRET, // Fetch the JWT secret
  dbUri: process.env.DB_URI,        // Fetch database URI (example)
};

module.exports = config;
