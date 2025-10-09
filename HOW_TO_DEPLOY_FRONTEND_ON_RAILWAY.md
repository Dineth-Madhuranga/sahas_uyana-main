# How to Deploy Sahas Uyana Frontend on Railway - Step by Step Guide

This guide provides exact step-by-step instructions for deploying the Sahas Uyana frontend on Railway.

## Prerequisites

1. You have already deployed the backend API on Railway
2. You have the backend API URL (e.g., https://your-backend-project.up.railway.app)
3. You have a Railway account
4. You have this GitHub repository ready

## Step-by-Step Deployment Instructions

### Step 1: Get Your Backend API URL

1. Go to your Railway dashboard
2. Find your backend service
3. Copy the default Railway URL (it will look like https://your-project-name.up.railway.app)
4. This is your `REACT_APP_API_URL` for the frontend

### Step 2: Create New Railway Project for Frontend

1. Go to https://railway.app/new
2. Click "Deploy from GitHub"
3. Select your Sahas Uyana repository
4. Railway will start building automatically

### Step 3: Set Environment Variables

1. While the initial build is running, click on your new service
2. Go to the "Settings" tab
3. Click on "Environment" in the left sidebar
4. Click "Add Variable" and add:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend API URL (from Step 1)
5. Click "Add Variable" to save

### Step 4: Redeploy with Environment Variables

1. Railway will automatically redeploy with the new environment variables
2. Wait for the deployment to complete
3. The build process will:
   - Install all dependencies
   - Build the React application
   - Serve the built files

### Step 5: Verify Deployment

1. Once deployment is complete, click on your service
2. Go to the "Deployments" tab
3. Click on the latest deployment
4. When successful, you'll see "Deployment Status: Success"
5. Click the "Visit" button to view your live frontend

## Troubleshooting Common Issues

### Issue 1: Build Fails

**Symptoms**: Deployment shows "Failed" status
**Solution**:
1. Check the deployment logs for specific error messages
2. Ensure all dependencies in package.json are correct
3. Verify the build command works locally by running `npm run build`

### Issue 2: Blank Page or 404 Errors

**Symptoms**: Site loads but shows blank page or 404 errors
**Solution**:
1. Verify `REACT_APP_API_URL` is set correctly
2. Check that the routing configuration in vercel.json is correct
3. Ensure the build directory is being served properly

### Issue 3: API Calls Not Working

**Symptoms**: Site loads but data doesn't appear or forms don't work
**Solution**:
1. Check browser console for CORS errors
2. Verify the backend API URL is accessible
3. Confirm CORS is properly configured on the backend

### Issue 4: Environment Variables Not Working

**Symptoms**: Configuration values don't seem to take effect
**Solution**:
1. Remember that React only exposes variables prefixed with `REACT_APP_`
2. Restart the frontend service after changing environment variables
3. Check that variable names are exactly correct

## Deployment Verification Checklist

□ Backend is deployed and running
□ Backend URL is copied
□ New Railway project created from GitHub
□ `REACT_APP_API_URL` environment variable set
□ Deployment completed successfully
□ Frontend loads in browser
□ Navigation works correctly
□ API calls are successful
□ All pages display properly

## Monitoring Your Deployment

1. Check Railway dashboard for service health
2. Monitor logs for any errors
3. Set up alerts for downtime
4. Regularly check MongoDB connection and performance

## Updating Your Frontend

To update your frontend after making changes:

1. Push changes to your GitHub repository
2. Railway will automatically detect changes and redeploy
3. Or manually trigger deployment through Railway dashboard

## Custom Domain Setup (Optional)

To use a custom domain:

1. In Railway dashboard, go to your frontend service
2. Click "Settings" tab
3. Scroll to "Custom Domain" section
4. Click "Add Domain"
5. Enter your domain name
6. Follow Railway's DNS configuration instructions

## Support

If you continue to experience issues:

1. Check the detailed logs in Railway dashboard
2. Verify all configuration files are correct
3. Ensure environment variables are set properly
4. Contact Railway support if the issue is with the platform
5. Check the project documentation for additional troubleshooting steps