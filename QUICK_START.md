# ⚡ Quick Start Guide

## Local Development Setup (5 Minutes)

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Variables

#### Frontend (.env.local) - Already configured ✅
```env
PORT=3000
BROWSER=none
REACT_APP_API_URL=http://localhost:5000
```

#### Backend (.env) - Already configured ✅
Your backend `.env` file is already set up with:
- MongoDB Atlas connection
- Email configuration
- Admin credentials
- All necessary variables

### 3. Start the Application

#### Option A: Run Both (Recommended)
```bash
npm run dev
```

#### Option B: Run Separately
Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

### 5. Admin Login
- **Username**: `admin`
- **Password**: `admin123`

---

## 🚀 Production Deployment (15 Minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend to Render
1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Settings:
   - Build: `cd server && npm install`
   - Start: `cd server && node index.js`
4. Add environment variables from `.env`
5. Deploy → Copy backend URL

### Step 3: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Add environment variable:
   - `REACT_APP_API_URL` = Your Render backend URL
4. Deploy → Copy frontend URL

### Step 4: Update CORS
1. In Render, add environment variable:
   - `FRONTEND_URL` = Your Vercel frontend URL
2. Save (auto-redeploys)

### Done! 🎉
Your app is now live and accessible from anywhere!

---

## 📁 Project Structure

```
sahas_uyana/
├── src/                          # Frontend React app
│   ├── config/
│   │   └── api.js               # ✨ NEW: API configuration
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── VendorStallAdmin.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Venues.js
│   │   ├── AdminDashboard.js
│   │   └── ...
│   └── App.js
├── server/                       # Backend Node.js/Express
│   ├── models/
│   │   ├── Booking.js
│   │   ├── News.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── bookings.js
│   │   ├── news.js
│   │   └── admin.js
│   └── index.js
├── .env.local                    # ✨ Frontend environment variables
├── .env.example                  # ✨ NEW: Frontend env template
├── server/.env                   # Backend environment variables
├── server/.env.example           # ✨ NEW: Backend env template
├── vercel.json                   # ✨ NEW: Vercel config
├── DEPLOYMENT_GUIDE.md           # ✨ NEW: Full deployment guide
├── DEPLOYMENT_SUMMARY.md         # ✨ NEW: Quick deployment summary
└── README.md                     # Updated with deployment info
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev          # Run both frontend and backend
npm start            # Run frontend only
npm run server       # Run backend only
```

### Production
```bash
npm run build        # Build frontend for production
npm run server:prod  # Run backend in production mode
```

### Testing
```bash
# Test backend API
curl http://localhost:5000/api/health

# Test frontend
# Open http://localhost:3000 in browser
```

---

## 🐛 Troubleshooting

### Backend won't start
**Error**: "MongoDB connection failed"  
**Fix**: Check MongoDB Atlas connection string in `.env`

### Frontend can't connect to backend
**Error**: "Failed to fetch"  
**Fix**: Ensure backend is running on port 5000

### CORS errors in browser
**Fix**: Check `FRONTEND_URL` in backend `.env` matches your frontend URL

### Port already in use
**Fix**: 
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

---

## 📚 Documentation

- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Deployment Summary**: `DEPLOYMENT_SUMMARY.md`
- **Project README**: `README.md`
- **API Documentation**: See README.md → API Endpoints section

---

## ✅ Checklist

### Before Deployment
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] App runs locally without errors
- [ ] Admin login works
- [ ] Booking system works
- [ ] News system works

### After Deployment
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both platforms
- [ ] CORS configured correctly
- [ ] Test all features on production URL
- [ ] Change default admin password

---

## 🎯 What's New?

### API Configuration System
All API calls now use environment variables instead of hardcoded URLs:

**Before** (❌ Won't work in production):
```javascript
fetch('http://localhost:5000/api/bookings')
```

**After** (✅ Works everywhere):
```javascript
import API_BASE_URL from '../config/api';
fetch(`${API_BASE_URL}/api/bookings`)
```

### Files Updated
- 31 API calls updated across 6 files
- Centralized API configuration
- Environment-based URL management
- Production-ready CORS setup

---

## 🚀 Ready to Go!

Your application is now:
- ✅ Fully configured for local development
- ✅ Ready for production deployment
- ✅ Using environment variables correctly
- ✅ CORS configured for security
- ✅ Documented and maintainable

**Start developing**: `npm run dev`  
**Deploy to production**: Follow `DEPLOYMENT_GUIDE.md`

Happy coding! 🎉
