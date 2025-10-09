@echo off
setlocal

REM Check if build directory exists
if not exist "build\" (
    echo Build directory not found. Running build...
    npm run build
    if %errorlevel% neq 0 (
        echo Build failed!
        exit /b %errorlevel%
    )
)

echo Starting frontend server on port %PORT:-3000%...
npx serve -s build

endlocal