@echo off
title QAI-OLI Master Launcher
echo ===================================================
echo   Launching QAI-OLI Full-Stack System
echo   1. Starting Python FastAPI Backend (Port 8000)
echo   2. Starting Next.js Web App (Port 3000)
echo ===================================================
start "QAI-OLI Backend" cmd /k "call "%~dp0start_backend.bat""
timeout /t 3 /nobreak >nul
start "QAI-OLI Frontend" cmd /k "call "%~dp0start_frontend.bat""
echo.
echo Both services launched! 
echo Open your browser at: http://localhost:3000
pause
