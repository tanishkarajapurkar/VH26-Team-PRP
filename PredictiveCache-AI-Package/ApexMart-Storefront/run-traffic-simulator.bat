@echo off
title ApexMart Autonomous Traffic Simulator
echo ===============================================================================
echo                APEXMART AUTONOMOUS TRAFFIC SIMULATOR
echo ===============================================================================
echo Generating multi-user browsing, search, cart, and checkout activity...
echo Ensure the backend is running at http://localhost:5000
echo.
cd backend
call npm run simulate
pause
