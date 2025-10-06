@echo off
REM Simple launcher for GitHub Spec Kit
REM This batch file calls the PowerShell launcher script

echo.
echo Starting GitHub Spec Kit...
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0launch.ps1" %*
