#!/bin/bash
# Start AI Services Backend
cd "$(dirname "$0")/ai-services"
uvicorn app.main:app --port 8000 --host 0.0.0.0