@echo off
title ApexMart Storefront + Backend + Traffic System
echo ===============================================================================
echo                APEXMART OBSIDIAN DARK AMAZON STOREFRONT
echo ===============================================================================
echo [1/3] Checking Node.js environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH! Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Installing Dependencies if needed...
if not exist "backend\node_modules" (
    echo Installing Backend dependencies...
    cd backend && call npm install && cd ..
)
if not exist "frontend\node_modules" (
    echo Installing Frontend dependencies...
    cd frontend && call npm install && cd ..
)

echo [3/3] Launching Backend and Frontend in separate windows...
start "ApexMart Fastify Backend + Supabase" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul
start "ApexMart React Storefront" cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================================================
echo ALL SYSTEMS ACTIVE!
echo - Storefront:   http://localhost:3000
echo - Fastify API:  http://localhost:5000
echo - Auto-Idle Traffic Detector: ACTIVE (sends virtual shopper requests when idle > 6s)
echo ===============================================================================
echo.
pause
