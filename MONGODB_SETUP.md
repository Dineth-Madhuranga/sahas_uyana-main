# MongoDB Atlas Setup Instructions

## Current Issue
Your server was crashing because it couldn't connect to MongoDB Atlas. The server has been fixed to handle this gracefully, but you still need to properly configure your database connection.

## Quick Fix Options

### Option 1: Fix MongoDB Atlas Connection (Recommended)

1. **Visit MongoDB Atlas**: Go to https://cloud.mongodb.com/
2. **Login** to your MongoDB Atlas account
3. **Navigate to Network Access**:
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Add Current IP Address" to whitelist your current IP
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) for development

4. **Verify Database User**:
   - Go to "Database Access" 
   - Make sure user "sahas" exists with proper permissions
   - If not, create a new user with read/write permissions

5. **Test Connection**:
   - Restart your server: `npm run server`
   - Check health endpoint: visit http://localhost:5000/api/health
   - Database status should show "Connected"

### Option 2: Use Local MongoDB (Development Only)

1. **Install MongoDB locally**:
   - Download from https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

2. **Update .env file**:
   ```
   MONGODB_URI=mongodb://localhost:27017/sahas-uyana
   ```

3. **Restart server**: `npm run server`

## Current Status

✅ **Server Fixed**: No longer crashes when database is unavailable
✅ **Health Endpoint**: Working at http://localhost:5000/api/health  
⚠️ **Database**: Currently disconnected - API routes will return 503 errors
✅ **Static Files**: Will serve React app when built

## Testing

After fixing the database connection, test these endpoints:
- Health: `GET http://localhost:5000/api/health`
- Bookings: `GET http://localhost:5000/api/bookings`
- News: `GET http://localhost:5000/api/news`
- Admin: `POST http://localhost:5000/api/admin/login`

## Notes

- The server will continue running even if MongoDB is unavailable
- API routes requiring database will return 503 errors until connection is restored
- The health endpoint shows current database connection status