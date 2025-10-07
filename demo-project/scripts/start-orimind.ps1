# OriMind Unified Startup Script (PowerShell)
# Eliminates startup hiccups and ensures smooth operation on Windows

param(
    [switch]$Verbose,
    [switch]$Force
)

# Set error handling
$ErrorActionPreference = "Stop"

Write-Host "🧠 OriMind - Unified AI Development Ecosystem" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Starting all components with optimized startup sequence..." -ForegroundColor White
Write-Host ""

# Function to print colored status
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if a port is available
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $false  # Port is in use
    }
    catch {
        return $true   # Port is available
    }
}

# Function to wait for service to be ready
function Wait-ForService {
    param(
        [int]$Port,
        [string]$ServiceName,
        [int]$MaxAttempts = 30
    )
    
    Write-Status "Waiting for $ServiceName on port $Port..."
    
    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        if (-not (Test-Port $Port)) {
            Write-Success "$ServiceName is ready on port $Port"
            return $true
        }
        
        Start-Sleep -Seconds 2
    }
    
    Write-Error "$ServiceName failed to start on port $Port after $MaxAttempts attempts"
    return $false
}

try {
    # Check prerequisites
    Write-Status "Checking prerequisites..."

    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    }

    if (-not (Test-Command "npm")) {
        Write-Error "npm is not installed. Please install npm and try again."
        exit 1
    }

    if (-not (Test-Command "python")) {
        Write-Error "Python is not installed. Please install Python 3.9+ and try again."
        exit 1
    }

    Write-Success "All prerequisites satisfied"

    # Create .env files from templates if they don't exist
    Write-Status "Setting up environment configuration..."

    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.minimal.template") {
            Copy-Item ".env.minimal.template" ".env"
            Write-Success "Created .env from minimal template"
        }
        else {
            Write-Warning "No .env template found, creating basic .env"
            @"
# OriMind Basic Configuration
NODE_ENV=development
PORT=3002
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_URL=http://127.0.0.1:3002
"@ | Out-File -FilePath ".env" -Encoding utf8
        }
    }
    else {
        Write-Success ".env file already exists"
    }

    # MCP Server .env setup
    $mcpEnvPath = "demo-project\manus-agi\mcp-recipe-server\.env"
    if (-not (Test-Path $mcpEnvPath)) {
        if (Test-Path "demo-project\manus-agi\mcp-recipe-server\.env.example") {
            Copy-Item "demo-project\manus-agi\mcp-recipe-server\.env.example" $mcpEnvPath
            Write-Success "Created MCP server .env from example"
        }
    }
    else {
        Write-Success "MCP server .env already exists"
    }

    # Start services in optimized order
    Write-Status "Starting OriMind components..."

    # Initialize job tracking
    $jobs = @()

    # 1. Start ReliaKit Dashboard (fastest startup)
    Write-Status "Starting ReliaKit Dashboard..."
    if (Test-Path "dashboard\app.py") {
        Set-Location "dashboard"
        $reliakitJob = Start-Job -ScriptBlock { python app.py }
        $jobs += @{ Name = "ReliaKit Dashboard"; Job = $reliakitJob; Port = 5000 }
        Set-Location ".."
        Write-Success "ReliaKit Dashboard started (Job ID: $($reliakitJob.Id))"
    }
    else {
        Write-Warning "ReliaKit dashboard not found, skipping..."
    }

    # 2. Start MCP Server (build and run)
    Write-Status "Building and starting MCP Server..."
    if (Test-Path "demo-project\manus-agi\mcp-recipe-server") {
        Set-Location "demo-project\manus-agi\mcp-recipe-server"
        
        # Build first
        Write-Status "Building MCP Server..."
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Success "MCP Server built successfully"
            
            # Start the server
            $mcpJob = Start-Job -ScriptBlock { npm start }
            $jobs += @{ Name = "MCP Server"; Job = $mcpJob; Port = $null }
            Set-Location "..\..\..\"
            Write-Success "MCP Server started (Job ID: $($mcpJob.Id))"
        }
        else {
            Write-Error "MCP Server build failed"
            Set-Location "..\..\..\"
            exit 1
        }
    }
    else {
        Write-Warning "MCP Server directory not found, skipping..."
    }

    # 3. Start Sherlock IDE (requires build)
    Write-Status "Building and starting Sherlock IDE..."
    if (Test-Path "sherlock-web-ide") {
        Set-Location "sherlock-web-ide"
        
        # Install dependencies if needed
        if (-not (Test-Path "node_modules")) {
            Write-Status "Installing Sherlock IDE dependencies..."
            npm install --silent
        }
        
        # Build production version
        Write-Status "Building Sherlock IDE..."
        npm run build --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Sherlock IDE built successfully"
            
            # Start the IDE
            $sherlockJob = Start-Job -ScriptBlock { npm start }
            $jobs += @{ Name = "Sherlock IDE"; Job = $sherlockJob; Port = 3000 }
            Set-Location ".."
            Write-Success "Sherlock IDE started (Job ID: $($sherlockJob.Id))"
        }
        else {
            Write-Error "Sherlock IDE build failed"
            Set-Location ".."
            exit 1
        }
    }
    else {
        Write-Warning "Sherlock IDE directory not found, skipping..."
    }

    # Wait a moment for services to initialize
    Write-Status "Waiting for services to initialize..."
    Start-Sleep -Seconds 5

    # Health checks
    Write-Status "Performing health checks..."

    foreach ($service in $jobs) {
        $job = $service.Job
        if ($job.State -eq "Running") {
            Write-Success "$($service.Name) is running (Job ID: $($job.Id))"
        }
        else {
            Write-Warning "$($service.Name) may not be running properly (State: $($job.State))"
        }
    }

    Write-Host ""
    Write-Host "🎉 OriMind Startup Complete!" -ForegroundColor Green
    Write-Host "==========================" -ForegroundColor Green
    Write-Host "Available Services:" -ForegroundColor White
    Write-Host "  • MCP Server: Running on stdio" -ForegroundColor Cyan
    Write-Host "  • ReliaKit Dashboard: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "  • Sherlock IDE: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To stop all services, run: .\scripts\stop-orimind.ps1" -ForegroundColor Yellow
    Write-Host "For job management, use: Get-Job, Stop-Job commands" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Happy coding with OriMind! 🧠✨" -ForegroundColor Magenta

    # Save job information for cleanup
    $jobInfo = $jobs | ForEach-Object { 
        @{ Name = $_.Name; Id = $_.Job.Id; Port = $_.Port }
    }
    $jobInfo | ConvertTo-Json | Out-File -FilePath ".orimind-jobs.json" -Encoding utf8

    Write-Host ""
    Write-Status "Services are running. Press Ctrl+C to stop monitoring, or close this window."
    
    # Keep monitoring
    while ($true) {
        Start-Sleep -Seconds 10
        # Could add health checks here
    }
}
catch {
    Write-Error "An error occurred during startup: $($_.Exception.Message)"
    Write-Host "Attempting to clean up any started services..." -ForegroundColor Yellow
    
    # Clean up any jobs that were started
    if ($jobs) {
        foreach ($service in $jobs) {
            try {
                Stop-Job $service.Job -ErrorAction SilentlyContinue
                Remove-Job $service.Job -ErrorAction SilentlyContinue
            }
            catch {
                # Ignore cleanup errors
            }
        }
    }
    
    exit 1
}