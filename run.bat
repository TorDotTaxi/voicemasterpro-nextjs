@echo off
REM VoiceMaster Pro Next.js - Quick Start Script

echo =========================================
echo    VoiceMaster Pro - Next.js
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo OK Node.js version:
node --version
echo OK npm version:
npm --version
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ! .env.local file not found!
    echo The file should be created with API keys.
    echo.
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting development server...
echo.
echo =========================================
echo    App will open at:
echo    http://localhost:3000
echo.
echo    Press Ctrl+C to stop
echo =========================================
echo.

npm run dev

pause

