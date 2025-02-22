require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const capsuleRoutes = require('./routes/capsuleRoutes');
const myCapsuleRoutes=require("./routes/myCapsuleRoutes")
const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/capsule', capsuleRoutes);
app.use('/api/mycapsule', myCapsuleRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
