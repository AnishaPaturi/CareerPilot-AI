@echo off
REM Start AI Services Backend
cd /d "%~dp0ai-services"
python -m uvicorn app.main:app --port 8000 --host 0.0.0.0