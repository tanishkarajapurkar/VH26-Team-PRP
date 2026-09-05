@echo off
title ApexMart Flash Sale Surge Simulator
echo ===============================================================================
echo                APEXMART FLASH SALE SURGE SIMULATOR
echo ===============================================================================
echo Simulating high-concurrency traffic spike on spotlight products...
echo Ensure the backend is running at http://localhost:5000
echo.
cd backend
call npm run surge
pause
