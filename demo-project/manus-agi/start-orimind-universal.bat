@echo off
REM 🌍 OriMind Universal Startup Script for Windows
REM Automatically detected: Windows x86_64

echo 🚀 Starting OriMind Universal Ecosystem on Windows...
echo Platform: Windows x86_64
echo Package Manager: pnpm

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies with pnpm...
    pnpm install
)

REM Start services in background
echo 🌊 Starting Chi Flow Platform...
start /B node guarded-chi-flow-platform.js

echo 🔍 Starting Sherlock Omega IDE...
start /B node sherlock-omega/index.js

echo 🤖 Starting ReliaKit AI Dashboard...
start /B node reliakit-dashboard/index.js

echo 📡 Starting MCP Recipe Server...
start /B pnpm run start --prefix mcp-recipe-server

echo ✅ OriMind Universal Ecosystem started successfully!
echo 🌐 Access points:
echo   - Chi Flow Platform: http://localhost:3002
echo   - Sherlock IDE: http://localhost:3000  
echo   - ReliaKit Dashboard: http://localhost:5000
echo.
echo Press any key to stop all services...
pause >nul

echo 🛑 Stopping OriMind services...
taskkill /F /IM node.exe /T >nul 2>&1
echo ✅ All services stopped.
