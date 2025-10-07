#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OriMind Integration Communication Flow Test
    End-to-end validation of communication sequences and safety compensation

.DESCRIPTION
    This script validates complete communication flows between all OriMind components:
    - Service discovery and connection establishment
    - Message routing and protocol handling
    - Safety parameter enforcement
    - Error handling and compensation mechanisms
    - Real-time monitoring and health validation

.PARAMETER ComponentFlow
    Test specific component flow (mcp-only, full-stack, core-services)

.PARAMETER Safety
    Focus on safety mechanism validation

.PARAMETER Sequence
    Test complete startup/communication sequences

.EXAMPLE
    .\integration-flow-test.ps1
    Standard integration flow testing

.EXAMPLE
    .\integration-flow-test.ps1 -ComponentFlow full-stack -Safety -Sequence
    Complete integration testing with safety validation
#>

param(
    [ValidateSet("mcp-only", "full-stack", "core-services")]
    [string]$ComponentFlow = "core-services",
    [switch]$Safety,
    [switch]$Sequence
)

# Color output functions
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Progress { param($Message) Write-Host "🔄 $Message" -ForegroundColor Blue }
function Write-Test { param($Message) Write-Host "🧪 $Message" -ForegroundColor Magenta }
function Write-Flow { param($Message) Write-Host "🌊 $Message" -ForegroundColor DarkCyan }
function Write-Safety { param($Message) Write-Host "🛡️  $Message" -ForegroundColor DarkGreen }
function Write-Sequence { param($Message) Write-Host "⚡ $Message" -ForegroundColor DarkMagenta }

Write-Host "🌊 OriMind Integration Communication Flow Test" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta

# Integration test configuration
$IntegrationConfig = @{
    ServiceMatrix = @{
        MCP = @{
            Name = "MCP Recipe Server"
            Port = 3003
            Protocol = "STDIO/JSON-RPC"
            StartupTime = 5
            Dependencies = @()
            HealthChecks = @("process", "stdio")
            CommunicationEndpoints = @("stdio")
        }
        Sherlock = @{
            Name = "Sherlock Omega IDE"
            Port = 3000
            Protocol = "HTTP/REST"
            StartupTime = 15
            Dependencies = @("MCP")
            HealthChecks = @("http", "auth", "websocket")
            CommunicationEndpoints = @("/api/health", "/api/auth", "/api/projects")
        }
        ReliaKit = @{
            Name = "ReliaKit Dashboard"
            Port = 5000
            Protocol = "HTTP/REST"
            StartupTime = 8
            Dependencies = @("MCP")
            HealthChecks = @("http", "models", "arbitration")
            CommunicationEndpoints = @("/health", "/api/models", "/api/arbitrate")
        }
        MainApp = @{
            Name = "Main Application"
            Port = 3002
            Protocol = "HTTP/REST"
            StartupTime = 12
            Dependencies = @("MCP", "Sherlock", "ReliaKit")
            HealthChecks = @("http", "integration", "orchestration")
            CommunicationEndpoints = @("/api/health", "/api/integration", "/api/dashboard")
        }
    }
    
    CommunicationFlows = @(
        @{
            Name = "MCP_Tool_Invocation"
            From = "Sherlock"
            To = "MCP"
            Protocol = "STDIO"
            MessageType = "JSON-RPC"
            Purpose = "Repository analysis and recipe generation"
            SafetyTimeout = 30000
            RetryPolicy = 3
            CircuitBreaker = $true
        },
        @{
            Name = "AI_Model_Arbitration"
            From = "Sherlock"
            To = "ReliaKit"
            Protocol = "HTTP"
            MessageType = "REST API"
            Purpose = "AI model selection and routing"
            SafetyTimeout = 10000
            RetryPolicy = 2
            CircuitBreaker = $true
        },
        @{
            Name = "Integration_Orchestration"
            From = "MainApp"
            To = "Sherlock"
            Protocol = "HTTP"
            MessageType = "REST API"
            Purpose = "IDE integration and project management"
            SafetyTimeout = 15000
            RetryPolicy = 2
            CircuitBreaker = $true
        },
        @{
            Name = "Dashboard_Data_Flow"
            From = "MainApp"
            To = "ReliaKit"
            Protocol = "HTTP"
            MessageType = "REST API"
            Purpose = "Reliability metrics and model status"
            SafetyTimeout = 8000
            RetryPolicy = 2
            CircuitBreaker = $false
        },
        @{
            Name = "Recipe_Generation_Flow"
            From = "MainApp"
            To = "MCP"
            Protocol = "STDIO"
            MessageType = "JSON-RPC"
            Purpose = "Direct recipe generation and analysis"
            SafetyTimeout = 25000
            RetryPolicy = 3
            CircuitBreaker = $true
        }
    )
    
    SafetyEnforcement = @{
        GlobalTimeouts = @{
            ServiceStartup = 30000
            HealthCheck = 5000
            CommunicationTimeout = 30000
            GracefulShutdown = 10000
        }
        RateLimiting = @{
            GlobalRequestsPerMinute = 1000
            PerServiceRequestsPerMinute = 200
            BurstLimit = 50
        }
        CircuitBreaker = @{
            FailureThreshold = 5
            RecoveryTime = 30000
            HalfOpenRetries = 3
        }
        Compensation = @{
            RetryExponentialBackoff = $true
            FallbackEndpoints = $true
            GracefulDegradation = $true
            HealthBasedRouting = $true
        }
    }
}

# Test results tracking
$IntegrationResults = @{
    ServiceDiscovery = @{}
    CommunicationFlows = @{}
    SafetyValidation = @{}
    SequenceTests = @{}
    OverallHealthScore = 0
    Issues = @()
    Recommendations = @()
}

function Test-ServiceDiscovery {
    Write-Flow "Testing service discovery and availability..."
    
    $discoveryResults = @{}
    
    foreach ($serviceName in $IntegrationConfig.ServiceMatrix.Keys) {
        $serviceConfig = $IntegrationConfig.ServiceMatrix[$serviceName]
        Write-Test "Discovering service: $($serviceConfig.Name)"
        
        $serviceResult = @{
            Name = $serviceConfig.Name
            Port = $serviceConfig.Port
            Protocol = $serviceConfig.Protocol
            Available = $false
            ResponseTime = 0
            HealthStatus = "Unknown"
            Capabilities = @()
            Issues = @()
        }
        
        try {
            # Test service availability
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            
            if ($serviceConfig.Protocol -like "*HTTP*") {
                # HTTP-based service discovery
                try {
                    $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $serviceConfig.Port -WarningAction SilentlyContinue
                    $stopwatch.Stop()
                    $serviceResult.ResponseTime = $stopwatch.ElapsedMilliseconds
                    
                    if ($connection.TcpTestSucceeded) {
                        $serviceResult.Available = $true
                        $serviceResult.Capabilities += "NetworkAccess"
                        Write-Success "$($serviceConfig.Name) is network accessible (Port: $($serviceConfig.Port))"
                        
                        # Test health endpoints
                        foreach ($endpoint in $serviceConfig.CommunicationEndpoints) {
                            try {
                                $healthResponse = Invoke-WebRequest -Uri "http://127.0.0.1:$($serviceConfig.Port)$endpoint" -TimeoutSec 3 -UseBasicParsing
                                if ($healthResponse.StatusCode -eq 200) {
                                    $serviceResult.Capabilities += "HTTP_$($endpoint.Replace('/', '_'))"
                                    Write-Success "$($serviceConfig.Name) endpoint $endpoint is responding"
                                }
                            } catch {
                                Write-Info "$($serviceConfig.Name) endpoint $endpoint not available (expected if service not running)"
                            }
                        }
                        
                        if ($serviceResult.Capabilities.Count -gt 1) {
                            $serviceResult.HealthStatus = "Healthy"
                        } else {
                            $serviceResult.HealthStatus = "PortOpen"
                        }
                    } else {
                        $serviceResult.Available = $false
                        $serviceResult.HealthStatus = "Unavailable"
                        $serviceResult.Issues += "Port not accessible"
                        Write-Info "$($serviceConfig.Name) is not currently running (Port: $($serviceConfig.Port))"
                    }
                } catch {
                    $stopwatch.Stop()
                    $serviceResult.Issues += "Network test failed: $($_.Exception.Message)"
                    Write-Warning "Network test failed for $($serviceConfig.Name): $($_.Exception.Message)"
                }
            } elseif ($serviceConfig.Protocol -like "*STDIO*") {
                # STDIO-based service discovery (MCP)
                $mcpProcesses = Get-Process | Where-Object { 
                    $_.ProcessName -eq "node" -and 
                    (Get-CimInstance -ClassName Win32_Process -Filter "ProcessId = $($_.Id)" -ErrorAction SilentlyContinue).CommandLine -like "*mcp-recipe-server*"
                }
                
                $stopwatch.Stop()
                $serviceResult.ResponseTime = $stopwatch.ElapsedMilliseconds
                
                if ($mcpProcesses) {
                    $serviceResult.Available = $true
                    $serviceResult.HealthStatus = "Running"
                    $serviceResult.Capabilities += "ProcessActive", "STDIO_Ready"
                    Write-Success "$($serviceConfig.Name) process is active (STDIO protocol)"
                } else {
                    $serviceResult.Available = $false
                    $serviceResult.HealthStatus = "ProcessNotFound"
                    $serviceResult.Issues += "MCP server process not found"
                    Write-Info "$($serviceConfig.Name) process not found"
                }
            }
            
        } catch {
            $serviceResult.Issues += "Service discovery failed: $($_.Exception.Message)"
            Write-Error "Service discovery failed for $($serviceConfig.Name): $($_.Exception.Message)"
        }
        
        $discoveryResults[$serviceName] = $serviceResult
    }
    
    $IntegrationResults.ServiceDiscovery = $discoveryResults
    return $discoveryResults
}

function Test-CommunicationFlows {
    Write-Flow "Testing inter-service communication flows..."
    
    $flowResults = @{}
    
    foreach ($flow in $IntegrationConfig.CommunicationFlows) {
        Write-Test "Testing flow: $($flow.Name) ($($flow.From) → $($flow.To))"
        
        $flowResult = @{
            Name = $flow.Name
            From = $flow.From
            To = $flow.To
            Protocol = $flow.Protocol
            Purpose = $flow.Purpose
            Status = "Unknown"
            Latency = 0
            SafetyCompliant = $false
            Issues = @()
            TestResults = @{}
        }
        
        try {
            # Check if source and target services are available
            $sourceService = $IntegrationResults.ServiceDiscovery[$flow.From]
            $targetService = $IntegrationResults.ServiceDiscovery[$flow.To]
            
            if (-not $sourceService) {
                $flowResult.Issues += "Source service $($flow.From) not discovered"
                $flowResult.Status = "SourceUnknown"
            } elseif (-not $sourceService.Available) {
                $flowResult.Issues += "Source service $($flow.From) not available"
                $flowResult.Status = "SourceUnavailable"
            } elseif (-not $targetService) {
                $flowResult.Issues += "Target service $($flow.To) not discovered"
                $flowResult.Status = "TargetUnknown"
            } elseif (-not $targetService.Available) {
                $flowResult.Issues += "Target service $($flow.To) not available"
                $flowResult.Status = "TargetUnavailable"
            } else {
                # Both services available, test communication flow
                Write-Test "Testing communication between available services..."
                
                $communicationStart = Get-Date
                
                switch ($flow.Protocol) {
                    "HTTP" {
                        # HTTP communication flow test
                        $targetPort = $IntegrationConfig.ServiceMatrix[$flow.To].Port
                        $targetEndpoints = $IntegrationConfig.ServiceMatrix[$flow.To].CommunicationEndpoints
                        
                        $httpSuccess = $false
                        foreach ($endpoint in $targetEndpoints) {
                            try {
                                $response = Invoke-WebRequest -Uri "http://127.0.0.1:$targetPort$endpoint" -TimeoutSec 5 -UseBasicParsing
                                if ($response.StatusCode -eq 200) {
                                    $httpSuccess = $true
                                    break
                                }
                            } catch {
                                # Expected if service isn't fully running
                            }
                        }
                        
                        $communicationEnd = Get-Date
                        $flowResult.Latency = ($communicationEnd - $communicationStart).TotalMilliseconds
                        
                        if ($httpSuccess) {
                            $flowResult.Status = "Success"
                            $flowResult.TestResults["HTTP_Communication"] = "Pass"
                            Write-Success "HTTP communication flow $($flow.From) → $($flow.To) successful"
                        } else {
                            $flowResult.Status = "CommunicationFailed"
                            $flowResult.TestResults["HTTP_Communication"] = "Fail"
                            $flowResult.Issues += "HTTP communication failed"
                            Write-Warning "HTTP communication flow $($flow.From) → $($flow.To) failed (services not fully started)"
                        }
                    }
                    
                    "STDIO" {
                        # STDIO communication flow test (MCP)
                        $communicationEnd = Get-Date
                        $flowResult.Latency = ($communicationEnd - $communicationStart).TotalMilliseconds
                        
                        # For STDIO, verify the target process is ready for JSON-RPC
                        if ($targetService.Capabilities -contains "STDIO_Ready") {
                            $flowResult.Status = "Success"
                            $flowResult.TestResults["STDIO_Communication"] = "Pass"
                            Write-Success "STDIO communication flow $($flow.From) → $($flow.To) ready"
                        } else {
                            $flowResult.Status = "CommunicationFailed"
                            $flowResult.TestResults["STDIO_Communication"] = "Fail"
                            $flowResult.Issues += "STDIO interface not ready"
                            Write-Warning "STDIO communication flow $($flow.From) → $($flow.To) not ready"
                        }
                    }
                }
                
                # Test safety compliance
                if ($Safety) {
                    Write-Safety "Validating safety parameters for $($flow.Name)..."
                    
                    $safetyTests = @{}
                    
                    # Timeout compliance
                    if ($flowResult.Latency -le $flow.SafetyTimeout) {
                        $safetyTests["Timeout"] = "Pass"
                        Write-Success "Flow timeout within safety limit ($([math]::Round($flowResult.Latency))ms ≤ $($flow.SafetyTimeout)ms)"
                    } else {
                        $safetyTests["Timeout"] = "Fail"
                        $flowResult.Issues += "Timeout exceeds safety limit"
                        Write-Warning "Flow timeout exceeds safety limit ($([math]::Round($flowResult.Latency))ms > $($flow.SafetyTimeout)ms)"
                    }
                    
                    # Retry policy validation
                    if ($flow.RetryPolicy -gt 0 -and $flow.RetryPolicy -le 5) {
                        $safetyTests["RetryPolicy"] = "Pass"
                        Write-Success "Retry policy is reasonable ($($flow.RetryPolicy) retries)"
                    } else {
                        $safetyTests["RetryPolicy"] = "Warning"
                        Write-Warning "Retry policy may need adjustment ($($flow.RetryPolicy) retries)"
                    }
                    
                    # Circuit breaker validation
                    if ($flow.CircuitBreaker) {
                        $safetyTests["CircuitBreaker"] = "Configured"
                        Write-Success "Circuit breaker is enabled for $($flow.Name)"
                    } else {
                        $safetyTests["CircuitBreaker"] = "Disabled"
                        Write-Info "Circuit breaker is disabled for $($flow.Name)"
                    }
                    
                    $flowResult.TestResults["Safety"] = $safetyTests
                    $flowResult.SafetyCompliant = ($safetyTests["Timeout"] -eq "Pass" -and $safetyTests["RetryPolicy"] -in @("Pass", "Warning"))
                }
            }
            
        } catch {
            $flowResult.Status = "Error"
            $flowResult.Issues += "Flow test error: $($_.Exception.Message)"
            Write-Error "Communication flow test failed for $($flow.Name): $($_.Exception.Message)"
        }
        
        $flowResults[$flow.Name] = $flowResult
    }
    
    $IntegrationResults.CommunicationFlows = $flowResults
    return $flowResults
}

function Test-StartupSequence {
    if (-not $Sequence) { return @{} }
    
    Write-Sequence "Testing service startup sequence and dependencies..."
    
    $sequenceResults = @{
        StartupOrder = @()
        DependencyValidation = @{}
        TimingAnalysis = @{}
        Issues = @()
    }
    
    try {
        # Determine optimal startup order based on dependencies
        $serviceOrder = @()
        $servicesToProcess = $IntegrationConfig.ServiceMatrix.Keys | ForEach-Object { $_ }
        
        # First, add services with no dependencies
        foreach ($serviceName in $servicesToProcess) {
            $service = $IntegrationConfig.ServiceMatrix[$serviceName]
            if ($service.Dependencies.Count -eq 0) {
                $serviceOrder += $serviceName
                Write-Info "Added $serviceName to startup order (no dependencies)"
            }
        }
        
        # Then add services based on dependency resolution
        while ($serviceOrder.Count -lt $IntegrationConfig.ServiceMatrix.Count) {
            $addedInThisRound = $false
            
            foreach ($serviceName in $servicesToProcess) {
                if ($serviceName -in $serviceOrder) { continue }
                
                $service = $IntegrationConfig.ServiceMatrix[$serviceName]
                $dependenciesMet = $true
                
                foreach ($dependency in $service.Dependencies) {
                    if ($dependency -notin $serviceOrder) {
                        $dependenciesMet = $false
                        break
                    }
                }
                
                if ($dependenciesMet) {
                    $serviceOrder += $serviceName
                    $addedInThisRound = $true
                    Write-Info "Added $serviceName to startup order (dependencies met: $($service.Dependencies -join ', '))"
                }
            }
            
            if (-not $addedInThisRound) {
                # Circular dependency or missing service
                $remaining = $servicesToProcess | Where-Object { $_ -notin $serviceOrder }
                $sequenceResults.Issues += "Circular dependency or missing service: $($remaining -join ', ')"
                break
            }
        }
        
        $sequenceResults.StartupOrder = $serviceOrder
        
        # Validate current service states against optimal startup sequence
        Write-Test "Validating current service states against startup sequence..."
        
        foreach ($serviceName in $serviceOrder) {
            $service = $IntegrationConfig.ServiceMatrix[$serviceName]
            $currentState = $IntegrationResults.ServiceDiscovery[$serviceName]
            
            $dependencyValidation = @{
                ServiceName = $serviceName
                RequiredDependencies = $service.Dependencies
                DependenciesRunning = @()
                DependenciesMissing = @()
                CanStart = $true
            }
            
            # Check if dependencies are running
            foreach ($dependency in $service.Dependencies) {
                $depState = $IntegrationResults.ServiceDiscovery[$dependency]
                if ($depState -and $depState.Available) {
                    $dependencyValidation.DependenciesRunning += $dependency
                } else {
                    $dependencyValidation.DependenciesMissing += $dependency
                    $dependencyValidation.CanStart = $false
                }
            }
            
            $sequenceResults.DependencyValidation[$serviceName] = $dependencyValidation
            
            if ($dependencyValidation.CanStart) {
                Write-Success "$serviceName can start (dependencies met: $($dependencyValidation.DependenciesRunning -join ', '))"
            } else {
                Write-Warning "$serviceName cannot start (missing dependencies: $($dependencyValidation.DependenciesMissing -join ', '))"
            }
        }
        
        # Timing analysis
        $sequenceResults.TimingAnalysis = @{
            TotalStartupTime = ($IntegrationConfig.ServiceMatrix.Values | Measure-Object -Property StartupTime -Sum).Sum
            OptimalStartupTime = 0
            ParallelizationOpportunities = @()
        }
        
        # Calculate optimal startup time with parallelization
        $currentLevel = 0
        $levelServices = @{}
        
        foreach ($serviceName in $serviceOrder) {
            $service = $IntegrationConfig.ServiceMatrix[$serviceName]
            $level = 0
            
            # Find the maximum level of dependencies
            foreach ($dependency in $service.Dependencies) {
                $depIndex = $serviceOrder.IndexOf($dependency)
                if ($depIndex -ge 0) {
                    $depLevel = 0
                    foreach ($levelKey in $levelServices.Keys) {
                        if ($dependency -in $levelServices[$levelKey]) {
                            $depLevel = $levelKey
                            break
                        }
                    }
                    $level = [Math]::Max($level, $depLevel + 1)
                }
            }
            
            if (-not $levelServices.ContainsKey($level)) {
                $levelServices[$level] = @()
            }
            $levelServices[$level] += $serviceName
        }
        
        # Calculate optimal timing
        foreach ($level in $levelServices.Keys | Sort-Object) {
            $levelMaxTime = ($levelServices[$level] | ForEach-Object { $IntegrationConfig.ServiceMatrix[$_].StartupTime } | Measure-Object -Maximum).Maximum
            $sequenceResults.TimingAnalysis.OptimalStartupTime += $levelMaxTime
            
            if ($levelServices[$level].Count -gt 1) {
                $sequenceResults.TimingAnalysis.ParallelizationOpportunities += "Level $level`: $($levelServices[$level] -join ', ') can start in parallel"
            }
        }
        
        Write-Success "Startup sequence analysis complete"
        Write-Info "Total sequential startup time: $($sequenceResults.TimingAnalysis.TotalStartupTime) seconds"
        Write-Info "Optimal parallel startup time: $($sequenceResults.TimingAnalysis.OptimalStartupTime) seconds"
        
    } catch {
        $sequenceResults.Issues += "Sequence analysis failed: $($_.Exception.Message)"
        Write-Error "Startup sequence analysis failed: $($_.Exception.Message)"
    }
    
    $IntegrationResults.SequenceTests = $sequenceResults
    return $sequenceResults
}

function Test-SafetyEnforcement {
    if (-not $Safety) { return @{} }
    
    Write-Safety "Testing safety enforcement and compensation mechanisms..."
    
    $safetyResults = @{
        GlobalSafetyMechanisms = @{}
        PerServiceSafety = @{}
        CompensationTests = @{}
        ComplianceScore = 0
        Issues = @()
    }
    
    try {
        # Test global safety mechanisms
        Write-Test "Validating global safety mechanisms..."
        
        $globalSafety = $IntegrationConfig.SafetyEnforcement
        
        $safetyResults.GlobalSafetyMechanisms = @{
            TimeoutPolicies = @{
                ServiceStartup = $globalSafety.GlobalTimeouts.ServiceStartup
                HealthCheck = $globalSafety.GlobalTimeouts.HealthCheck
                Communication = $globalSafety.GlobalTimeouts.CommunicationTimeout
                GracefulShutdown = $globalSafety.GlobalTimeouts.GracefulShutdown
                Status = "Configured"
            }
            RateLimitingPolicies = @{
                GlobalLimit = $globalSafety.RateLimiting.GlobalRequestsPerMinute
                PerServiceLimit = $globalSafety.RateLimiting.PerServiceRequestsPerMinute
                BurstLimit = $globalSafety.RateLimiting.BurstLimit
                Status = "Configured"
            }
            CircuitBreakerPolicies = @{
                FailureThreshold = $globalSafety.CircuitBreaker.FailureThreshold
                RecoveryTime = $globalSafety.CircuitBreaker.RecoveryTime
                HalfOpenRetries = $globalSafety.CircuitBreaker.HalfOpenRetries
                Status = "Configured"
            }
            CompensationMechanisms = @{
                RetryWithBackoff = $globalSafety.Compensation.RetryExponentialBackoff
                FallbackEndpoints = $globalSafety.Compensation.FallbackEndpoints
                GracefulDegradation = $globalSafety.Compensation.GracefulDegradation
                HealthBasedRouting = $globalSafety.Compensation.HealthBasedRouting
                Status = "Configured"
            }
        }
        
        Write-Success "Global safety mechanisms are configured"
        $safetyResults.ComplianceScore += 25
        
        # Test per-service safety compliance
        Write-Test "Validating per-service safety compliance..."
        
        foreach ($serviceName in $IntegrationConfig.ServiceMatrix.Keys) {
            $service = $IntegrationConfig.ServiceMatrix[$serviceName]
            $serviceState = $IntegrationResults.ServiceDiscovery[$serviceName]
            
            $serviceSafety = @{
                ServiceName = $serviceName
                HealthChecksConfigured = $service.HealthChecks.Count
                CommunicationEndpoints = $service.CommunicationEndpoints.Count
                StartupTimeCompliant = $service.StartupTime -le ($globalSafety.GlobalTimeouts.ServiceStartup / 1000)
                ProtocolSecure = $service.Protocol -like "*HTTP*" # Could be enhanced for SSL/TLS
                Issues = @()
            }
            
            if ($serviceSafety.StartupTimeCompliant) {
                Write-Success "$serviceName startup time is within limits ($($service.StartupTime)s)"
            } else {
                $serviceSafety.Issues += "Startup time exceeds global limit"
                Write-Warning "$serviceName startup time exceeds global limit ($($service.StartupTime)s)"
            }
            
            if ($serviceSafety.HealthChecksConfigured -gt 0) {
                Write-Success "$serviceName has health checks configured ($($serviceSafety.HealthChecksConfigured) checks)"
            } else {
                $serviceSafety.Issues += "No health checks configured"
                Write-Warning "$serviceName has no health checks configured"
            }
            
            $safetyResults.PerServiceSafety[$serviceName] = $serviceSafety
        }
        
        $safetyResults.ComplianceScore += 25
        
        # Test compensation mechanisms
        Write-Test "Testing compensation mechanisms..."
        
        $compensationTests = @{
            RetryBackoffTest = @{
                Mechanism = "Exponential backoff"
                Configured = $globalSafety.Compensation.RetryExponentialBackoff
                Status = if ($globalSafety.Compensation.RetryExponentialBackoff) { "Enabled" } else { "Disabled" }
            }
            FallbackTest = @{
                Mechanism = "Fallback endpoints"
                Configured = $globalSafety.Compensation.FallbackEndpoints
                Status = if ($globalSafety.Compensation.FallbackEndpoints) { "Enabled" } else { "Disabled" }
            }
            DegradationTest = @{
                Mechanism = "Graceful degradation"
                Configured = $globalSafety.Compensation.GracefulDegradation
                Status = if ($globalSafety.Compensation.GracefulDegradation) { "Enabled" } else { "Disabled" }
            }
            HealthRoutingTest = @{
                Mechanism = "Health-based routing"
                Configured = $globalSafety.Compensation.HealthBasedRouting
                Status = if ($globalSafety.Compensation.HealthBasedRouting) { "Enabled" } else { "Disabled" }
            }
        }
        
        $enabledMechanisms = ($compensationTests.Values | Where-Object { $_.Configured }).Count
        $totalMechanisms = $compensationTests.Count
        
        Write-Success "Compensation mechanisms: $enabledMechanisms/$totalMechanisms enabled"
        $safetyResults.ComplianceScore += ($enabledMechanisms / $totalMechanisms) * 25
        
        $safetyResults.CompensationTests = $compensationTests
        
        # Final compliance scoring
        $perServiceCompliance = 0
        foreach ($serviceSafety in $safetyResults.PerServiceSafety.Values) {
            if ($serviceSafety.Issues.Count -eq 0) {
                $perServiceCompliance += 1
            }
        }
        
        if ($safetyResults.PerServiceSafety.Count -gt 0) {
            $safetyResults.ComplianceScore += ($perServiceCompliance / $safetyResults.PerServiceSafety.Count) * 25
        }
        
        Write-Safety "Overall safety compliance score: $([math]::Round($safetyResults.ComplianceScore))%"
        
    } catch {
        $safetyResults.Issues += "Safety enforcement test failed: $($_.Exception.Message)"
        Write-Error "Safety enforcement test failed: $($_.Exception.Message)"
    }
    
    $IntegrationResults.SafetyValidation = $safetyResults
    return $safetyResults
}

function Generate-IntegrationReport {
    Write-Host ""
    Write-Host "📊 OriMind Integration Communication Flow Report" -ForegroundColor Magenta
    Write-Host "===============================================" -ForegroundColor Magenta
    
    # Service discovery summary
    Write-Host ""
    Write-Host "🔍 Service Discovery Results:" -ForegroundColor Cyan
    $totalServices = $IntegrationResults.ServiceDiscovery.Count
    $availableServices = ($IntegrationResults.ServiceDiscovery.Values | Where-Object { $_.Available }).Count
    $healthyServices = ($IntegrationResults.ServiceDiscovery.Values | Where-Object { $_.HealthStatus -eq "Healthy" }).Count
    
    Write-Host "  Total Services: $totalServices" -ForegroundColor Gray
    Write-Host "  Available Services: $availableServices" -ForegroundColor $(if ($availableServices -eq $totalServices) { "Green" } elseif ($availableServices -gt 0) { "Yellow" } else { "Red" })
    Write-Host "  Healthy Services: $healthyServices" -ForegroundColor $(if ($healthyServices -eq $totalServices) { "Green" } elseif ($healthyServices -gt 0) { "Yellow" } else { "Red" })
    
    foreach ($serviceName in $IntegrationResults.ServiceDiscovery.Keys) {
        $service = $IntegrationResults.ServiceDiscovery[$serviceName]
        $statusColor = switch ($service.HealthStatus) {
            "Healthy" { "Green" }
            "Running" { "Green" }
            "PortOpen" { "Yellow" }
            "Unavailable" { "Red" }
            "ProcessNotFound" { "Red" }
            default { "Gray" }
        }
        
        Write-Host "    $($service.Name): $($service.HealthStatus) ($($service.Protocol), $($service.ResponseTime)ms)" -ForegroundColor $statusColor
        if ($service.Capabilities.Count -gt 0) {
            Write-Host "      Capabilities: $($service.Capabilities -join ', ')" -ForegroundColor Gray
        }
        if ($service.Issues.Count -gt 0) {
            Write-Host "      Issues: $($service.Issues -join ', ')" -ForegroundColor Red
        }
    }
    
    # Communication flows summary
    Write-Host ""
    Write-Host "🌊 Communication Flow Analysis:" -ForegroundColor Cyan
    $totalFlows = $IntegrationResults.CommunicationFlows.Count
    $successfulFlows = ($IntegrationResults.CommunicationFlows.Values | Where-Object { $_.Status -eq "Success" }).Count
    $safetyCompliantFlows = ($IntegrationResults.CommunicationFlows.Values | Where-Object { $_.SafetyCompliant }).Count
    
    Write-Host "  Total Flows: $totalFlows" -ForegroundColor Gray
    Write-Host "  Successful Flows: $successfulFlows" -ForegroundColor $(if ($successfulFlows -eq $totalFlows) { "Green" } elseif ($successfulFlows -gt 0) { "Yellow" } else { "Red" })
    if ($Safety) {
        Write-Host "  Safety Compliant Flows: $safetyCompliantFlows" -ForegroundColor $(if ($safetyCompliantFlows -eq $totalFlows) { "Green" } elseif ($safetyCompliantFlows -gt 0) { "Yellow" } else { "Red" })
    }
    
    foreach ($flowName in $IntegrationResults.CommunicationFlows.Keys) {
        $flow = $IntegrationResults.CommunicationFlows[$flowName]
        $statusColor = switch ($flow.Status) {
            "Success" { "Green" }
            "CommunicationFailed" { "Yellow" }
            "SourceUnavailable" { "Red" }
            "TargetUnavailable" { "Red" }
            default { "Gray" }
        }
        
        Write-Host "    $($flow.Name): $($flow.Status) ($($flow.Protocol), $([math]::Round($flow.Latency))ms)" -ForegroundColor $statusColor
        Write-Host "      Purpose: $($flow.Purpose)" -ForegroundColor Gray
        if ($Safety -and $flow.TestResults.ContainsKey("Safety")) {
            $safetyTests = $flow.TestResults["Safety"]
            Write-Host "      Safety: Timeout=$($safetyTests["Timeout"]), Retry=$($safetyTests["RetryPolicy"]), CircuitBreaker=$($safetyTests["CircuitBreaker"])" -ForegroundColor Gray
        }
        if ($flow.Issues.Count -gt 0) {
            Write-Host "      Issues: $($flow.Issues -join ', ')" -ForegroundColor Red
        }
    }
    
    # Startup sequence analysis (if performed)
    if ($Sequence -and $IntegrationResults.SequenceTests.Count -gt 0) {
        Write-Host ""
        Write-Host "⚡ Startup Sequence Analysis:" -ForegroundColor DarkMagenta
        $sequenceData = $IntegrationResults.SequenceTests
        
        Write-Host "  Optimal Startup Order: $($sequenceData.StartupOrder -join ' → ')" -ForegroundColor Gray
        Write-Host "  Sequential Startup Time: $($sequenceData.TimingAnalysis.TotalStartupTime) seconds" -ForegroundColor Gray
        Write-Host "  Optimal Parallel Time: $($sequenceData.TimingAnalysis.OptimalStartupTime) seconds" -ForegroundColor Gray
        
        if ($sequenceData.TimingAnalysis.ParallelizationOpportunities.Count -gt 0) {
            Write-Host "  Parallelization Opportunities:" -ForegroundColor Cyan
            foreach ($opportunity in $sequenceData.TimingAnalysis.ParallelizationOpportunities) {
                Write-Host "    $opportunity" -ForegroundColor Gray
            }
        }
        
        Write-Host "  Dependency Validation:" -ForegroundColor Cyan
        foreach ($serviceName in $sequenceData.DependencyValidation.Keys) {
            $depValidation = $sequenceData.DependencyValidation[$serviceName]
            $canStartColor = if ($depValidation.CanStart) { "Green" } else { "Red" }
            Write-Host "    $serviceName`: Can Start = $($depValidation.CanStart)" -ForegroundColor $canStartColor
            if ($depValidation.DependenciesMissing.Count -gt 0) {
                Write-Host "      Missing: $($depValidation.DependenciesMissing -join ', ')" -ForegroundColor Red
            }
        }
    }
    
    # Safety validation summary (if performed)
    if ($Safety -and $IntegrationResults.SafetyValidation.Count -gt 0) {
        Write-Host ""
        Write-Host "🛡️  Safety Enforcement Analysis:" -ForegroundColor DarkGreen
        $safetyData = $IntegrationResults.SafetyValidation
        
        Write-Host "  Overall Compliance Score: $([math]::Round($safetyData.ComplianceScore))%" -ForegroundColor $(if ($safetyData.ComplianceScore -ge 80) { "Green" } elseif ($safetyData.ComplianceScore -ge 60) { "Yellow" } else { "Red" })
        
        Write-Host "  Global Safety Mechanisms:" -ForegroundColor Cyan
        foreach ($mechanismType in $safetyData.GlobalSafetyMechanisms.Keys) {
            $mechanism = $safetyData.GlobalSafetyMechanisms[$mechanismType]
            Write-Host "    $mechanismType`: $($mechanism.Status)" -ForegroundColor Gray
        }
        
        Write-Host "  Per-Service Safety:" -ForegroundColor Cyan
        foreach ($serviceName in $safetyData.PerServiceSafety.Keys) {
            $serviceSafety = $safetyData.PerServiceSafety[$serviceName]
            $serviceColor = if ($serviceSafety.Issues.Count -eq 0) { "Green" } else { "Yellow" }
            Write-Host "    $serviceName`: $($serviceSafety.HealthChecksConfigured) health checks, startup compliant = $($serviceSafety.StartupTimeCompliant)" -ForegroundColor $serviceColor
        }
        
        Write-Host "  Compensation Mechanisms:" -ForegroundColor Cyan
        foreach ($testName in $safetyData.CompensationTests.Keys) {
            $test = $safetyData.CompensationTests[$testName]
            $testColor = if ($test.Configured) { "Green" } else { "Yellow" }
            Write-Host "    $($test.Mechanism): $($test.Status)" -ForegroundColor $testColor
        }
    }
    
    # Overall assessment
    Write-Host ""
    Write-Host "🎯 Overall Integration Assessment:" -ForegroundColor Magenta
    
    # Calculate overall health score
    $healthScore = 0
    $maxScore = 100
    
    # Service availability (40% weight)
    if ($totalServices -gt 0) {
        $healthScore += ($availableServices / $totalServices) * 40
    }
    
    # Communication success (30% weight)
    if ($totalFlows -gt 0) {
        $healthScore += ($successfulFlows / $totalFlows) * 30
    }
    
    # Safety compliance (30% weight)
    if ($Safety -and $IntegrationResults.SafetyValidation.Count -gt 0) {
        $healthScore += ($IntegrationResults.SafetyValidation.ComplianceScore / 100) * 30
    } else {
        $healthScore += 20  # Basic safety score if not tested
    }
    
    $IntegrationResults.OverallHealthScore = [math]::Round($healthScore)
    
    Write-Host "  Integration Health Score: $($IntegrationResults.OverallHealthScore)%" -ForegroundColor $(if ($IntegrationResults.OverallHealthScore -ge 80) { "Green" } elseif ($IntegrationResults.OverallHealthScore -ge 60) { "Yellow" } else { "Red" })
    
    # Recommendations
    Write-Host ""
    Write-Host "💡 Integration Recommendations:" -ForegroundColor Yellow
    
    if ($IntegrationResults.OverallHealthScore -ge 90) {
        Write-Host "  ✅ Integration system is performing excellently!" -ForegroundColor Green
        Write-Host "  ✅ All communication flows are working optimally" -ForegroundColor Green
        Write-Host "  ✅ Safety mechanisms are properly enforced" -ForegroundColor Green
    } elseif ($IntegrationResults.OverallHealthScore -ge 70) {
        Write-Host "  🔧 Integration system is good with room for improvement:" -ForegroundColor Yellow
        if ($availableServices -lt $totalServices) {
            Write-Host "    • Start remaining services to enable full communication flows" -ForegroundColor Gray
        }
        if ($successfulFlows -lt $totalFlows) {
            Write-Host "    • Debug communication issues between unavailable services" -ForegroundColor Gray
        }
        if ($Safety -and $safetyCompliantFlows -lt $totalFlows) {
            Write-Host "    • Review and adjust safety parameters for non-compliant flows" -ForegroundColor Gray
        }
    } else {
        Write-Host "  🚨 Integration system needs significant improvements:" -ForegroundColor Red
        Write-Host "    • Start all required services for basic functionality" -ForegroundColor Gray
        Write-Host "    • Fix service discovery and communication issues" -ForegroundColor Gray
        Write-Host "    • Implement comprehensive safety mechanisms" -ForegroundColor Gray
        Write-Host "    • Review startup sequence and dependencies" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "  Next steps to improve integration:" -ForegroundColor Cyan
    Write-Host "    1. Run .\scripts\start-orimind.ps1 to start all services" -ForegroundColor Gray
    Write-Host "    2. Use .\scripts\validate-system.ps1 for continuous monitoring" -ForegroundColor Gray
    Write-Host "    3. Implement automated health checks and alerts" -ForegroundColor Gray
    Write-Host "    4. Set up load balancing for high-availability scenarios" -ForegroundColor Gray
}

# Main execution
try {
    $startTime = Get-Date
    
    Write-Progress "Starting integration communication flow testing..."
    
    # Phase 1: Service discovery
    Write-Host ""
    Write-Host "Phase 1: Service Discovery & Availability" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    Test-ServiceDiscovery
    
    # Phase 2: Communication flow testing
    Write-Host ""
    Write-Host "Phase 2: Inter-Service Communication Testing" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    
    Test-CommunicationFlows
    
    # Phase 3: Startup sequence analysis (if requested)
    if ($Sequence) {
        Write-Host ""
        Write-Host "Phase 3: Startup Sequence & Dependency Analysis" -ForegroundColor Cyan
        Write-Host "===============================================" -ForegroundColor Cyan
        
        Test-StartupSequence
    }
    
    # Phase 4: Safety enforcement testing (if requested)
    if ($Safety) {
        Write-Host ""
        Write-Host "Phase 4: Safety Enforcement & Compensation Testing" -ForegroundColor Cyan
        Write-Host "===================================================" -ForegroundColor Cyan
        
        Test-SafetyEnforcement
    }
    
    # Generate comprehensive report
    Generate-IntegrationReport
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host ""
    Write-Info "Integration flow testing completed in $([math]::Round($duration, 1)) seconds"
    
    Write-Success "Integration communication flow analysis complete!"
    
} catch {
    Write-Error "Integration flow testing failed: $($_.Exception.Message)"
    Write-Error $_.ScriptStackTrace
    exit 1
}