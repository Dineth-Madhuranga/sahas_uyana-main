const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Check if default admin exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('Default admin user already exists');
      return;
    }

    // Create default admin user
    const defaultAdmin = new Admin({
      username: 'admin',
      email: 'admin@sahasuyana.lk',
      password: 'admin123',
      role: 'super_admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    await defaultAdmin.save();
    console.log('Default admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@sahasuyana.lk');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit(0);
  }
};

// Run initialization
initializeDatabase();