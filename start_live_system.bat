@echo off
title QAI-OLI Live Production System Launcher
echo ===================================================
echo   Starting QAI-OLI Live Production System
echo ===================================================
echo.
echo 1. Starting Python FastAPI Inference Engine (Port 8000)...
start "QAI-OLI FastAPI Backend" cmd /k "cd /d "%~dp0website\backend" && python server.py"

echo.
echo 2. Waiting for backend to warm up...
timeout /t 5 /nobreak >nul

echo.
echo 3. Starting Secure Cloudflare Public Tunnel...
start "QAI-OLI Cloudflare Tunnel" cmd /k "cd /d "%~dp0" && .\cloudflared.exe tunnel --url http://127.0.0.1:8000"

echo.
echo 4. Opening Live Vercel Production Website...
timeout /t 3 /nobreak >nul
start https://qai-oli.vercel.app/screening

echo.
echo ===================================================
echo   System is now LIVE!
echo   Vercel URL: https://qai-oli.vercel.app
echo ===================================================
echo Press any key to exit this launcher window...
pause >nul
