# Sahas Uyana Website

A modern, responsive website for Sahas Uyana - a cultural and leisure venue in Kandy, Sri Lanka. Built with React frontend and Node.js/Express backend with MongoDB database.

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Multiple Pages**: Home, Venues, Helabojun (Restaurant), News, Our Story, Director's Office, Contact
- **Admin Dashboard**: Complete admin panel for managing bookings and news
- **Booking System**: Online venue booking with real-time availability
- **News Management**: Dynamic news and updates system

### Backend
- **RESTful API**: Express.js server with MongoDB
- **Authentication**: JWT-based admin authentication
- **Data Models**: Bookings, News, Admin management
- **Security**: Password hashing, input validation, CORS protection

### Venues
1. **Open Air Arena** - Rs. 1,250,000 per day
   - Includes electricity, changing rooms, 800 chairs, 26x26 metal stage
   - Perfect for musical shows, political gatherings, concerts, meetings, exhibitions, fairs, classes

2. **Exhibition & Fairs Area** - Rs. 150,000 per day
   - 100 vendor stalls (6x4 size each)
   - Monthly rental: Rs. 30,000 per stall
   - Ideal for trade exhibitions, craft fairs, food festivals

3. **Kids Park** - Free of Charge
   - Safe play equipment and supervised activities
   - Perfect for children's events and family gatherings

### Additional Features
- **EV Charging Station**: 24/7 electric vehicle charging
- **Helabojun Restaurant**: Traditional Sri Lankan cuisine
- **Cultural Events**: Regular cultural festivals and exhibitions
- **Admin Panel**: Complete management system for bookings and content

## Technology Stack

### Frontend
- React 18
- React Router DOM
- CSS3 with modern features
- Responsive design principles

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sahas-uyana-website
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup

#### Frontend Environment Variables
Create a `.env.local` file in the root directory:
```env
PORT=3000
BROWSER=none
REACT_APP_API_URL=http://localhost:5000
```

#### Backend Environment Variables
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/sahas-uyana
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 5. Run the Application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```

#### Or run separately:

**Backend Server:**
```bash
npm run server
```

**Frontend Development Server:**
```bash
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

### 7. Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## Project Structure

```
sahas-uyana-website/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── Venues.js
│   │   ├── Venues.css
│   │   ├── Helabojun.js
│   │   ├── Helabojun.css
│   │   ├── News.js
│   │   ├── News.css
│   │   ├── OurStory.js
│   │   ├── OurStory.css
│   │   ├── DirectorsOffice.js
│   │   ├── DirectorsOffice.css
│   │   ├── Contact.js
│   │   ├── Contact.css
│   │   ├── AdminLogin.js
│   │   ├── AdminLogin.css
│   │   ├── AdminDashboard.js
│   │   └── AdminDashboard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── server/
│   ├── models/
│   │   ├── Booking.js
│   │   ├── News.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── bookings.js
│   │   ├── news.js
│   │   └── admin.js
│   ├── config/
│   │   └── database.js
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/stats/overview` - Get booking statistics

### News
- `GET /api/news` - Get all news items
- `GET /api/news/published` - Get published news (public)
- `POST /api/news` - Create news item
- `GET /api/news/:id` - Get news item by ID
- `PUT /api/news/:id` - Update news item
- `PATCH /api/news/:id/status` - Update news status
- `DELETE /api/news/:id` - Delete news item

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile
- `PUT /api/admin/change-password` - Change password
- `GET /api/admin/verify` - Verify token

## Deployment

**📚 For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

### Quick Deployment Summary

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com`
4. Deploy

#### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set all environment variables (see DEPLOYMENT_GUIDE.md)
4. Deploy

#### Important Environment Variables

**Frontend (Vercel):**
- `REACT_APP_API_URL` - Your backend API URL

**Backend (Render/Railway):**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT
- `FRONTEND_URL` - Your Vercel frontend URL (for CORS)
- `EMAIL_USER` & `EMAIL_PASSWORD` - Email credentials
- All other variables from `.env.example`

### Database
- Use MongoDB Atlas for cloud database
- Set up proper security and access controls
- Regular backups recommended

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: info@sahasuyana.lk
- Phone: +94 81 234 5678

## Acknowledgments

- Design inspiration from modern cultural venues
- Sri Lankan cultural heritage preservation
- Community engagement and sustainability focus
