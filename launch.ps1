#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Simple launcher script for GitHub Spec Kit
.DESCRIPTION
    This script automatically sets up and launches the Specify CLI tool for Spec-Driven Development.
    It checks for prerequisites (uv package manager) and installs the tool if needed.
.EXAMPLE
    .\launch.ps1
    Launches the Specify CLI setup
.EXAMPLE
    .\launch.ps1 init my-project --ai copilot
    Initializes a new project with GitHub Copilot
#>

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

Write-Host "GitHub Spec Kit Launcher" -ForegroundColor Green
Write-Host "========================`n" -ForegroundColor Green

# Check if uv is installed
Write-Host "Checking for uv package manager..." -ForegroundColor Cyan
$uvInstalled = $null -ne (Get-Command uv -ErrorAction SilentlyContinue)

if (-not $uvInstalled) {
    Write-Host "WARNING: uv is not installed. Installing uv..." -ForegroundColor Yellow
    Write-Host "`nInstalling uv using the official installer...`n" -ForegroundColor Cyan
    
    try {
        # Install uv using the official PowerShell installer
        Invoke-RestMethod https://astral.sh/uv/install.ps1 | Invoke-Expression
        
        # Refresh PATH in current session
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host "SUCCESS: uv installed successfully!`n" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: Failed to install uv automatically." -ForegroundColor Red
        Write-Host "`nPlease install uv manually by running:" -ForegroundColor Yellow
        Write-Host "  powershell -ExecutionPolicy ByPass -c `"irm https://astral.sh/uv/install.ps1 | iex`"`n" -ForegroundColor White
        Write-Host "Or visit: https://docs.astral.sh/uv/getting-started/installation/`n" -ForegroundColor White
        exit 1
    }
}
else {
    Write-Host "SUCCESS: uv is already installed" -ForegroundColor Green
    uv --version
}

# Check if specify is installed
Write-Host "`nChecking for Specify CLI..." -ForegroundColor Cyan
$specifyInstalled = $null -ne (Get-Command specify -ErrorAction SilentlyContinue)

if (-not $specifyInstalled) {
    Write-Host "Installing Specify CLI from spec-kit repository...`n" -ForegroundColor Yellow
    
    $repoPath = Split-Path -Parent $PSCommandPath
    
    try {
        Push-Location $repoPath
        uv tool install specify-cli --from "git+file:///$($repoPath.Replace('\', '/'))"
        Pop-Location
        
        # Refresh PATH in current session
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host "SUCCESS: Specify CLI installed successfully!`n" -ForegroundColor Green
    }
    catch {
        Pop-Location
        Write-Host "ERROR: Failed to install Specify CLI." -ForegroundColor Red
        Write-Host "`nError: $_`n" -ForegroundColor Red
        Write-Host "Try installing manually with:" -ForegroundColor Yellow
        Write-Host "  uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`n" -ForegroundColor White
        exit 1
    }
}
else {
    Write-Host "SUCCESS: Specify CLI is already installed" -ForegroundColor Green
}

# Run specify with provided arguments or show help
Write-Host "`n" + "="*50 -ForegroundColor Green

if ($Arguments.Count -eq 0) {
    Write-Host "`nSpecify CLI is ready! Here's how to use it:`n" -ForegroundColor Cyan
    Write-Host "Common commands:" -ForegroundColor Yellow
    Write-Host "  specify init <project-name>              - Initialize a new project" -ForegroundColor White
    Write-Host "  specify init <project-name> --ai claude  - Initialize with Claude Code" -ForegroundColor White
    Write-Host "  specify init <project-name> --ai copilot - Initialize with GitHub Copilot" -ForegroundColor White
    Write-Host "  specify init <project-name> --ai cursor  - Initialize with Cursor" -ForegroundColor White
    Write-Host "  specify check                            - Check installed tools`n" -ForegroundColor White
    
    Write-Host "Supported AI agents:" -ForegroundColor Yellow
    Write-Host "  claude, copilot, gemini, cursor, qwen, opencode," -ForegroundColor White
    Write-Host "  codex, windsurf, kilocode, auggie, roo, q`n" -ForegroundColor White
    
    Write-Host "For more options, run:" -ForegroundColor Yellow
    Write-Host "  specify --help`n" -ForegroundColor White
    
    Write-Host "Quick start example:" -ForegroundColor Green
    Write-Host "  specify init my-awesome-project --ai copilot`n" -ForegroundColor White
}
else {
    Write-Host "`nRunning: specify $($Arguments -join ' ')`n" -ForegroundColor Cyan
    & specify $Arguments
}

Write-Host "`nHappy spec-driven developing!`n" -ForegroundColor Green
