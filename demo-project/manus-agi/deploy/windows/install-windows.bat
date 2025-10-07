@echo off
REM 🌍 OriMind Universal Windows Installer
REM Supports Windows 10, 11, Server 2016+, and all architectures

echo 🚀 OriMind Universal Windows Installer
echo =====================================

REM Detect architecture
set ARCH=%PROCESSOR_ARCHITECTURE%
if "%ARCH%"=="AMD64" set ARCH_NAME=x86_64
if "%ARCH%"=="x86" set ARCH_NAME=x86
if "%ARCH%"=="ARM64" set ARCH_NAME=arm64
if "%ARCH%"=="" set ARCH_NAME=unknown

echo 🖥️  Architecture: %ARCH_NAME%

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Installing Node.js...
    if exist "%ProgramFiles%\nodejs\node.exe" (
        echo ✅ Node.js found in Program Files
    ) else (
        echo 📦 Please install Node.js from https://nodejs.org/
        echo    Or use winget: winget install OpenJS.NodeJS
        echo    Or use chocolatey: choco install nodejs
        pause
        exit /b 1
    )
)

REM Check package manager preference
where pnpm >nul 2>&1
if not errorlevel 1 (
    set PKG_MGR=pnpm
    goto :install_deps
)

where yarn >nul 2>&1
if not errorlevel 1 (
    set PKG_MGR=yarn
    goto :install_deps
)

set PKG_MGR=npm

:install_deps
echo 📦 Using package manager: %PKG_MGR%

REM Install dependencies
if not exist node_modules (
    echo Installing dependencies...
    %PKG_MGR% install
)

REM Create Windows service if administrator
net session >nul 2>&1
if not errorlevel 1 (
    echo 🔧 Administrator detected - creating Windows service...
    call create-windows-service.bat
) else (
    echo ⚠️  Run as administrator to install Windows service
)

REM Create desktop shortcut
echo 🖥️  Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\OriMind.lnk'); $Shortcut.TargetPath = '%~dp0start-orimind-universal.bat'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Save()"

echo ✅ Windows installation complete!
echo 🚀 Run: start-orimind-universal.bat
pause
