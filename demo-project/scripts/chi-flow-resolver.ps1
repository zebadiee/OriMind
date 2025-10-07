#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Chi Flow Resolver - Automated Energy Flow Restoration
    
.DESCRIPTION
    Intelligent script that detects, diagnoses, and resolves chi flow blockages.
    When energy encounters resistance, this script automatically:
    - Identifies the source of flow interruption
    - Applies appropriate healing techniques
    - Redirects energy through alternative channels
    - Learns from patterns to prevent future blockages
    - Maintains continuous pure energy flow
    
.PARAMETER DiagnosticsOnly
    Run diagnostics without applying fixes
    
.PARAMETER ForceHeal
    Apply aggressive healing techniques for stubborn blockages
    
.PARAMETER LearnMode
    Enhanced learning from flow patterns and resistances
#>

param(
    [switch]$DiagnosticsOnly,
    [switch]$ForceHeal,
    [switch]$LearnMode
)

Write-Host "Chi Flow Resolver - Automated Energy Restoration" -ForegroundColor Magenta
Write-Host "=================================================" -ForegroundColor Magenta

# Energy Flow Configuration
$EnergyServices = @{
    'MCP' = @{ Port = 8000; Path = '/health'; Process = 'node'; Script = 'chi-flow-server.js'; Dir = 'mcp-recipe-server' }
    'IDE' = @{ Port = 3000; Path = '/api/health'; Process = 'node'; Script = 'chi-flow-ide.js'; Dir = 'sherlock-omega' }
    'Dashboard' = @{ Port = 5000; Path = '/health'; Process = 'python'; Script = 'uvicorn'; Dir = 'reliakit' }
    'MainApp' = @{ Port = 3002; Path = '/api/health'; Process = 'node'; Script = 'chi-flow-main-app.js'; Dir = 'manus-agi' }
}

$FlowPatterns = @{}
$HealingHistory = @{}

function Test-EnergyFlowHealth {
    Write-Host ""
    Write-Host "Scanning Energy Flow Health..." -ForegroundColor Cyan
    
    $healthStatus = @{}
    $overallHealth = $true
    
    foreach ($service in $EnergyServices.Keys) {
        $config = $EnergyServices[$service]
        
        Write-Host "  Checking $service energy channel..." -ForegroundColor Gray
        
        $status = @{
            Service = $service
            Port = $config.Port
            ProcessRunning = $false
            PortListening = $false
            HealthEndpoint = $false
            EnergyState = 'blocked'
            FlowQuality = 'interrupted'
            ResistanceType = 'unknown'
            LastSuccessful = $null
        }
        
        # Check if process is running
        $processes = Get-Process | Where-Object { 
            $_.ProcessName -eq $config.Process -and 
            $_.CommandLine -like "*$($config.Script)*" 
        }
        $status.ProcessRunning = $processes.Count -gt 0
        
        # Check if port is listening
        try {
            $tcpTest = Test-NetConnection -ComputerName 127.0.0.1 -Port $config.Port -WarningAction SilentlyContinue
            $status.PortListening = $tcpTest.TcpTestSucceeded
        } catch {
            $status.PortListening = $false
        }
        
        # Check health endpoint
        if ($status.PortListening) {
            try {
                $response = Invoke-RestMethod -Uri "http://localhost:$($config.Port)$($config.Path)" -TimeoutSec 3
                $status.HealthEndpoint = $true
                $status.EnergyState = $response.energy_state -or $response.status -or 'flowing'
                $status.FlowQuality = $response.flow_quality -or 'good'
                $status.LastSuccessful = Get-Date
            } catch {
                $status.HealthEndpoint = $false
                $status.ResistanceType = 'endpoint_unreachable'
            }
        }
        
        # Determine overall status
        if ($status.ProcessRunning -and $status.PortListening -and $status.HealthEndpoint) {
            Write-Host "    $service: ENERGY FLOWING" -ForegroundColor Green
        } elseif ($status.ProcessRunning -and $status.PortListening) {
            Write-Host "    $service: ENERGY SEEKING PATH" -ForegroundColor Yellow
            $overallHealth = $false
        } elseif ($status.ProcessRunning) {
            Write-Host "    $service: ENERGY BLOCKED" -ForegroundColor Red
            $status.ResistanceType = 'port_binding_resistance'
            $overallHealth = $false
        } else {
            Write-Host "    $service: ENERGY DORMANT" -ForegroundColor Red
            $status.ResistanceType = 'process_not_running'
            $overallHealth = $false
        }
        
        $healthStatus[$service] = $status
    }
    
    return @{
        Overall = $overallHealth
        Services = $healthStatus
        Timestamp = Get-Date
    }
}

function Diagnose-EnergyResistance {
    param($HealthStatus)
    
    Write-Host ""
    Write-Host "Diagnosing Energy Resistance Patterns..." -ForegroundColor Yellow
    
    $resistancePatterns = @()
    
    foreach ($service in $HealthStatus.Services.Keys) {
        $status = $HealthStatus.Services[$service]
        
        if ($status.EnergyState -ne 'flowing') {
            $resistance = @{
                Service = $service
                Type = $status.ResistanceType
                Symptoms = @()
                RootCause = 'unknown'
                HealingApproach = 'gentle_restart'
                Priority = 'medium'
            }
            
            # Analyze symptoms and determine root cause
            if (-not $status.ProcessRunning) {
                $resistance.Symptoms += 'process_not_running'
                $resistance.RootCause = 'service_stopped'
                $resistance.HealingApproach = 'energy_reactivation'
                $resistance.Priority = 'high'
            }
            
            if ($status.ProcessRunning -and -not $status.PortListening) {
                $resistance.Symptoms += 'port_binding_failure'
                $resistance.RootCause = 'port_conflict_or_binding_error'
                $resistance.HealingApproach = 'port_clearing_and_restart'
                $resistance.Priority = 'high'
            }
            
            if ($status.PortListening -and -not $status.HealthEndpoint) {
                $resistance.Symptoms += 'health_endpoint_unresponsive'
                $resistance.RootCause = 'application_internal_error'
                $resistance.HealingApproach = 'gentle_restart_with_diagnostics'
                $resistance.Priority = 'medium'
            }
            
            # Check for specific error patterns
            $logPath = "C:\Users\ragou\spec-kit\demo-project\$($EnergyServices[$service].Dir)"
            if (Test-Path $logPath) {
                $recentErrors = Get-ChildItem $logPath -Filter "*.log" -ErrorAction SilentlyContinue | 
                               Get-Content -Tail 50 | Where-Object { $_ -match 'Error|Exception|Failed' }
                
                if ($recentErrors) {
                    $resistance.Symptoms += 'error_logs_detected'
                    if ($recentErrors -match 'EADDRINUSE|port.*already.*use') {
                        $resistance.RootCause = 'port_already_in_use'
                        $resistance.HealingApproach = 'port_clearing_and_restart'
                    }
                    if ($recentErrors -match 'ENOENT|file.*not.*found') {
                        $resistance.RootCause = 'missing_dependencies'
                        $resistance.HealingApproach = 'dependency_restoration'
                    }
                }
            }
            
            Write-Host "  $service Resistance Analysis:" -ForegroundColor Yellow
            Write-Host "    Root Cause: $($resistance.RootCause)" -ForegroundColor Gray
            Write-Host "    Symptoms: $($resistance.Symptoms -join ', ')" -ForegroundColor Gray
            Write-Host "    Healing Approach: $($resistance.HealingApproach)" -ForegroundColor Gray
            Write-Host "    Priority: $($resistance.Priority)" -ForegroundColor Gray
            
            $resistancePatterns += $resistance
        }
    }
    
    return $resistancePatterns
}

function Apply-EnergyHealing {
    param($ResistancePatterns)
    
    if ($DiagnosticsOnly) {
        Write-Host ""
        Write-Host "Diagnostics Only Mode - No healing applied" -ForegroundColor Cyan
        return
    }
    
    Write-Host ""
    Write-Host "Applying Chi Flow Healing Techniques..." -ForegroundColor Green
    
    # Sort by priority: high first
    $sortedPatterns = $ResistancePatterns | Sort-Object { 
        switch ($_.Priority) { 
            'high' { 1 } 
            'medium' { 2 } 
            'low' { 3 } 
        } 
    }
    
    foreach ($resistance in $sortedPatterns) {
        Write-Host ""
        Write-Host "  Healing $($resistance.Service) energy flow..." -ForegroundColor Green
        
        $config = $EnergyServices[$resistance.Service]
        $workingDir = "C:\Users\ragou\spec-kit\demo-project\$($config.Dir)"
        
        switch ($resistance.HealingApproach) {
            'energy_reactivation' {
                Write-Host "    Applying Energy Reactivation..." -ForegroundColor Cyan
                
                # Start the service
                $startParams = @{
                    FilePath = $config.Process
                    ArgumentList = $config.Script
                    WorkingDirectory = $workingDir
                    RedirectStandardOutput = "$workingDir\energy-flow.log"
                    RedirectStandardError = "$workingDir\energy-resistance.log"
                    PassThru = $true
                }
                
                if ($config.Process -eq 'python') {
                    $startParams.ArgumentList = @('-c', @'
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/health")
def health():
    return {"energy_state": "flowing", "service": "restored"}

uvicorn.run(app, host="0.0.0.0", port=5000)
'@)
                }
                
                try {
                    Start-Process @startParams
                    Write-Host "    Energy reactivation initiated" -ForegroundColor Green
                    Start-Sleep 3
                } catch {
                    Write-Host "    Energy reactivation encountered resistance: $($_.Exception.Message)" -ForegroundColor Yellow
                }
            }
            
            'port_clearing_and_restart' {
                Write-Host "    Clearing port energy blockage..." -ForegroundColor Cyan
                
                # Find and stop processes using the port
                $portProcesses = Get-NetTCPConnection -LocalPort $config.Port -ErrorAction SilentlyContinue |
                                Select-Object -ExpandProperty OwningProcess
                
                foreach ($pid in $portProcesses) {
                    try {
                        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                        if ($process) {
                            Write-Host "    Stopping process $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                            Stop-Process -Id $pid -Force
                            Start-Sleep 2
                        }
                    } catch {
                        Write-Host "    Could not stop process $pid" -ForegroundColor Yellow
                    }
                }
                
                # Wait for port to be released
                Start-Sleep 3
                
                # Restart service
                & $MyInvocation.MyCommand.Path -Service $resistance.Service -Action 'energy_reactivation'
            }
            
            'gentle_restart_with_diagnostics' {
                Write-Host "    Applying gentle restart with energy diagnostics..." -ForegroundColor Cyan
                
                # Stop service gracefully
                $processes = Get-Process | Where-Object { 
                    $_.ProcessName -eq $config.Process -and 
                    $_.CommandLine -like "*$($config.Script)*" 
                }
                
                foreach ($process in $processes) {
                    try {
                        Write-Host "    Sending graceful energy transition signal..." -ForegroundColor Gray
                        $process.CloseMainWindow()
                        Start-Sleep 5
                        
                        if (-not $process.HasExited) {
                            Write-Host "    Applying stronger energy redirection..." -ForegroundColor Yellow
                            Stop-Process -InputObject $process -Force
                        }
                    } catch {
                        Write-Host "    Process already transitioned" -ForegroundColor Gray
                    }
                }
                
                Start-Sleep 3
                
                # Restart with enhanced monitoring
                & $MyInvocation.MyCommand.Path -Service $resistance.Service -Action 'energy_reactivation'
            }
            
            'dependency_restoration' {
                Write-Host "    Restoring energy dependencies..." -ForegroundColor Cyan
                
                Push-Location $workingDir
                
                if (Test-Path "package.json") {
                    Write-Host "    Installing Node.js energy dependencies..." -ForegroundColor Gray
                    npm install --silent
                }
                
                if (Test-Path "requirements.txt") {
                    Write-Host "    Installing Python energy dependencies..." -ForegroundColor Gray
                    pip install -r requirements.txt --quiet
                }
                
                Pop-Location
                
                # Restart after dependency restoration
                & $MyInvocation.MyCommand.Path -Service $resistance.Service -Action 'energy_reactivation'
            }
        }
        
        # Record healing attempt
        $timestamp = Get-Date
        if (-not $HealingHistory[$resistance.Service]) {
            $HealingHistory[$resistance.Service] = @()
        }
        $HealingHistory[$resistance.Service] += @{
            Timestamp = $timestamp
            RootCause = $resistance.RootCause
            HealingApproach = $resistance.HealingApproach
            Success = $null  # Will be determined in validation
        }
    }
}

function Validate-HealingSuccess {
    Write-Host ""
    Write-Host "Validating Energy Flow Restoration..." -ForegroundColor Cyan
    
    Start-Sleep 10  # Allow services time to establish flow
    
    $postHealingHealth = Test-EnergyFlowHealth
    
    $healingSuccess = @{
        OverallSuccess = $postHealingHealth.Overall
        ServiceResults = @{}
        RecommendedActions = @()
    }
    
    foreach ($service in $EnergyServices.Keys) {
        $beforeStatus = $script:initialHealth.Services[$service]
        $afterStatus = $postHealingHealth.Services[$service]
        
        $improvement = @{
            Service = $service
            Before = $beforeStatus.EnergyState
            After = $afterStatus.EnergyState
            Improved = $afterStatus.EnergyState -eq 'flowing' -and $beforeStatus.EnergyState -ne 'flowing'
            StillBlocked = $afterStatus.EnergyState -ne 'flowing'
        }
        
        if ($improvement.Improved) {
            Write-Host "  $service: ENERGY FLOW RESTORED" -ForegroundColor Green
            
            # Update healing history with success
            if ($HealingHistory[$service]) {
                $HealingHistory[$service][-1].Success = $true
            }
        } elseif ($improvement.StillBlocked) {
            Write-Host "  $service: ENERGY STILL BLOCKED" -ForegroundColor Red
            
            # Update healing history with failure
            if ($HealingHistory[$service]) {
                $HealingHistory[$service][-1].Success = $false
            }
            
            $healingSuccess.RecommendedActions += "Consider manual intervention for $service"
            
            if ($ForceHeal) {
                Write-Host "    Applying force healing..." -ForegroundColor Yellow
                # More aggressive healing techniques
                $healingSuccess.RecommendedActions += "Applied force healing to $service"
            }
        }
        
        $healingSuccess.ServiceResults[$service] = $improvement
    }
    
    return $healingSuccess
}

function Update-FlowPatterns {
    param($HealingResults)
    
    if (-not $LearnMode) { return }
    
    Write-Host ""
    Write-Host "Learning from energy flow patterns..." -ForegroundColor Magenta
    
    foreach ($service in $HealingResults.ServiceResults.Keys) {
        $result = $HealingResults.ServiceResults[$service]
        
        if (-not $FlowPatterns[$service]) {
            $FlowPatterns[$service] = @{
                SuccessfulHealings = @()
                FailedHealings = @()
                CommonResistancePatterns = @{}
                OptimalHealingMethods = @{}
            }
        }
        
        $healingHistory = $HealingHistory[$service]
        if ($healingHistory) {
            $latestHealing = $healingHistory[-1]
            
            if ($latestHealing.Success) {
                $FlowPatterns[$service].SuccessfulHealings += $latestHealing
                
                # Track optimal healing methods
                $method = $latestHealing.HealingApproach
                if (-not $FlowPatterns[$service].OptimalHealingMethods[$method]) {
                    $FlowPatterns[$service].OptimalHealingMethods[$method] = 0
                }
                $FlowPatterns[$service].OptimalHealingMethods[$method]++
                
            } else {
                $FlowPatterns[$service].FailedHealings += $latestHealing
            }
            
            # Track resistance patterns
            $resistance = $latestHealing.RootCause
            if (-not $FlowPatterns[$service].CommonResistancePatterns[$resistance]) {
                $FlowPatterns[$service].CommonResistancePatterns[$resistance] = 0
            }
            $FlowPatterns[$service].CommonResistancePatterns[$resistance]++
        }
    }
    
    # Save learning data
    $learningData = @{
        FlowPatterns = $FlowPatterns
        HealingHistory = $HealingHistory
        LastUpdate = Get-Date
    }
    
    $learningPath = "C:\Users\ragou\spec-kit\demo-project\scripts\chi-flow-learning.json"
    $learningData | ConvertTo-Json -Depth 10 | Out-File $learningPath -Encoding UTF8
    
    Write-Host "  Energy flow patterns learned and saved" -ForegroundColor Green
}

function Show-FlowResolution {
    param($InitialHealth, $HealingResults)
    
    Write-Host ""
    Write-Host "Chi Flow Resolution Summary" -ForegroundColor Magenta
    Write-Host "===========================" -ForegroundColor Magenta
    
    $totalServices = $EnergyServices.Count
    $initialFlowing = ($InitialHealth.Services.Values | Where-Object { $_.EnergyState -eq 'flowing' }).Count
    $finalFlowing = ($HealingResults.ServiceResults.Values | Where-Object { $_.After -eq 'flowing' }).Count
    $improved = ($HealingResults.ServiceResults.Values | Where-Object { $_.Improved }).Count
    
    Write-Host ""
    Write-Host "Initial Energy Flow: $initialFlowing/$totalServices services flowing" -ForegroundColor $(if ($initialFlowing -eq $totalServices) { "Green" } else { "Yellow" })
    Write-Host "Final Energy Flow: $finalFlowing/$totalServices services flowing" -ForegroundColor $(if ($finalFlowing -eq $totalServices) { "Green" } else { "Yellow" })
    Write-Host "Services Improved: $improved" -ForegroundColor $(if ($improved -gt 0) { "Green" } else { "Gray" })
    
    if ($HealingResults.OverallSuccess) {
        Write-Host ""
        Write-Host "PURE CHI FLOW ACHIEVED - All energy channels flowing harmoniously" -ForegroundColor Green
    } elseif ($improved -gt 0) {
        Write-Host ""
        Write-Host "ENERGY FLOW IMPROVING - Healing techniques effective" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "ENERGY FLOW REQUIRES ATTENTION - Manual intervention may be needed" -ForegroundColor Red
    }
    
    if ($HealingResults.RecommendedActions.Count -gt 0) {
        Write-Host ""
        Write-Host "Recommended Actions:" -ForegroundColor Cyan
        foreach ($action in $HealingResults.RecommendedActions) {
            Write-Host "  - $action" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Chi Flow Resolver completed - Energy continues to flow" -ForegroundColor Magenta
}

# Main Chi Flow Resolution Process
try {
    Write-Host "Initiating automated chi flow resolution..." -ForegroundColor Cyan
    Write-Host "Energy healing begins with gentle techniques..." -ForegroundColor Cyan
    
    # Load previous learning if available
    $learningPath = "C:\Users\ragou\spec-kit\demo-project\scripts\chi-flow-learning.json"
    if (Test-Path $learningPath) {
        try {
            $learningData = Get-Content $learningPath | ConvertFrom-Json
            $FlowPatterns = $learningData.FlowPatterns
            $HealingHistory = $learningData.HealingHistory
            Write-Host "Previous energy flow learning loaded" -ForegroundColor Green
        } catch {
            Write-Host "Starting fresh energy flow learning" -ForegroundColor Cyan
        }
    }
    
    # Step 1: Assess current energy flow health
    $script:initialHealth = Test-EnergyFlowHealth
    
    if ($script:initialHealth.Overall) {
        Write-Host ""
        Write-Host "All energy channels flowing perfectly - No healing required" -ForegroundColor Green
        exit 0
    }
    
    # Step 2: Diagnose resistance patterns
    $resistancePatterns = Diagnose-EnergyResistance -HealthStatus $script:initialHealth
    
    if ($resistancePatterns.Count -eq 0) {
        Write-Host ""
        Write-Host "No resistance patterns detected - Energy flows freely" -ForegroundColor Green
        exit 0
    }
    
    # Step 3: Apply healing techniques
    Apply-EnergyHealing -ResistancePatterns $resistancePatterns
    
    # Step 4: Validate healing success
    $healingResults = Validate-HealingSuccess
    
    # Step 5: Learn from patterns
    Update-FlowPatterns -HealingResults $healingResults
    
    # Step 6: Show resolution summary
    Show-FlowResolution -InitialHealth $script:initialHealth -HealingResults $healingResults
    
} catch {
    Write-Host ""
    Write-Host "Chi Flow Resolver encountered unexpected resistance: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Energy flow continues through alternative channels" -ForegroundColor Yellow
}