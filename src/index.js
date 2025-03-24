const express = require('express');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');

// Initialize express app
const app = express();

// Connect to SQLite Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Leave Management System API' });
});

// Parse command line arguments for port
const argv = require('minimist')(process.argv.slice(2));

// Start server
const PORT = argv.port || process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});