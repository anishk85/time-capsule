require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const capsuleRoutes = require('./routes/capsuleRoutes');
const myCapsuleRoutes = require('./routes/myCapsuleRoutes');
const videoRoutes = require('./routes/videoRoutes'); // Import the video routes

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin: ["https://time-capsule-gray.vercel.app", "https://time-capsule-404.netlify.app"], // Allow frontend URLs
      credentials: true, // If using cookies or authentication
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/capsule', capsuleRoutes);
app.use('/api/mycapsule', myCapsuleRoutes);
app.use('/api/videos', videoRoutes); // Use the video routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));