#!/bin/bash

# Exit on any error
set -e

# Check if build directory exists
if [ ! -d "build" ]; then
  echo "Build directory not found. Running build..."
  npm run build
fi

# Serve the app
echo "Starting frontend server on port ${PORT:-3000}..."
npx serve -s build