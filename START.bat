@echo off
REM CropSense - Quick Start Script for Windows
REM This script starts both backend and frontend in separate terminals

echo.
echo ========================================
echo   CropSense - Quick Start
echo ========================================
echo.

REM Check if we're in the correct directory
if not exist "backend" (
    echo ERROR: Please run this script from C:\Users\yaram\Desktop\crop_prediction\
    echo Current directory: %cd%
    pause
    exit /b 1
)

echo [1/4] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    pause
    exit /b 1
)
echo OK: Python found

echo [2/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 14+
    pause
    exit /b 1
)
echo OK: Node.js found

echo.
echo [3/4] Starting Backend (Flask)...
echo Launching Terminal 1: Backend on http://127.0.0.1:5000
start cmd /k "cd backend && venv\Scripts\activate && python app.py"

echo.
echo [4/4] Starting Frontend (React)...
echo Launching Terminal 2: Frontend on http://localhost:5173
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   ✅ CropSense is starting!
echo ========================================
echo.
echo Backend URL:  http://127.0.0.1:5000
echo Frontend URL: http://localhost:5173
echo.
echo Next steps:
echo 1. Wait for both terminals to show "Running on..."
echo 2. Open browser to http://localhost:5173
echo 3. Test weather auto-fill with "Hyderabad"
echo 4. Follow TESTING_GUIDE.md for full test suite
echo.
echo Press any key to close this window...
pause
