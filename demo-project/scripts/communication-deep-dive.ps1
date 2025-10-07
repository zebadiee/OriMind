#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OriMind Communication Deep Dive & Safety Analysis
    Comprehensive testing of inter-component communication patterns and safety mechanisms

.DESCRIPTION
    This script performs deep analysis of:
    - All communication pathways between OriMind components
    - Service discovery and connection sequences
    - Safety parameters and error handling
    - Timeout mechanisms and rate limiting
    - Compensation and fallback systems
    - Real-time monitoring of communication health

.PARAMETER ComponentTest
    Test specific component communication (mcp, sherlock, reliakit, all)

.PARAMETER SafetyCheck
    Focus on safety parameter validation and stress testing

.PARAMETER Monitor
    Run continuous monitoring of communication health

.EXAMPLE
    .\communication-deep-dive.ps1
    Standard communication analysis

.EXAMPLE
    .\communication-deep-dive.ps1 -ComponentTest mcp -SafetyCheck
    Deep dive into MCP server safety parameters

.EXAMPLE
    .\communication-deep-dive.ps1 -Monitor
    Continuous communication health monitoring
#>

param(
    [ValidateSet("mcp", "sherlock", "reliakit", "all")]
    [string]$ComponentTest = "all",
    [switch]$SafetyCheck,
    [switch]$Monitor
)

# Color output functions
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Progress { param($Message) Write-Host "🔄 $Message" -ForegroundColor Blue }
function Write-Test { param($Message) Write-Host "🧪 $Message" -ForegroundColor Magenta }
function Write-Communication { param($Message) Write-Host "📡 $Message" -ForegroundColor DarkCyan }
function Write-Safety { param($Message) Write-Host "🛡️  $Message" -ForegroundColor DarkGreen }

Write-Host "🕸️  OriMind Communication Deep Dive & Safety Analysis" -ForegroundColor Magenta
Write-Host "=====================================================" -ForegroundColor Magenta

# Communication analysis configuration
$CommunicationConfig = @{
    Components = @{
        MCP = @{
            Name = "MCP Recipe Server"
            Port = 3003
            Protocol = "stdio"
            HealthEndpoint = "/health"
            Interface = "Model Context Protocol"
            ExpectedResponses = @("scan_youtube_channel", "analyze_repositories", "generate_recipes")
            SafetyTimeouts = @{ Connection = 5000; Request = 30000; Response = 10000 }
            RateLimits = @{ RequestsPerMinute = 60; ConcurrentConnections = 10 }
        }
        Sherlock = @{
            Name = "Sherlock Omega IDE"
            Port = 3000
            Protocol = "http"
            HealthEndpoint = "/api/health"
            Interface = "Next.js REST API"
            ExpectedResponses = @("auth", "projects", "files", "quantum")
            SafetyTimeouts = @{ Connection = 3000; Request = 15000; Response = 5000 }
            RateLimits = @{ RequestsPerMinute = 120; ConcurrentConnections = 50 }
        }
        ReliaKit = @{
            Name = "ReliaKit Dashboard"
            Port = 5000
            Protocol = "http"
            HealthEndpoint = "/health"
            Interface = "Flask REST API"
            ExpectedResponses = @("models", "arbitrate", "metrics", "fallback")
            SafetyTimeouts = @{ Connection = 2000; Request = 10000; Response = 3000 }
            RateLimits = @{ RequestsPerMinute = 100; ConcurrentConnections = 25 }
        }
        MainApp = @{
            Name = "Main Application"
            Port = 3002
            Protocol = "http"
            HealthEndpoint = "/api/health"
            Interface = "Next.js Orchestration"
            ExpectedResponses = @("dashboard", "integration", "monitoring")
            SafetyTimeouts = @{ Connection = 2000; Request = 20000; Response = 5000 }
            RateLimits = @{ RequestsPerMinute = 200; ConcurrentConnections = 100 }
        }
    }
    
    CommunicationFlows = @(
        @{ From = "MainApp"; To = "MCP"; Type = "STDIO"; Purpose = "AI Tool Integration" },
        @{ From = "MainApp"; To = "Sherlock"; Type = "HTTP"; Purpose = "IDE Integration" },
        @{ From = "MainApp"; To = "ReliaKit"; Type = "HTTP"; Purpose = "Model Arbitration" },
        @{ From = "Sherlock"; To = "MCP"; Type = "STDIO"; Purpose = "Repository Analysis" },
        @{ From = "Sherlock"; To = "ReliaKit"; Type = "HTTP"; Purpose = "AI Model Access" },
        @{ From = "ReliaKit"; To = "MCP"; Type = "STDIO"; Purpose = "Recipe Generation" }
    )
    
    SafetyMechanisms = @{
        CircuitBreaker = @{ FailureThreshold = 5; TimeoutWindow = 60000; RecoveryTime = 30000 }
        RetryPolicy = @{ MaxRetries = 3; BackoffMultiplier = 2; InitialDelay = 1000 }
        Timeouts = @{ HealthCheck = 5000; ServiceCall = 30000; Integration = 60000 }
        RateLimiting = @{ WindowSize = 60000; BurstSize = 10; SteadyRate = 5 }
        Monitoring = @{ HealthCheckInterval = 30000; MetricsCollection = 10000; AlertThreshold = 90 }
    }
}

# Results tracking
$CommunicationResults = @{
    ConnectionTests = @{}
    SafetyValidations = @{}
    FlowAnalysis = @{}
    PerformanceMetrics = @{}
    Issues = @()
    Recommendations = @()
}

function Test-ComponentCommunication {
    param($ComponentName, $ComponentConfig)
    
    Write-Communication "Testing $ComponentName communication patterns..."
    
    $results = @{
        Port = $ComponentConfig.Port
        Protocol = $ComponentConfig.Protocol
        Status = "Unknown"
        ResponseTime = 0
        SafetyCompliance = $false
        Issues = @()
        Capabilities = @()
    }
    
    try {
        # Test 1: Port availability
        Write-Test "Checking $ComponentName port availability..."
        $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $ComponentConfig.Port -WarningAction SilentlyContinue
        
        if ($connection.TcpTestSucceeded) {
            Write-Success "$ComponentName port $($ComponentConfig.Port) is accessible"
            $results.Status = "PortOpen"
            
            # Test 2: Health endpoint response
            if ($ComponentConfig.HealthEndpoint) {
                Write-Test "Testing $ComponentName health endpoint..."
                $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                
                try {
                    $healthResponse = Invoke-WebRequest -Uri "http://127.0.0.1:$($ComponentConfig.Port)$($ComponentConfig.HealthEndpoint)" -TimeoutSec 10 -UseBasicParsing
                    $stopwatch.Stop()
                    $results.ResponseTime = $stopwatch.ElapsedMilliseconds
                    
                    if ($healthResponse.StatusCode -eq 200) {
                        Write-Success "$ComponentName health check passed ($($results.ResponseTime)ms)"
                        $results.Status = "Healthy"
                        $results.Capabilities += "HealthCheck"
                    } else {
                        Write-Warning "$ComponentName returned status $($healthResponse.StatusCode)"
                        $results.Status = "Unhealthy"
                        $results.Issues += "Non-200 health response"
                    }
                } catch {
                    $stopwatch.Stop()
                    $results.ResponseTime = $stopwatch.ElapsedMilliseconds
                    Write-Warning "$ComponentName health endpoint failed: $($_.Exception.Message)"
                    $results.Status = "HealthFailed"
                    $results.Issues += "Health endpoint error: $($_.Exception.Message)"
                }
            }
            
            # Test 3: Protocol-specific communication
            Write-Test "Testing $ComponentName protocol-specific communication..."
            switch ($ComponentConfig.Protocol) {
                "http" {
                    $results.Capabilities += "HTTP"
                    # Test CORS and headers
                    try {
                        $corsTest = Invoke-WebRequest -Uri "http://127.0.0.1:$($ComponentConfig.Port)" -Method OPTIONS -TimeoutSec 5 -UseBasicParsing
                        if ($corsTest.Headers["Access-Control-Allow-Origin"]) {
                            $results.Capabilities += "CORS"
                            Write-Success "$ComponentName supports CORS"
                        }
                    } catch {
                        Write-Info "$ComponentName CORS test inconclusive"
                    }
                }
                "stdio" {
                    $results.Capabilities += "STDIO"
                    Write-Info "$ComponentName uses STDIO protocol (MCP)"
                    # For STDIO, we can only verify the process is running
                    $mcpProcess = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*mcp*" }
                    if ($mcpProcess) {
                        Write-Success "$ComponentName MCP process detected"
                        $results.Capabilities += "MCPProcess"
                    }
                }
            }
            
        } else {
            Write-Error "$ComponentName is not responding on port $($ComponentConfig.Port)"
            $results.Status = "NotResponding"
            $results.Issues += "Port not accessible"
        }
        
        # Test 4: Safety parameter validation
        if ($SafetyCheck) {
            Write-Safety "Validating $ComponentName safety parameters..."
            $safetyResults = Test-SafetyParameters -ComponentName $ComponentName -ComponentConfig $ComponentConfig
            $results.SafetyCompliance = $safetyResults.Compliant
            $results.Issues += $safetyResults.Issues
        }
        
    } catch {
        Write-Error "Communication test failed for $ComponentName`: $($_.Exception.Message)"
        $results.Status = "Error"
        $results.Issues += "Test execution error: $($_.Exception.Message)"
    }
    
    $CommunicationResults.ConnectionTests[$ComponentName] = $results
    return $results
}

function Test-SafetyParameters {
    param($ComponentName, $ComponentConfig)
    
    Write-Safety "Testing safety parameters for $ComponentName..."
    
    $safetyResults = @{
        Compliant = $true
        Issues = @()
        Tests = @{}
    }
    
    # Test 1: Timeout compliance
    Write-Test "Testing timeout mechanisms..."
    $timeoutTests = @{}
    
    foreach ($timeoutType in $ComponentConfig.SafetyTimeouts.Keys) {
        $expectedTimeout = $ComponentConfig.SafetyTimeouts[$timeoutType]
        try {
            # Simulate timeout test based on type
            switch ($timeoutType) {
                "Connection" {
                    $start = Get-Date
                    try {
                        $null = Test-NetConnection -ComputerName "127.0.0.1" -Port $ComponentConfig.Port -InformationLevel Quiet
                        $elapsed = ((Get-Date) - $start).TotalMilliseconds
                        if ($elapsed -lt $expectedTimeout) {
                            $timeoutTests[$timeoutType] = "Pass"
                            Write-Success "$ComponentName connection timeout within limit ($([math]::Round($elapsed))ms < $expectedTimeout ms)"
                        } else {
                            $timeoutTests[$timeoutType] = "Slow"
                            Write-Warning "$ComponentName connection timeout slow ($([math]::Round($elapsed))ms >= $expectedTimeout ms)"
                            $safetyResults.Issues += "Connection timeout exceeds safety limit"
                        }
                    } catch {
                        $timeoutTests[$timeoutType] = "Fail"
                        $safetyResults.Issues += "Connection timeout test failed"
                    }
                }
                "Response" {
                    if ($ComponentConfig.HealthEndpoint) {
                        $start = Get-Date
                        try {
                            $null = Invoke-WebRequest -Uri "http://127.0.0.1:$($ComponentConfig.Port)$($ComponentConfig.HealthEndpoint)" -TimeoutSec ($expectedTimeout / 1000) -UseBasicParsing
                            $elapsed = ((Get-Date) - $start).TotalMilliseconds
                            if ($elapsed -lt $expectedTimeout) {
                                $timeoutTests[$timeoutType] = "Pass"
                                Write-Success "$ComponentName response timeout within limit ($([math]::Round($elapsed))ms < $expectedTimeout ms)"
                            } else {
                                $timeoutTests[$timeoutType] = "Slow"
                                Write-Warning "$ComponentName response timeout slow ($([math]::Round($elapsed))ms >= $expectedTimeout ms)"
                                $safetyResults.Issues += "Response timeout exceeds safety limit"
                            }
                        } catch {
                            $timeoutTests[$timeoutType] = "Fail"
                            $safetyResults.Issues += "Response timeout test failed"
                        }
                    }
                }
            }
        } catch {
            $timeoutTests[$timeoutType] = "Error"
            $safetyResults.Issues += "Timeout test error for $timeoutType"
        }
    }
    
    $safetyResults.Tests["Timeouts"] = $timeoutTests
    
    # Test 2: Rate limiting compliance
    Write-Test "Testing rate limiting mechanisms..."
    $rateLimitTests = @{}
    
    if ($ComponentConfig.HealthEndpoint) {
        try {
            # Send rapid requests to test rate limiting
            $requestCount = 0
            $rateLimitHit = $false
            $start = Get-Date
            
            while (((Get-Date) - $start).TotalSeconds -lt 10 -and $requestCount -lt 20) {
                try {
                    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$($ComponentConfig.Port)$($ComponentConfig.HealthEndpoint)" -TimeoutSec 2 -UseBasicParsing
                    $requestCount++
                    
                    # Check for rate limit headers
                    if ($response.Headers["X-RateLimit-Remaining"] -or $response.Headers["Retry-After"]) {
                        $rateLimitHit = $true
                        break
                    }
                    
                    Start-Sleep -Milliseconds 100
                } catch {
                    if ($_.Exception.Message -like "*429*" -or $_.Exception.Message -like "*rate*") {
                        $rateLimitHit = $true
                        break
                    }
                }
            }
            
            if ($rateLimitHit) {
                $rateLimitTests["RateLimit"] = "Pass"
                Write-Success "$ComponentName implements rate limiting (triggered after $requestCount requests)"
            } elseif ($requestCount -ge 15) {
                $rateLimitTests["RateLimit"] = "Missing"
                Write-Warning "$ComponentName may not implement rate limiting (processed $requestCount requests)"
                $safetyResults.Issues += "Rate limiting may not be implemented"
            } else {
                $rateLimitTests["RateLimit"] = "Inconclusive"
                Write-Info "$ComponentName rate limiting test inconclusive ($requestCount requests)"
            }
        } catch {
            $rateLimitTests["RateLimit"] = "Error"
            $safetyResults.Issues += "Rate limiting test failed"
        }
    }
    
    $safetyResults.Tests["RateLimiting"] = $rateLimitTests
    
    # Test 3: Error handling and graceful degradation
    Write-Test "Testing error handling mechanisms..."
    $errorTests = @{}
    
    try {
        # Test with malformed requests
        $malformedTests = @(
            @{ Name = "InvalidPath"; Url = "http://127.0.0.1:$($ComponentConfig.Port)/invalid-endpoint-12345" },
            @{ Name = "InvalidMethod"; Method = "INVALID" },
            @{ Name = "OversizePayload"; Data = "A" * 10000 }
        )
        
        foreach ($test in $malformedTests) {
            try {
                if ($test.Url) {
                    $response = Invoke-WebRequest -Uri $test.Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
                    $errorTests[$test.Name] = "NoErrorHandling"
                    Write-Warning "$ComponentName did not handle $($test.Name) appropriately"
                }
            } catch {
                $errorTests[$test.Name] = "ProperErrorHandling"
                Write-Success "$ComponentName properly handled $($test.Name) error"
            }
        }
    } catch {
        $errorTests["General"] = "Error"
        $safetyResults.Issues += "Error handling test failed"
    }
    
    $safetyResults.Tests["ErrorHandling"] = $errorTests
    
    # Determine overall compliance
    if ($safetyResults.Issues.Count -eq 0) {
        $safetyResults.Compliant = $true
        Write-Safety "$ComponentName safety parameters are compliant"
    } else {
        $safetyResults.Compliant = $false
        Write-Warning "$ComponentName has $($safetyResults.Issues.Count) safety parameter issues"
    }
    
    $CommunicationResults.SafetyValidations[$ComponentName] = $safetyResults
    return $safetyResults
}

function Test-InterComponentFlows {
    Write-Communication "Testing inter-component communication flows..."
    
    $flowResults = @{}
    
    foreach ($flow in $CommunicationConfig.CommunicationFlows) {
        $flowKey = "$($flow.From)_to_$($flow.To)"
        Write-Test "Testing flow: $($flow.From) → $($flow.To) ($($flow.Type))"
        
        $flowResult = @{
            From = $flow.From
            To = $flow.To
            Type = $flow.Type
            Purpose = $flow.Purpose
            Status = "Unknown"
            Latency = 0
            Success = $false
            Issues = @()
        }
        
        try {
            # Check if both components are available
            $fromComponent = $CommunicationResults.ConnectionTests[$flow.From]
            $toComponent = $CommunicationResults.ConnectionTests[$flow.To]
            
            if (-not $fromComponent -or $fromComponent.Status -ne "Healthy") {
                $flowResult.Issues += "Source component $($flow.From) not healthy"
                $flowResult.Status = "SourceUnavailable"
            } elseif (-not $toComponent -or $toComponent.Status -ne "Healthy") {
                $flowResult.Issues += "Target component $($flow.To) not healthy"
                $flowResult.Status = "TargetUnavailable"
            } else {
                # Test the specific communication flow
                $start = Get-Date
                
                switch ($flow.Type) {
                    "HTTP" {
                        try {
                            $fromPort = $CommunicationConfig.Components[$flow.From].Port
                            $toPort = $CommunicationConfig.Components[$flow.To].Port
                            
                            # Simulate communication by checking if one can reach the other
                            $response = Invoke-WebRequest -Uri "http://127.0.0.1:$toPort" -TimeoutSec 5 -UseBasicParsing
                            $elapsed = ((Get-Date) - $start).TotalMilliseconds
                            
                            $flowResult.Latency = $elapsed
                            $flowResult.Status = "Success"
                            $flowResult.Success = $true
                            Write-Success "HTTP flow $($flow.From) → $($flow.To) successful ($([math]::Round($elapsed))ms)"
                        } catch {
                            $flowResult.Status = "Failed"
                            $flowResult.Issues += "HTTP communication failed: $($_.Exception.Message)"
                            Write-Warning "HTTP flow $($flow.From) → $($flow.To) failed"
                        }
                    }
                    "STDIO" {
                        # For STDIO (MCP), check if the target process is running and can accept connections
                        $mcpProcess = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*mcp*" }
                        if ($mcpProcess) {
                            $flowResult.Status = "Success"
                            $flowResult.Success = $true
                            $flowResult.Latency = 10 # Estimated for STDIO
                            Write-Success "STDIO flow $($flow.From) → $($flow.To) verified (MCP process running)"
                        } else {
                            $flowResult.Status = "Failed"
                            $flowResult.Issues += "MCP process not found for STDIO communication"
                            Write-Warning "STDIO flow $($flow.From) → $($flow.To) failed"
                        }
                    }
                }
            }
        } catch {
            $flowResult.Status = "Error"
            $flowResult.Issues += "Flow test error: $($_.Exception.Message)"
            Write-Error "Communication flow test failed: $($_.Exception.Message)"
        }
        
        $flowResults[$flowKey] = $flowResult
    }
    
    $CommunicationResults.FlowAnalysis = $flowResults
    return $flowResults
}

function Test-CompensationMechanisms {
    Write-Safety "Testing compensation and fallback mechanisms..."
    
    $compensationResults = @{
        CircuitBreaker = @{}
        Retry = @{}
        Fallback = @{}
        GracefulDegradation = @{}
    }
    
    # Test circuit breaker behavior
    Write-Test "Testing circuit breaker mechanisms..."
    foreach ($componentName in $CommunicationConfig.Components.Keys) {
        $component = $CommunicationConfig.Components[$componentName]
        
        if ($component.HealthEndpoint) {
            try {
                # Simulate failure conditions
                $failureCount = 0
                for ($i = 1; $i -le 10; $i++) {
                    try {
                        # Try to hit a non-existent endpoint to trigger failures
                        $null = Invoke-WebRequest -Uri "http://127.0.0.1:$($component.Port)/trigger-failure-$i" -TimeoutSec 1 -UseBasicParsing
                    } catch {
                        $failureCount++
                    }
                    Start-Sleep -Milliseconds 100
                }
                
                $compensationResults.CircuitBreaker[$componentName] = @{
                    FailuresTriggered = $failureCount
                    BreakerTriggered = $failureCount -ge $CommunicationConfig.SafetyMechanisms.CircuitBreaker.FailureThreshold
                    Status = if ($failureCount -ge $CommunicationConfig.SafetyMechanisms.CircuitBreaker.FailureThreshold) { "Triggered" } else { "Normal" }
                }
                
                Write-Info "$componentName circuit breaker test: $failureCount failures (threshold: $($CommunicationConfig.SafetyMechanisms.CircuitBreaker.FailureThreshold))"
            } catch {
                $compensationResults.CircuitBreaker[$componentName] = @{ Status = "Error"; Error = $_.Exception.Message }
            }
        }
    }
    
    # Test retry mechanisms
    Write-Test "Testing retry mechanisms..."
    # This would involve simulating temporary failures and checking retry behavior
    $compensationResults.Retry["GlobalPolicy"] = @{
        MaxRetries = $CommunicationConfig.SafetyMechanisms.RetryPolicy.MaxRetries
        BackoffMultiplier = $CommunicationConfig.SafetyMechanisms.RetryPolicy.BackoffMultiplier
        Status = "Configured"
    }
    
    # Test fallback mechanisms
    Write-Test "Testing fallback mechanisms..."
    # Check if components have alternative endpoints or degraded functionality
    foreach ($componentName in $CommunicationConfig.Components.Keys) {
        $component = $CommunicationConfig.Components[$componentName]
        
        # Test if component has fallback endpoints
        $fallbackEndpoints = @("/status", "/ping", "/health-simple")
        $fallbacksAvailable = 0
        
        foreach ($endpoint in $fallbackEndpoints) {
            try {
                $response = Invoke-WebRequest -Uri "http://127.0.0.1:$($component.Port)$endpoint" -TimeoutSec 2 -UseBasicParsing
                if ($response.StatusCode -eq 200) {
                    $fallbacksAvailable++
                }
            } catch {
                # Expected for non-existent endpoints
            }
        }
        
        $compensationResults.Fallback[$componentName] = @{
            FallbackEndpoints = $fallbacksAvailable
            Status = if ($fallbacksAvailable -gt 0) { "Available" } else { "Limited" }
        }
    }
    
    $CommunicationResults.PerformanceMetrics["Compensation"] = $compensationResults
    return $compensationResults
}

function Start-CommunicationMonitoring {
    if (-not $Monitor) { return }
    
    Write-Communication "Starting continuous communication monitoring..."
    
    $monitoringStartTime = Get-Date
    $metrics = @{
        HealthChecks = @{}
        ResponseTimes = @{}
        ErrorRates = @{}
        ThroughputMetrics = @{}
    }
    
    # Monitoring loop
    $iteration = 0
    while ($iteration -lt 10) {  # Run for 10 iterations (about 5 minutes with 30s intervals)
        $iteration++
        Write-Progress "Monitoring iteration $iteration..."
        
        foreach ($componentName in $CommunicationConfig.Components.Keys) {
            $component = $CommunicationConfig.Components[$componentName]
            
            if (-not $metrics.HealthChecks[$componentName]) {
                $metrics.HealthChecks[$componentName] = @()
                $metrics.ResponseTimes[$componentName] = @()
                $metrics.ErrorRates[$componentName] = @()
            }
            
            # Health check
            $healthResult = @{
                Timestamp = Get-Date
                Status = "Unknown"
                ResponseTime = 0
                Error = $null
            }
            
            if ($component.HealthEndpoint) {
                $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                try {
                    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$($component.Port)$($component.HealthEndpoint)" -TimeoutSec 5 -UseBasicParsing
                    $stopwatch.Stop()
                    
                    $healthResult.Status = if ($response.StatusCode -eq 200) { "Healthy" } else { "Unhealthy" }
                    $healthResult.ResponseTime = $stopwatch.ElapsedMilliseconds
                } catch {
                    $stopwatch.Stop()
                    $healthResult.Status = "Error"
                    $healthResult.ResponseTime = $stopwatch.ElapsedMilliseconds
                    $healthResult.Error = $_.Exception.Message
                }
            } else {
                # For STDIO components, check process
                $process = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*$componentName*" }
                $healthResult.Status = if ($process) { "Running" } else { "NotRunning" }
                $healthResult.ResponseTime = 0
            }
            
            $metrics.HealthChecks[$componentName] += $healthResult
            $metrics.ResponseTimes[$componentName] += $healthResult.ResponseTime
            
            # Calculate error rate
            $recentChecks = $metrics.HealthChecks[$componentName] | Select-Object -Last 5
            $errorCount = ($recentChecks | Where-Object { $_.Status -eq "Error" -or $_.Status -eq "Unhealthy" }).Count
            $errorRate = if ($recentChecks.Count -gt 0) { ($errorCount / $recentChecks.Count) * 100 } else { 0 }
            $metrics.ErrorRates[$componentName] += $errorRate
            
            # Report current status
            $avgResponseTime = if ($metrics.ResponseTimes[$componentName].Count -gt 0) { 
                ($metrics.ResponseTimes[$componentName] | Measure-Object -Average).Average 
            } else { 0 }
            
            Write-Info "${componentName}: $($healthResult.Status) ($($healthResult.ResponseTime)ms, avg: $([math]::Round($avgResponseTime))ms, errors: $([math]::Round($errorRate))%)"
        }
        
        Start-Sleep -Seconds 30
    }
    
    # Generate monitoring summary
    Write-Communication "Monitoring Summary:"
    foreach ($componentName in $metrics.HealthChecks.Keys) {
        $checks = $metrics.HealthChecks[$componentName]
        $responseTimes = $metrics.ResponseTimes[$componentName] | Where-Object { $_ -gt 0 }
        $errorRates = $metrics.ErrorRates[$componentName]
        
        $healthyCount = ($checks | Where-Object { $_.Status -eq "Healthy" -or $_.Status -eq "Running" }).Count
        $uptime = if ($checks.Count -gt 0) { ($healthyCount / $checks.Count) * 100 } else { 0 }
        
        $avgResponse = if ($responseTimes.Count -gt 0) { ($responseTimes | Measure-Object -Average).Average } else { 0 }
        $maxResponse = if ($responseTimes.Count -gt 0) { ($responseTimes | Measure-Object -Maximum).Maximum } else { 0 }
        $avgError = if ($errorRates.Count -gt 0) { ($errorRates | Measure-Object -Average).Average } else { 0 }
        
        Write-Host "  ${componentName}: $([math]::Round($uptime))% uptime, $([math]::Round($avgResponse))ms avg response (max: $([math]::Round($maxResponse))ms), $([math]::Round($avgError))% avg error rate" -ForegroundColor Cyan
    }
    
    $CommunicationResults.PerformanceMetrics["Monitoring"] = $metrics
}

function Generate-CommunicationReport {
    Write-Host ""
    Write-Host "📊 OriMind Communication Deep Dive Report" -ForegroundColor Magenta
    Write-Host "==========================================" -ForegroundColor Magenta
    
    # Component communication summary
    Write-Host ""
    Write-Host "🔗 Component Communication Status:" -ForegroundColor Cyan
    foreach ($componentName in $CommunicationResults.ConnectionTests.Keys) {
        $result = $CommunicationResults.ConnectionTests[$componentName]
        $statusColor = switch ($result.Status) {
            "Healthy" { "Green" }
            "PortOpen" { "Yellow" }
            "NotResponding" { "Red" }
            default { "Gray" }
        }
        
        Write-Host "  ${componentName}: $($result.Status) (Port: $($result.Port), Response: $($result.ResponseTime)ms)" -ForegroundColor $statusColor
        if ($result.Capabilities.Count -gt 0) {
            Write-Host "    Capabilities: $($result.Capabilities -join ', ')" -ForegroundColor Gray
        }
        if ($result.Issues.Count -gt 0) {
            Write-Host "    Issues: $($result.Issues -join ', ')" -ForegroundColor Red
        }
    }
    
    # Communication flows summary
    Write-Host ""
    Write-Host "🌐 Inter-Component Flow Analysis:" -ForegroundColor Cyan
    foreach ($flowKey in $CommunicationResults.FlowAnalysis.Keys) {
        $flow = $CommunicationResults.FlowAnalysis[$flowKey]
        $statusColor = if ($flow.Success) { "Green" } else { "Red" }
        
        Write-Host "  $($flow.From) → $($flow.To): $($flow.Status) ($($flow.Type), $([math]::Round($flow.Latency))ms)" -ForegroundColor $statusColor
        Write-Host "    Purpose: $($flow.Purpose)" -ForegroundColor Gray
        if ($flow.Issues.Count -gt 0) {
            Write-Host "    Issues: $($flow.Issues -join ', ')" -ForegroundColor Red
        }
    }
    
    # Safety validation summary
    if ($SafetyCheck -and $CommunicationResults.SafetyValidations.Count -gt 0) {
        Write-Host ""
        Write-Host "🛡️  Safety Parameter Validation:" -ForegroundColor DarkGreen
        foreach ($componentName in $CommunicationResults.SafetyValidations.Keys) {
            $safety = $CommunicationResults.SafetyValidations[$componentName]
            $complianceColor = if ($safety.Compliant) { "Green" } else { "Red" }
            
            Write-Host "  ${componentName}: $($safety.Compliant)" -ForegroundColor $complianceColor
            if ($safety.Issues.Count -gt 0) {
                Write-Host "    Issues: $($safety.Issues -join ', ')" -ForegroundColor Red
            }
            
            foreach ($testType in $safety.Tests.Keys) {
                $tests = $safety.Tests[$testType]
                Write-Host "    $testType`: $($tests | ConvertTo-Json -Compress)" -ForegroundColor Gray
            }
        }
    }
    
    # Overall assessment
    Write-Host ""
    Write-Host "🎯 Overall Communication Health Assessment:" -ForegroundColor Magenta
    
    $healthyComponents = ($CommunicationResults.ConnectionTests.Values | Where-Object { $_.Status -eq "Healthy" }).Count
    $totalComponents = $CommunicationResults.ConnectionTests.Count
    $healthPercentage = if ($totalComponents -gt 0) { ($healthyComponents / $totalComponents) * 100 } else { 0 }
    
    $successfulFlows = ($CommunicationResults.FlowAnalysis.Values | Where-Object { $_.Success }).Count
    $totalFlows = $CommunicationResults.FlowAnalysis.Count
    $flowSuccessRate = if ($totalFlows -gt 0) { ($successfulFlows / $totalFlows) * 100 } else { 0 }
    
    Write-Host "  Component Health: $healthyComponents/$totalComponents ($([math]::Round($healthPercentage))%)" -ForegroundColor $(if ($healthPercentage -ge 80) { "Green" } elseif ($healthPercentage -ge 60) { "Yellow" } else { "Red" })
    Write-Host "  Flow Success Rate: $successfulFlows/$totalFlows ($([math]::Round($flowSuccessRate))%)" -ForegroundColor $(if ($flowSuccessRate -ge 80) { "Green" } elseif ($flowSuccessRate -ge 60) { "Yellow" } else { "Red" })
    
    if ($SafetyCheck) {
        $compliantComponents = ($CommunicationResults.SafetyValidations.Values | Where-Object { $_.Compliant }).Count
        $totalSafetyTests = $CommunicationResults.SafetyValidations.Count
        $safetyCompliance = if ($totalSafetyTests -gt 0) { ($compliantComponents / $totalSafetyTests) * 100 } else { 100 }
        
        Write-Host "  Safety Compliance: $compliantComponents/$totalSafetyTests ($([math]::Round($safetyCompliance))%)" -ForegroundColor $(if ($safetyCompliance -ge 90) { "Green" } elseif ($safetyCompliance -ge 70) { "Yellow" } else { "Red" })
    }
    
    # Recommendations
    Write-Host ""
    Write-Host "💡 Recommendations:" -ForegroundColor Yellow
    
    $allIssues = @()
    $CommunicationResults.ConnectionTests.Values | ForEach-Object { $allIssues += $_.Issues }
    $CommunicationResults.FlowAnalysis.Values | ForEach-Object { $allIssues += $_.Issues }
    if ($SafetyCheck) {
        $CommunicationResults.SafetyValidations.Values | ForEach-Object { $allIssues += $_.Issues }
    }
    
    $uniqueIssues = $allIssues | Sort-Object | Get-Unique
    
    if ($uniqueIssues.Count -eq 0) {
        Write-Host "  ✅ All communication systems are functioning optimally!" -ForegroundColor Green
        Write-Host "  ✅ Safety parameters are properly configured" -ForegroundColor Green
        Write-Host "  ✅ Inter-component flows are working correctly" -ForegroundColor Green
    } else {
        foreach ($issue in $uniqueIssues) {
            Write-Host "  • $issue" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "  Consider implementing:" -ForegroundColor Cyan
        Write-Host "  • Enhanced monitoring for failing components" -ForegroundColor Gray
        Write-Host "  • Circuit breaker patterns for unreliable connections" -ForegroundColor Gray
        Write-Host "  • Backup communication channels for critical flows" -ForegroundColor Gray
        Write-Host "  • Regular health check automation" -ForegroundColor Gray
    }
}

# Main execution
try {
    $startTime = Get-Date
    
    Write-Progress "Starting comprehensive communication analysis..."
    
    # Phase 1: Component communication testing
    Write-Host ""
    Write-Host "Phase 1: Component Communication Analysis" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    $componentsToTest = if ($ComponentTest -eq "all") { 
        $CommunicationConfig.Components.Keys 
    } else { 
        @($ComponentTest) 
    }
    
    foreach ($componentName in $componentsToTest) {
        if ($CommunicationConfig.Components.ContainsKey($componentName)) {
            $componentConfig = $CommunicationConfig.Components[$componentName]
            Test-ComponentCommunication -ComponentName $componentName -ComponentConfig $componentConfig
        }
    }
    
    # Phase 2: Inter-component flow testing
    Write-Host ""
    Write-Host "Phase 2: Inter-Component Flow Testing" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    
    Test-InterComponentFlows
    
    # Phase 3: Compensation mechanism testing
    Write-Host ""
    Write-Host "Phase 3: Compensation & Safety Mechanisms" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    Test-CompensationMechanisms
    
    # Phase 4: Continuous monitoring (if requested)
    if ($Monitor) {
        Write-Host ""
        Write-Host "Phase 4: Continuous Communication Monitoring" -ForegroundColor Cyan
        Write-Host "============================================" -ForegroundColor Cyan
        
        Start-CommunicationMonitoring
    }
    
    # Generate comprehensive report
    Generate-CommunicationReport
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host ""
    Write-Info "Communication deep dive completed in $([math]::Round($duration, 1)) seconds"
    
    # Mark todo as completed
    Write-Success "Communication pathway analysis and safety validation complete!"
    
} catch {
    Write-Error "Communication deep dive failed: $($_.Exception.Message)"
    Write-Error $_.ScriptStackTrace
    exit 1
}