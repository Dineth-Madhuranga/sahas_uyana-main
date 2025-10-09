const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('\n=== MONGODB CONNECTION FAILED ===');
    console.error('Possible solutions:');
    console.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
    console.error('2. Verify your MongoDB connection string is correct');
    console.error('3. Check if MongoDB Atlas cluster is running');
    console.error('4. Verify network connectivity');
    console.error('\nServer will continue running without database connection...');
    console.error('=======================================\n');
    
    // Don\'t exit the process - let the server run without DB connection
    // This allows the server to start and serve static files/health checks
    // process.exit(1);
  }
};

module.exports = connectDB;
