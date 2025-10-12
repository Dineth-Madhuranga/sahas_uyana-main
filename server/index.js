const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      'https://sahas-uyana.vercel.app',
      'https://sahas-uyana-git-main-dilsha-weerasinghes-projects.vercel.app',
      'https://sahasuyana-main-production-05fe.up.railway.app'
    ].filter(Boolean); // Remove undefined values
    
    // Also allow any Vercel preview deployments and Railway deployments
    const isVercelPreview = origin && origin.includes('sahas-uyana') && origin.includes('.vercel.app');
    const isRailwayDeployment = origin && origin.includes('.railway.app');
    
    if (allowedOrigins.indexOf(origin) !== -1 || isVercelPreview || isRailwayDeployment) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection status middleware for API routes
app.use('/api', (req, res, next) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1 && req.path !== '/health') {
    return res.status(503).json({
      message: 'Database connection unavailable',
      error: 'Please check MongoDB connection and try again later'
    });
  }
  next();
});

// Import routes
const bookingRoutes = require('./routes/bookings');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

// Use routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Serve static files from React app in production (only if build directory exists)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../build');
  const fs = require('fs');

  // Check if build directory exists before serving static files
  if (fs.existsSync(buildPath)) {
    console.log('Serving React frontend from build directory');
    app.use(express.static(buildPath));

    // Catch-all handler for React app (only when build directory exists)
    app.get('*', (req, res) => {
      // Skip API routes - let them fall through to 404 handler
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API route not found' });
      }
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    console.log('Build directory not found - running as backend-only server');
    // Add catch-all handler for non-API routes when no build directory
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'Route not found' });
      }
      // Let API routes pass through to normal 404 handler
    });
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.json({ 
    status: 'OK', 
    message: 'Sahas Uyana API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// 404 handler for non-API routes (only when not in production or build directory doesn't exist)
if (process.env.NODE_ENV !== 'production') {
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Promise Rejection:', err.message);
  // Don\'t exit the process - log the error and continue
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});
