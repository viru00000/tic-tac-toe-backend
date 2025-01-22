const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));
