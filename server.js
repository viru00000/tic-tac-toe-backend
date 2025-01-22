const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const path = require('path');

dotenv.config();
const app = express();

// Set views directory to frontend/views
app.set('views', path.join(__dirname, 'front-end', 'views')); // Set the correct views folder path
app.set('view engine', 'ejs'); // Set EJS as the view engine

app.use(cors());
app.use(express.json()); // Allow JSON requests
app.use(express.static(path.join(__dirname, 'front-end'))); // Serve static files from frontend

app.use('/api', routes); // Ensure /api is mapped to the routes

// Database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Render the index.ejs file
app.get('/', (req, res) => {
  res.render('index'); // Render index.ejs located in frontend/views
});

// A simple route to test the rendering
app.get('/test', (req, res) => {
  res.render('index');
});
