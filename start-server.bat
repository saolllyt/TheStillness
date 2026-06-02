@echo off
chcp 65001 > nul
title TheStillness - Backend Server
cd /d C:\Users\mvant\TheStillness\server

echo Starting backend server on port 3001...
npm run dev

echo.
echo === Server stopped. Press any key to close ===
pause > nul
