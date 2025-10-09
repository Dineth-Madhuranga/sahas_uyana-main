#!/bin/bash

# Exit on any error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
  echo "Build successful! The build directory is ready for deployment."
  ls -la build
else
  echo "Build failed! Check the error messages above."
  exit 1
fi