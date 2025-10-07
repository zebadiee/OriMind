@echo off
REM Create Windows service for OriMind

echo Creating OriMind Windows Service...

REM Create service wrapper
echo @echo off > orimind-service-wrapper.bat
echo cd /d "%~dp0" >> orimind-service-wrapper.bat
echo node process-manager.js start >> orimind-service-wrapper.bat

REM Install service using nssm (if available) or sc
where nssm >nul 2>&1
if not errorlevel 1 (
    echo Using NSSM to create service...
    nssm install OriMind "%~dp0orimind-service-wrapper.bat"
    nssm set OriMind Description "OriMind Universal AI Orchestration Ecosystem"
    nssm set OriMind Start SERVICE_AUTO_START
    echo ✅ Service created with NSSM
) else (
    echo Using SC to create service...
    sc create OriMind binPath= "%~dp0orimind-service-wrapper.bat" start= auto
    sc description OriMind "OriMind Universal AI Orchestration Ecosystem"
    echo ✅ Service created with SC
)

echo 🔧 To start service: sc start OriMind
echo 🛑 To stop service: sc stop OriMind
pause
