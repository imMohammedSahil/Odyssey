@echo off
title Odyssey Launcher
echo [1/2] Starting Backend on http://localhost:5000...
start "Odyssey Backend" cmd /k "cd /d %~dp0backend && node server.js"

echo [2/2] Starting Frontend on http://localhost:3000...
start "Odyssey Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo Both services launched in separate windows!

