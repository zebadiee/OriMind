# OriMind Service Shutdown Script (PowerShell)
# Gracefully stops all OriMind components on Windows

param(
    [switch]$Force
)

Write-Host "🧠 OriMind - Graceful Shutdown" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

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

# Function to safely stop a job
function Stop-ServiceJob {
    param(
        [int]$JobId,
        [string]$Name
    )
    
    try {
        $job = Get-Job -Id $JobId -ErrorAction SilentlyContinue
        if ($job) {
            Write-Status "Stopping $Name (Job ID: $JobId)..."
            
            if ($job.State -eq "Running") {
                Stop-Job $job -ErrorAction SilentlyContinue
                Write-Success "$Name stopped"
            }
            else {
                Write-Warning "$Name was not running (State: $($job.State))"
            }
            
            Remove-Job $job -ErrorAction SilentlyContinue
        }
        else {
            Write-Warning "$Name job not found"
        }
    }
    catch {
        Write-Warning "Error stopping $Name`: $($_.Exception.Message)"
    }
}

try {
    # Read job information if it exists
    if (Test-Path ".orimind-jobs.json") {
        Write-Status "Reading service job information..."
        $jobInfo = Get-Content ".orimind-jobs.json" | ConvertFrom-Json
        
        # Stop services in reverse order
        foreach ($service in $jobInfo) {
            Stop-ServiceJob -JobId $service.Id -Name $service.Name
        }
        
        # Clean up job file
        Remove-Item ".orimind-jobs.json" -ErrorAction SilentlyContinue
        Write-Success "Cleaned up job information file"
    }
    else {
        Write-Warning "No job information file found, attempting to stop all OriMind jobs..."
        
        # Try to stop all jobs that might be OriMind related
        $allJobs = Get-Job | Where-Object { $_.Command -like "*npm*" -or $_.Command -like "*python*" }
        foreach ($job in $allJobs) {
            Write-Status "Stopping job $($job.Id) ($($job.Command))..."
            Stop-Job $job -ErrorAction SilentlyContinue
            Remove-Job $job -ErrorAction SilentlyContinue
        }
    }

    # Stop any remaining processes on common OriMind ports
    Write-Status "Cleaning up any remaining processes..."

    $ports = @(3000, 3001, 3002, 5000, 5001, 8000)
    foreach ($port in $ports) {
        try {
            $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            foreach ($connection in $connections) {
                $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Status "Stopping process on port $port (PID: $($process.Id))..."
                    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                }
            }
        }
        catch {
            # Port might not be in use, continue
        }
    }

    # Clean up any lock files
    Remove-Item ".orimind.lock" -ErrorAction SilentlyContinue

    Write-Success "All OriMind services stopped successfully"
    Write-Host ""
    Write-Host "To restart OriMind, run: .\scripts\start-orimind.ps1" -ForegroundColor Cyan
}
catch {
    Write-Error "An error occurred during shutdown: $($_.Exception.Message)"
    exit 1
}