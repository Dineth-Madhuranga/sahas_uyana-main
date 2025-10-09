@echo off
setlocal

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies
    exit /b %errorlevel%
)

echo Building React app...
npm run build

if %errorlevel% neq 0 (
    echo Build failed! Check the error messages above.
    exit /b %errorlevel%
)

if exist "build\" (
    echo Build successful! The build directory is ready for deployment.
    dir build
) else (
    echo Build failed! Check the error messages above.
    exit /b 1
)

endlocal