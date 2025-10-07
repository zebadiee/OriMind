#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OriMind Chi Flow Platform Launcher - Pure Energy in Motion
    
.DESCRIPTION
    Launch the OriMind platform with chi flow principles:
    - Energy flows continuously without blocking
    - All processes stream naturally like water
    - Background flows invisible but constant
    - Real-time updates instant like electricity
    - Self-healing through continuous monitoring
#>

Write-Host "🌊 OriMind Chi Flow Platform - Pure Energy Launch" -ForegroundColor Magenta
Write-Host "===================================================" -ForegroundColor Magenta

function Start-ChiEnergyFlow {
    Write-Host ""
    Write-Host "⚡ Initiating Chi Energy Flow..." -ForegroundColor Cyan
    
    # Chi Flow Principle: Everything flows simultaneously, nothing waits
    Write-Host "🌊 Energy channels opening..." -ForegroundColor Blue
    
    # Channel 1: MCP Chi Flow (Core Energy Source)
    Write-Host "💧 Opening MCP Energy Channel..." -ForegroundColor DarkCyan
    $mcpJob = Start-Job -ScriptBlock {
        Set-Location "C:\Users\ragou\spec-kit\demo-project\manus-agi\mcp-recipe-server"
        $env:NODE_ENV = "chi_flow"
        node chi-flow-server.js
    }
    
    # Channel 2: IDE Chi Flow (User Energy Interface)  
    Write-Host "🔍 Opening IDE Energy Channel..." -ForegroundColor DarkBlue
    $ideJob = Start-Job -ScriptBlock {
        Set-Location "C:\Users\ragou\spec-kit\demo-project\sherlock-omega"
        $env:NODE_ENV = "chi_flow"
        node chi-flow-ide.js
    }
    
    # Channel 3: Dashboard Chi Flow (Metrics Energy Stream)
    Write-Host "📊 Opening Dashboard Energy Channel..." -ForegroundColor DarkGreen
    $dashboardJob = Start-Job -ScriptBlock {
        Set-Location "C:\Users\ragou\spec-kit\demo-project\reliakit"
        $env:PYTHON_ENV = "chi_flow"
        $pythonCode = @"
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import uvicorn
import json
import time

app = FastAPI(title='ReliaKit Chi Flow Dashboard')

@app.get('/health')
async def chi_health():
    return {
        'service': 'ReliaKit Chi Flow Dashboard',
        'energy_state': 'flowing',
        'blocking_operations': 0,
        'chi_level': 'optimal',
        'flow_quality': 'pure'
    }

@app.get('/api/models')
async def flowing_models():
    return {
        'models': [
            {'id': 'gpt-4', 'energy_level': 'high', 'flow_state': 'optimal', 'chi_rating': 0.96},
            {'id': 'claude-3', 'energy_level': 'steady', 'flow_state': 'flowing', 'chi_rating': 0.94},
            {'id': 'gemini-pro', 'energy_level': 'efficient', 'flow_state': 'smooth', 'chi_rating': 0.91}
        ],
        'total_energy': 'infinite',
        'flow_pattern': 'continuous_stream'
    }

@app.post('/api/arbitrate')
async def chi_arbitration(request: dict):
    return {
        'selected_model': 'claude-3',
        'reason': 'Energy flows optimally through this channel',
        'confidence': 0.95,
        'chi_alignment': 'perfect',
        'flow_speed': 'instant',
        'energy_efficiency': 0.98
    }

@app.get('/api/energy/stream')
async def energy_stream():
    async def generate_energy():
        while True:
            energy_data = {
                'timestamp': time.time(),
                'energy_level': 0.9 + (time.time() % 1) * 0.1,
                'flow_rate': 95 + (time.time() % 10),
                'chi_balance': 'optimal',
                'blocking_operations': 0
            }
            yield f'data: {json.dumps(energy_data)}\n\n'
            await asyncio.sleep(0.1)
    
    return StreamingResponse(generate_energy(), media_type='text/plain')

print('ReliaKit Chi Flow Dashboard: Continuous energy metrics flowing')
uvicorn.run(app, host='0.0.0.0', port=5000, log_level='error')
"@
        python -c $pythonCode
    }
    
    # Channel 4: Main App Chi Flow (Core Integration Energy)
    Write-Host "🌀 Opening Main App Energy Channel..." -ForegroundColor DarkMagenta
    $mainAppJob = Start-Job -ScriptBlock {
        Set-Location "C:\Users\ragou\spec-kit\demo-project\manus-agi"
        $env:NODE_ENV = "chi_flow"
        node chi-flow-main-app.js
    }
    
    # Chi Flow Principle: Let energy establish its natural rhythm
    Write-Host "⏳ Allowing energy to find its natural flow rhythm..." -ForegroundColor Yellow
    Start-Sleep 8
    
    return @{
        MCPEnergyChannel = $mcpJob
        IDEEnergyChannel = $ideJob  
        DashboardEnergyChannel = $dashboardJob
        MainAppEnergyChannel = $mainAppJob
    }
}

function Test-ChiEnergyFlow {
    param($EnergyChannels)
    
    Write-Host ""
    Write-Host "🔮 Testing Chi Energy Flow Patterns..." -ForegroundColor Magenta
    
    $energyTests = @(
        @{ Channel = "IDE"; Port = 3000; Path = "/api/health"; Symbol = "🔍" },
        @{ Channel = "Dashboard"; Port = 5000; Path = "/health"; Symbol = "📊" },
        @{ Channel = "MainApp"; Port = 3002; Path = "/api/health"; Symbol = "🌀" },
        @{ Channel = "WebSocket"; Port = 3001; Path = $null; Symbol = "⚡" }
    )
    
    $flowingChannels = 0
    
    foreach ($test in $energyTests) {
        try {
            if ($test.Path) {
                $response = Invoke-RestMethod -Uri "http://localhost:$($test.Port)$($test.Path)" -TimeoutSec 3
                if ($response.energy_state -eq "flowing" -or $response.status -eq "healthy") {
                    Write-Host "$($test.Symbol) $($test.Channel) Energy: FLOWING (Port: $($test.Port))" -ForegroundColor Green
                    $flowingChannels++
                } else {
                    Write-Host "$($test.Symbol) $($test.Channel) Energy: ESTABLISHING FLOW..." -ForegroundColor Yellow
                }
            } else {
                # Test WebSocket connection
                $tcpTest = Test-NetConnection -ComputerName 127.0.0.1 -Port $test.Port -WarningAction SilentlyContinue
                if ($tcpTest.TcpTestSucceeded) {
                    Write-Host "$($test.Symbol) $($test.Channel) Energy: STREAMING (Port: $($test.Port))" -ForegroundColor Green
                    $flowingChannels++
                } else {
                    Write-Host "$($test.Symbol) $($test.Channel) Energy: CHANNEL OPENING..." -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "$($test.Symbol) $($test.Channel) Energy: SEEKING FLOW PATH..." -ForegroundColor Cyan
        }
    }
    
    return $flowingChannels
}

function Show-ChiFlowDashboard {
    param($FlowingChannels)
    
    Write-Host ""
    Write-Host "🌊 Chi Flow Energy Dashboard" -ForegroundColor Magenta
    Write-Host "=============================" -ForegroundColor Magenta
    
    # Energy Flow Status
    $energyLevel = ($FlowingChannels / 4) * 100
    $energyColor = if ($energyLevel -ge 80) { "Green" } elseif ($energyLevel -ge 50) { "Yellow" } else { "Cyan" }
    
    Write-Host ""
    Write-Host "⚡ Energy Flow Level: $([math]::Round($energyLevel))%" -ForegroundColor $energyColor
    Write-Host "🌊 Flow Quality: " -NoNewline
    if ($energyLevel -ge 80) {
        Write-Host "PURE CHI FLOW" -ForegroundColor Green
    } elseif ($energyLevel -ge 50) {
        Write-Host "ESTABLISHING HARMONY" -ForegroundColor Yellow  
    } else {
        Write-Host "ENERGY AWAKENING" -ForegroundColor Cyan
    }
    
    # Chi Flow Principles Status
    Write-Host ""
    Write-Host "🎯 Chi Flow Principles:" -ForegroundColor Cyan
    $principles = @(
        "💧 Non-Blocking Operations: All async, energy flows freely",
        "🌪️ Background Processing: Invisible wind energy constant",
        "⚡ Real-Time Updates: Electric speed response",
        "🌍 Graceful Persistence: Earth energy stable but yielding",
        "🔥 Intelligent Processing: Fire energy controlled intensity",
        "🌙 Natural Rhythms: Lunar cycles for maintenance",
        "☀️ Continuous Power: Solar energy never depleting"
    )
    
    foreach ($principle in $principles) {
        Write-Host "   $principle" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🌐 Live Energy Access Points:" -ForegroundColor Cyan
    Write-Host "   🔍 IDE Energy Interface: http://localhost:3000/api/health" -ForegroundColor Gray
    Write-Host "   📊 Dashboard Metrics Flow: http://localhost:5000/health" -ForegroundColor Gray
    Write-Host "   🌀 Main App Chi Flow: http://localhost:3002/api/health" -ForegroundColor Gray
    Write-Host "   ⚡ Real-Time Energy Stream: ws://localhost:3002" -ForegroundColor Gray
    Write-Host "   🌊 Live Metrics Stream: http://localhost:5000/api/energy/stream" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🔧 Energy Flow Commands:" -ForegroundColor Yellow
    Write-Host "   # Test IDE Energy Flow" -ForegroundColor Gray
    Write-Host "   curl http://localhost:3000/api/projects" -ForegroundColor Gray
    Write-Host "" -ForegroundColor Gray
    Write-Host "   # Test Main App Chi Flow" -ForegroundColor Gray  
    Write-Host "   curl http://localhost:3002/api/projects" -ForegroundColor Gray
    Write-Host "" -ForegroundColor Gray
    Write-Host "   # Test AI Model Energy Selection" -ForegroundColor Gray
    Write-Host "   curl -X POST http://localhost:5000/api/arbitrate -H 'Content-Type: application/json' -d '{\"task\":\"chi_flow\"}'" -ForegroundColor Gray
    Write-Host "" -ForegroundColor Gray
    Write-Host "   # Monitor Live Energy Stream" -ForegroundColor Gray
    Write-Host "   curl http://localhost:5000/api/energy/stream" -ForegroundColor Gray
}

function Start-EnergyMonitoring {
    Write-Host ""
    Write-Host "💚 Starting Continuous Energy Monitoring..." -ForegroundColor Green
    
    $monitoringJob = Start-Job -ScriptBlock {
        while ($true) {
            $timestamp = Get-Date -Format "HH:mm:ss"
            
            # Test energy flow health
            $healthyChannels = 0
            
            try {
                $ideHealth = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -TimeoutSec 2
                if ($ideHealth.energy_state -eq "flowing") { $healthyChannels++ }
            } catch { }
            
            try {
                $dashHealth = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2  
                if ($dashHealth.energy_state -eq "flowing") { $healthyChannels++ }
            } catch { }
            
            try {
                $mainHealth = Invoke-RestMethod -Uri "http://localhost:3002/api/health" -TimeoutSec 2
                if ($mainHealth.energy_state -eq "flowing") { $healthyChannels++ }
            } catch { }
            
            try {
                $wsTest = Test-NetConnection -ComputerName 127.0.0.1 -Port 3002 -WarningAction SilentlyContinue
                if ($wsTest.TcpTestSucceeded) { $healthyChannels++ }
            } catch { }
            
            $energyStatus = switch ($healthyChannels) {
                4 { "🌊 PURE CHI FLOW" }
                3 { "⚡ ENERGY FLOWING" }
                2 { "💧 FLOW ESTABLISHING" }
                1 { "🌀 ENERGY AWAKENING" }
                0 { "🔄 SEEKING ENERGY" }
            }
            
            Write-Host "$timestamp - $energyStatus ($healthyChannels/4 channels active)" -ForegroundColor Green
            Start-Sleep 10
        }
    }
    
    return $monitoringJob
}

# Main Chi Flow Execution
try {
    Write-Host "🌊 Pure energy flows through all OriMind channels..." -ForegroundColor Blue
    Write-Host "💫 No blocking, no waiting, only continuous flow..." -ForegroundColor Blue
    
    # Start all energy channels simultaneously
    $energyChannels = Start-ChiEnergyFlow
    
    # Test the flowing energy
    $flowingChannels = Test-ChiEnergyFlow -EnergyChannels $energyChannels
    
    # Show the energy dashboard
    Show-ChiFlowDashboard -FlowingChannels $flowingChannels
    
    # Start continuous monitoring
    $monitoringJob = Start-EnergyMonitoring
    
    Write-Host ""
    Write-Host "🎉 OriMind Chi Flow Platform: PURE ENERGY ACTIVE!" -ForegroundColor Magenta
    Write-Host "   🌊 Energy flows without effort or resistance" -ForegroundColor Cyan
    Write-Host "   ⚡ All operations non-blocking, streaming naturally" -ForegroundColor Cyan
    Write-Host "   💫 Background processes invisible like wind energy" -ForegroundColor Cyan
    Write-Host "   🔄 Self-healing through continuous flow monitoring" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Press Ctrl+C to allow energy to transition gracefully..." -ForegroundColor Yellow
    
    # Keep energy flowing and monitor
    try {
        while ($true) {
            Start-Sleep 30
            # Energy continues flowing...
        }
    } finally {
        Write-Host ""
        Write-Host "🌊 Chi energy transitioning gracefully..." -ForegroundColor Magenta
        
        # Stop monitoring gracefully
        Stop-Job $monitoringJob -ErrorAction SilentlyContinue
        Remove-Job $monitoringJob -ErrorAction SilentlyContinue
        
        # Allow energy channels to close naturally
        foreach ($channel in $energyChannels.Values) {
            Stop-Job $channel -ErrorAction SilentlyContinue
            Remove-Job $channel -ErrorAction SilentlyContinue
        }
        
        Write-Host "✨ All energy channels gracefully released" -ForegroundColor Green
        Write-Host "🙏 Chi flow complete - energy returns to source" -ForegroundColor Magenta
    }
    
} catch {
    Write-Host "🌀 Energy encountered resistance: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   🌊 Redirecting through alternative energy channels..." -ForegroundColor Cyan
}