# CropSense - Quick Start Script for PowerShell
# Run this script from: C:\Users\yaram\Desktop\crop_prediction\

Write-Host ""
Write-Host "========================================"
Write-Host "  CropSense - Quick Start"
Write-Host "========================================"
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend")) {
    Write-Host "ERROR: Please run this script from C:\Users\yaram\Desktop\crop_prediction\" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)"
    Read-Host "Press Enter to exit"
    exit
}

# Check Python
Write-Host "[1/4] Checking Python..."
try {
    $pythonVersion = python --version 2>&1
    Write-Host "OK: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python not found. Please install Python 3.8+" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Check Node.js
Write-Host "[2/4] Checking Node.js..."
try {
    $nodeVersion = node --version 2>&1
    Write-Host "OK: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found. Please install Node.js 14+" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "[3/4] Starting Backend (Flask)..."
Write-Host "Launching Backend on http://127.0.0.1:5000" -ForegroundColor Cyan

# Open new PowerShell window for backend
Start-Process powershell -ArgumentList @(
    "-NoExit"
    "-Command", "cd 'C:\Users\yaram\Desktop\crop_prediction\backend'; .\venv\Scripts\Activate.ps1; python app.py"
)

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "[4/4] Starting Frontend (React)..."
Write-Host "Launching Frontend on http://localhost:5173" -ForegroundColor Cyan

# Open new PowerShell window for frontend
Start-Process powershell -ArgumentList @(
    "-NoExit"
    "-Command", "cd 'C:\Users\yaram\Desktop\crop_prediction\frontend'; npm run dev"
)

Write-Host ""
Write-Host "========================================"
Write-Host "  ✅ CropSense is starting!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Backend URL:  http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait for both terminals to show 'Running on...'"
Write-Host "2. Open browser to http://localhost:5173"
Write-Host "3. Test weather auto-fill with 'Hyderabad'"
Write-Host "4. Follow TESTING_GUIDE.md for full test suite"
Write-Host ""
