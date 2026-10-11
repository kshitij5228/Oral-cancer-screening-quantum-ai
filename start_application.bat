@echo off
title QAI-OLI One-Click Launcher
echo ===================================================
echo   Starting QAI-OLI Full-Stack Platform
echo   Directory: %~dp0website
echo ===================================================
cd /d "%~dp0website"
call start_all.bat
