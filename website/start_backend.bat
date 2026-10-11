@echo off
title QAI-OLI Python FastAPI Backend Server
cd /d "%~dp0backend"
echo ===================================================
echo   Starting QAI-OLI Clinical Inference Engine
echo   API running on: http://127.0.0.1:8000
echo ===================================================
python server.py
pause
