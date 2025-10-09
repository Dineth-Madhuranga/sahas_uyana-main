# Railway Frontend Deployment Guide

This guide explains how to deploy the Sahas Uyana frontend React application on Railway.

## Prerequisites

1. Railway account
2. Backend API deployed and running (should already be done)
3. Railway CLI installed (optional but recommended)

## Deployment Steps

### 1. Prepare Environment Variables

Before deploying, you need to set the following environment variables in your Railway project:

- `REACT_APP_API_URL` - The URL of your backend API (e.g., https://your-backend-project.up.railway.app)

### 2. Build Configuration

Railway will automatically detect this as a Node.js project and use the build command specified in package.json.

### 3. Deploy Using Railway CLI

```bash
# Login to Railway
railway login

# Initialize new project
railway init

# Deploy
railway up
```

### 4. Deploy Using Railway Dashboard

1. Go to https://railway.app/new
2. Select "Deploy from GitHub" or "Deploy from folder"
3. Choose this repository/directory
4. Railway will automatically detect the project type
5. Add environment variables in the dashboard:
   - `REACT_APP_API_URL` = your backend API URL
6. Deploy

## Configuration Files

- `railway-frontend.toml` - Railway deployment configuration
- `static.json` - Static file serving configuration
- `vercel.json` - Routing configuration (also works with Railway)

## Environment Variables

Set these in your Railway project settings:

```
REACT_APP_API_URL=https://your-backend-url.up.railway.app
```

## Custom Domain (Optional)

After deployment, you can add a custom domain through the Railway dashboard:

1. Go to your Railway project
2. Click on your frontend service
3. Go to the "Settings" tab
4. Scroll to "Custom Domain"
5. Add your domain and follow the instructions

## Troubleshooting

### Build Failures

If the build fails, check:

1. All dependencies are properly installed
2. Environment variables are set correctly
3. The build command in package.json works locally

### Application Not Loading

If the application deploys but doesn't load:

1. Check that `REACT_APP_API_URL` is set correctly
2. Verify the backend API is accessible
3. Check browser console for errors
4. Ensure all routes are properly configured in `vercel.json`

## Notes

- The frontend is a static React application
- It uses `serve` to serve the built files
- All API calls are made to the backend URL specified in `REACT_APP_API_URL`
- The application is configured to work with client-side routing