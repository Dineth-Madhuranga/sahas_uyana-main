# API Migration to Relative Paths - Summary

## Overview
Successfully migrated all API calls from hardcoded `http://localhost:5000` URLs to relative paths using a centralized configuration system.

## Changes Made

### 1. Created API Configuration File
**File:** `src/config/api.js`
- Centralized API base URL configuration
- Uses environment variable `REACT_APP_API_URL` or defaults to `/api`
- Works seamlessly in both development and production

### 2. Updated Environment Configuration
**File:** `.env`
- Added `REACT_APP_API_URL=` (empty for relative paths)
- Allows easy configuration for different environments

### 3. Added Proxy Configuration
**File:** `package.json`
- Added `"proxy": "http://localhost:5000"`
- Enables development server to proxy API requests to backend

### 4. Updated Frontend Files

#### Pages Updated:
1. **Venues.js** ✅
   - Imported `API_BASE_URL`
   - Replaced all `http://localhost:5000/api/` with `${API_BASE_URL}/`
   - Updated endpoints:
     - `/bookings`
     - `/bookings/vendor-stalls/availability`
     - `/bookings/vendor-stalls/booked`
     - `/bookings/availability`

2. **AdminDashboard.js** ✅
   - Imported `API_BASE_URL`
   - Replaced all localhost URLs with relative paths
   - Updated endpoints:
     - `/admin/profile`
     - `/admin/admins`
     - `/admin/create-initial-admin`
     - `/admin/change-password`
     - `/bookings`
     - `/bookings/{id}/status`
     - `/bookings/{id}`
     - `/bookings/admin-block`
     - `/bookings/admin-block-test`
     - `/news`
     - `/news/{id}`

3. **AdminLogin.js** ✅
   - Imported `API_BASE_URL`
   - Updated `/admin/login` endpoint

4. **Contact.js** ✅
   - Imported `API_BASE_URL`
   - Updated `/contact` endpoint

5. **News.js** ✅
   - Imported `API_BASE_URL`
   - Updated `/news` endpoint

#### Components Updated:
1. **VendorStallAdmin.js** ✅
   - Imported `API_BASE_URL`
   - Updated endpoints:
     - `/bookings/admin/vendor-stalls`
     - `/bookings/vendor-stalls/test`
     - `/bookings/admin/vendor-stalls/book`

## How It Works

### Development Mode
1. React app runs on `http://localhost:3000`
2. API requests use relative paths (e.g., `/api/bookings`)
3. Proxy in `package.json` forwards requests to `http://localhost:5000`
4. Backend receives requests as if they came directly

### Production Mode
1. Build the React app: `npm run build`
2. Serve static files from the same domain as the API
3. Relative paths work automatically
4. No CORS issues since same origin

## Environment Variables

### Development (.env)
```
REACT_APP_API_URL=
```
Leave empty to use relative paths with proxy

### Production (.env.production)
```
REACT_APP_API_URL=https://yourdomain.com/api
```
Or leave empty if API is on same domain

## Benefits

✅ **No hardcoded URLs** - Easy to change environments
✅ **Works in development** - Proxy handles localhost differences
✅ **Production ready** - Relative paths work on any domain
✅ **No CORS issues** - Same-origin requests
✅ **Centralized config** - Single place to manage API URL
✅ **Environment flexible** - Easy to switch between dev/staging/prod

## Testing

### To test in development:
1. Start backend: `npm run server` (in root)
2. Start frontend: `npm start` (in root)
3. All API calls should work through proxy

### To test production build:
1. Build: `npm run build`
2. Serve with backend or static server
3. API calls use relative paths

## Files Modified

### Created:
- `src/config/api.js`
- `API_MIGRATION_SUMMARY.md` (this file)

### Modified:
- `.env`
- `package.json`
- `src/pages/Venues.js`
- `src/pages/AdminDashboard.js`
- `src/pages/AdminLogin.js`
- `src/pages/Contact.js`
- `src/pages/News.js`
- `src/components/VendorStallAdmin.js`

## Next Steps

1. **Test all functionality** in development mode
2. **Create production build** and test
3. **Deploy** to production server
4. **Update environment variables** for production if needed

## Rollback (if needed)

To rollback, simply replace `${API_BASE_URL}/` with `http://localhost:5000/api/` in all files and remove the proxy from package.json.
