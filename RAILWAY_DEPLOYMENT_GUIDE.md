# Complete Railway Deployment Guide for Sahas Uyana

This guide provides step-by-step instructions for deploying both the backend (API server) and frontend (React app) of the Sahas Uyana website on Railway.

## Prerequisites

1. Railway account (https://railway.app)
2. GitHub account with this repository
3. MongoDB Atlas account (or another MongoDB provider)
4. Railway CLI installed (optional but recommended)

## Backend Deployment (API Server)

### 1. Prepare Environment Variables

Before deploying, you need to set the following environment variables in your Railway project:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure secret for JWT tokens
- `ADMIN_USERNAME` - Admin username (default: admin)
- `ADMIN_PASSWORD` - Admin password (default: admin123)
- `ADMIN_EMAIL` - Admin email
- `EMAIL_SERVICE` - Email service (e.g., gmail)
- `EMAIL_USER` - Email username
- `EMAIL_PASSWORD` - Email password
- `EMAIL_FROM` - Email "from" address
- `FRONTEND_URL` - Your frontend URL (once deployed)

### 2. Deploy Using Railway Dashboard

1. Go to https://railway.app/new
2. Select "Deploy from GitHub"
3. Choose this repository
4. Railway will automatically detect this as a Node.js project
5. Go to the "Settings" tab of your new service
6. In the "Environment" section, add all the required environment variables listed above
7. The service will automatically redeploy with the new environment variables

### 3. Deploy Using Railway CLI

```bash
# Login to Railway
railway login

# Initialize new project
railway init

# Deploy
railway up
```

## Frontend Deployment (React App)

### 1. Prepare Environment Variables

For the frontend, you need to set:

- `REACT_APP_API_URL` - The URL of your backend API (the Railway URL for your backend service)

### 2. Deploy Using Railway Dashboard

1. Go to https://railway.app/new
2. Select "Deploy from GitHub"
3. Choose this repository
4. Railway will automatically detect this as a Node.js/React project
5. Go to the "Settings" tab of your new service
6. In the "Environment" section, add the `REACT_APP_API_URL` variable with your backend URL
7. The service will automatically redeploy with the new environment variables

### 3. Deploy Using Railway CLI

```bash
# Login to Railway (if not already logged in)
railway login

# Create a new project for the frontend
railway init

# Deploy
railway up
```

## Configuration Files

This repository includes specific configuration files for Railway deployment:

### Backend Configuration
- `railway.toml` - Configuration for the backend API server

### Frontend Configuration
- `railway-frontend.toml` - Configuration for the React frontend
- `static.json` - Static file serving configuration
- `vercel.json` - Routing configuration (also works with Railway)

## Environment Variables Summary

### Backend Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@sahasuyana.lk
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Sahas Uyana <noreply@sahasuyana.com>
FRONTEND_URL=https://your-frontend-project.up.railway.app
```

### Frontend Variables
```
REACT_APP_API_URL=https://your-backend-project.up.railway.app
PORT=3000
NODE_ENV=production
```

## Custom Domains

After deployment, you can add custom domains through the Railway dashboard:

1. Go to your Railway project
2. Click on your service
3. Go to the "Settings" tab
4. Scroll to "Custom Domain"
5. Add your domain and follow the instructions

## Troubleshooting

### Common Backend Issues

1. **Database Connection Failed**
   - Check that `MONGODB_URI` is set correctly
   - Verify your MongoDB Atlas IP whitelist includes Railway's IP addresses
   - Ensure your MongoDB cluster is running

2. **Environment Variables Not Set**
   - Double-check all required environment variables are set in Railway
   - Restart the service after setting variables

3. **Health Check Failures**
   - Check the `/api/health` endpoint to verify the service is running
   - Review logs for any error messages

### Common Frontend Issues

1. **Blank Page or 404 Errors**
   - Ensure `REACT_APP_API_URL` is set to the correct backend URL
   - Check that routing configuration in `vercel.json` is correct
   - Verify the build completed successfully

2. **API Calls Failing**
   - Check browser console for CORS errors
   - Verify the backend URL is accessible
   - Confirm CORS is properly configured on the backend

3. **Environment Variables Not Working**
   - Remember that React only exposes variables prefixed with `REACT_APP_`
   - Restart the frontend service after changing environment variables

## Monitoring and Logs

- Use the Railway dashboard to monitor service health
- Check logs for both services regularly
- Set up alerts for downtime or performance issues
- Monitor MongoDB usage and performance

## Updating the Application

To update either the frontend or backend:

1. Push changes to your GitHub repository
2. Railway will automatically detect the changes and redeploy
3. Or manually trigger a deploy using `railway up` with the Railway CLI

## Security Considerations

1. Change default admin credentials in production
2. Use strong, unique passwords for all services
3. Rotate secrets and keys regularly
4. Restrict MongoDB Atlas IP access to only necessary addresses
5. Use application-specific passwords for email services
6. Enable two-factor authentication on all accounts