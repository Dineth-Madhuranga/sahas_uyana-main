# Sahas Uyana Deployment Guide

This guide will help you deploy your Sahas Uyana application to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway account (for backend)
- MongoDB Atlas account (already configured)

## 🚂 Step 1: Deploy Backend to Railway

### 1.1 Create a Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub or email
3. Verify your email address

### 1.2 Create New Project
1. Click **"New Project"** in Railway dashboard
2. Choose **"Deploy from GitHub repo"**
3. Connect and authorize your GitHub account
4. Select your `sahas-uyana` repository

### 1.3 Configure Railway Settings
Railway will auto-detect settings, but verify these are correct:

**Service Configuration:**
- **Root Directory**: Leave empty (Railway will use `railway.toml`)
- **Build Command**: Should auto-detect from `railway.toml`
- **Start Command**: Should auto-detect from `railway.toml`

**Railway.toml Configuration Created:**
```toml
[build]
builder = "nixpacks"

[build.buildCommand]
"npm install"

[deploy]
startCommand = "cd server && npm start"

[[services]]
name = "api"
rootDir = "server"
buildCommand = "npm install"
startCommand = "npm start"
healthcheckPath = "/api/health"
```

### 1.4 Set Environment Variables in Railway
Go to your deployed service → **"Variables"** tab and add these variables:

```bash
# Database
MONGODB_URI=mongodb+srv://sahas:sahasuyana@sahasuyana01.q2trcxy.mongodb.net/?retryWrites=true&w=majority&appName=Sahasuyana01

# Authentication
JWT_SECRET=your-super-secret-jwt-key-sahas-uyana-2024

# Server Configuration
PORT=5000
NODE_ENV=production

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@sahasuyana.lk

# Email Configuration (Gmail App Password)
EMAIL_SERVICE=gmail
EMAIL_USER=sahasuyana@gmail.com
EMAIL_PASSWORD=qcah cfwz jzrb tdnm

# CORS Configuration
FRONTEND_URL=https://your-app.vercel.app
```

**Important**: Replace `FRONTEND_URL` with your actual Vercel URL after deploying frontend.

### 1.5 Deploy and Get Backend URL
1. Click **"Deploy"** button
2. Railway will start building and deploying your backend
3. Wait for the build to complete (usually 2-5 minutes)
4. After successful deployment, Railway provides a URL like:
   ```
   https://sahas-uyana-api-production.up.railway.app
   ```

**Save this URL** - you'll need it for frontend deployment!

### 1.6 Monitor Deployment
- Check **"Deployments"** tab for build logs
- Use **"Logs"** tab to monitor runtime logs
- Railway automatically redeploys when you push to main branch

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 2.2 Deploy Frontend
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2.3 Set Environment Variables in Vercel
Go to "Settings" → "Environment Variables" and add:

**Variable Name**: `REACT_APP_API_URL`  
**Value**: `https://sahas-uyana-api-production.up.railway.app` (your Railway backend URL)  
**Environment**: Production, Preview, Development (select all)

### 2.4 Deploy
Click "Deploy" and wait for deployment to complete.

### 2.5 Get Your Frontend URL
Vercel will give you a URL like:
`https://sahas-uyana.vercel.app`

---

## 🔄 Step 3: Update CORS Configuration

### 3.1 Update Backend CORS
1. Go back to Railway dashboard
2. Go to "Variables" tab
3. Update `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL=https://sahas-uyana.vercel.app
   ```
4. Click "Save"
5. Railway will automatically redeploy

---

## ✅ Step 4: Test Your Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL
2. Navigate through all pages
3. Check if images and content load

### 4.2 Test Backend Connection
1. Try submitting a contact form
2. Try viewing news items
3. Try making a booking

### 4.3 Test Admin Dashboard
1. Go to `/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Test all admin features

---

## 🔧 Troubleshooting

### Issue: Railway Build Failures
**Solution**: 
- Railway uses Nixpacks build system
- Ensure `railway.toml` is in your repository root
- Check build logs in Railway dashboard
- Verify all backend dependencies are in `server/package.json`

### Issue: "Failed to fetch" errors
**Solution**: 
- Check if Railway backend is running (visit backend URL/api/health)
- Verify REACT_APP_API_URL in Vercel settings
- Check CORS configuration in backend

### Issue: CORS errors
**Solution**:
- Ensure FRONTEND_URL in Railway matches your Vercel URL exactly
- Redeploy Railway service after updating FRONTEND_URL

### Issue: Environment variables not working
**Solution**:
- Redeploy Railway service after adding environment variables
- Ensure variable names are correct
- Check for typos in variable names

---

## 📝 Environment Variables Summary

### Frontend (Vercel Dashboard)
```
REACT_APP_API_URL=https://sahas-uyana-api-production.up.railway.app
```

### Backend (Railway Dashboard)
```
MONGODB_URI=mongodb+srv://sahas:sahasuyana@sahasuyana01.q2trcxy.mongodb.net/?retryWrites=true&w=majority&appName=Sahasuyana01
JWT_SECRET=your-super-secret-jwt-key-sahas-uyana-2024
PORT=5000
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@sahasuyana.lk
EMAIL_SERVICE=gmail
EMAIL_USER=sahasuyana@gmail.com
EMAIL_PASSWORD=qcah cfwz jzrb tdnm
FRONTEND_URL=https://sahas-uyana.vercel.app
```

---

## 🎉 Success!

Your Sahas Uyana application should now be live!

- **Frontend**: https://sahas-uyana.vercel.app
- **Backend**: https://sahas-uyana-api-production.up.railway.app
- **Admin**: https://sahas-uyana.vercel.app/admin/login

Remember to:
- Change default passwords
- Monitor application logs
- Keep dependencies updated
- Backup your database regularly
