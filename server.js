const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware required by assignment
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // Form handling
app.use(express.static('public')); // Static file serving

// MySQL Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Successfully connected to MySQL database.');
    connection.release();
});

// Import and use routes
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// Basic Default Route
app.get('/', (req, res) => {
    res.send('Campus Lost & Found System Backend is Running!');
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});