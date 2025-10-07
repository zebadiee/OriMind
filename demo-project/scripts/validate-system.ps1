#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OriMind Complete Startup Health Validation
    Comprehensive testing and validation of the entire OriMind ecosystem

.DESCRIPTION
    This script performs end-to-end testing of all OriMind components:
    - Environment configuration validation
    - Service dependency checking  
    - Component health verification
    - Integration testing between services
    - Performance baseline establishment

.PARAMETER Quick
    Run only essential health checks (faster execution)

.PARAMETER Detailed
    Run comprehensive testing including performance benchmarks

.PARAMETER Fix
    Attempt to automatically fix common issues found during validation

.EXAMPLE
    .\validate-system.ps1
    Standard health validation

.EXAMPLE  
    .\validate-system.ps1 -Quick
    Fast essential checks only

.EXAMPLE
    .\validate-system.ps1 -Detailed -Fix
    Comprehensive testing with automatic issue resolution
#>

param(
    [switch]$Quick,
    [switch]$Detailed,
    [switch]$Fix
)

# Color output functions
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Progress { param($Message) Write-Host "🔄 $Message" -ForegroundColor Blue }
function Write-Test { param($Message) Write-Host "🧪 $Message" -ForegroundColor Magenta }

Write-Host "🎯 OriMind System Health Validation" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta

# Define test configuration
$TestConfig = @{
    Services = @(
        @{ Name = "MCP Recipe Server"; Port = 3003; Path = "/health"; Required = $true },
        @{ Name = "Sherlock Omega IDE"; Port = 3000; Path = "/api/health"; Required = $true },
        @{ Name = "ReliaKit Dashboard"; Port = 5000; Path = "/health"; Required = $true },
        @{ Name = "Main Application"; Port = 3002; Path = "/api/health"; Required = $false }
    )
    
    Files = @(
        @{ Name = "Enhanced Environment"; Path = ".env"; Required = $true },
        @{ Name = "MCP Server Config"; Path = "manus-agi/mcp-recipe-server/.env"; Required = $true },
        @{ Name = "MCP Package JSON"; Path = "manus-agi/mcp-recipe-server/package.json"; Required = $true },
        @{ Name = "Sherlock IDE Config"; Path = "sherlock-web-ide/.eslintrc.json"; Required = $true },
        @{ Name = "Startup Scripts"; Path = "scripts/start-orimind.ps1"; Required = $true }
    )
    
    Commands = @(
        @{ Name = "Node.js"; Command = "node --version"; Pattern = "v\d+\.\d+\.\d+"; Required = $true },
        @{ Name = "NPM"; Command = "npm --version"; Pattern = "\d+\.\d+\.\d+"; Required = $true },
        @{ Name = "Python"; Command = "python --version"; Pattern = "Python \d+\.\d+\.\d+"; Required = $true },
        @{ Name = "Git"; Command = "git --version"; Pattern = "git version \d+\.\d+\.\d+"; Required = $true },
        @{ Name = "Docker"; Command = "docker --version"; Pattern = "Docker version \d+\.\d+\.\d+"; Required = $false }
    )
}

# Results tracking
$TestResults = @{
    Passed = 0
    Failed = 0
    Warnings = 0
    Issues = @()
    Recommendations = @()
}

function Test-ServiceHealth {
    param($Service)
    
    Write-Test "Testing $($Service.Name) health..."
    
    try {
        # Check if port is responding
        $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $Service.Port -WarningAction SilentlyContinue
        
        if ($connection.TcpTestSucceeded) {
            # Try to get health endpoint
            try {
                $response = Invoke-WebRequest -Uri "http://127.0.0.1:$($Service.Port)$($Service.Path)" -TimeoutSec 10 -UseBasicParsing
                if ($response.StatusCode -eq 200) {
                    Write-Success "$($Service.Name) is healthy (HTTP 200)"
                    $TestResults.Passed++
                    return @{ Status = "Healthy"; Details = "Service responding normally" }
                } else {
                    Write-Warning "$($Service.Name) responded with status $($response.StatusCode)"
                    $TestResults.Warnings++
                    return @{ Status = "Warning"; Details = "Non-200 status code" }
                }
            }
            catch {
                Write-Warning "$($Service.Name) port open but health endpoint failed: $($_.Exception.Message)"
                $TestResults.Warnings++
                return @{ Status = "Warning"; Details = "Port open, health endpoint failed" }
            }
        } else {
            if ($Service.Required) {
                Write-Error "$($Service.Name) is not responding on port $($Service.Port)"
                $TestResults.Failed++
                $TestResults.Issues += "Required service $($Service.Name) is not running"
                return @{ Status = "Failed"; Details = "Service not responding" }
            } else {
                Write-Info "$($Service.Name) is not running (optional service)"
                return @{ Status = "Optional"; Details = "Service not running" }
            }
        }
    }
    catch {
        Write-Error "Failed to test $($Service.Name): $($_.Exception.Message)"
        $TestResults.Failed++
        return @{ Status = "Error"; Details = $_.Exception.Message }
    }
}

function Test-FileConfiguration {
    param($FileConfig)
    
    Write-Test "Validating $($FileConfig.Name)..."
    
    if (Test-Path $FileConfig.Path) {
        try {
            $content = Get-Content $FileConfig.Path -Raw -ErrorAction Stop
            
            # Basic validation checks
            $issues = @()
            
            # Check for empty files
            if ([string]::IsNullOrWhiteSpace($content)) {
                $issues += "File is empty"
            }
            
            # Check for common configuration issues
            if ($FileConfig.Path -like "*.env*") {
                # Environment file validation
                if ($content -match 'CHANGEME|PLACEHOLDER|YOUR_KEY_HERE') {
                    $issues += "Contains placeholder values"
                }
                
                $unresolvedVars = [regex]::Matches($content, '\$\{[^}]+\}')
                if ($unresolvedVars.Count -gt 0) {
                    $issues += "Contains unresolved variables: $($unresolvedVars[0].Value)"
                }
            }
            
            if ($FileConfig.Path -like "*package.json") {
                # Package.json validation
                try {
                    $json = $content | ConvertFrom-Json
                    if (-not $json.scripts) {
                        $issues += "Missing scripts section"
                    }
                    if (-not $json.dependencies) {
                        $issues += "Missing dependencies section"
                    }
                } catch {
                    $issues += "Invalid JSON format"
                }
            }
            
            if ($issues.Count -eq 0) {
                Write-Success "$($FileConfig.Name) is valid"
                $TestResults.Passed++
                return @{ Status = "Valid"; Details = "Configuration file is properly formatted" }
            } else {
                Write-Warning "$($FileConfig.Name) has issues: $($issues -join ', ')"
                $TestResults.Warnings++
                $TestResults.Recommendations += "Review $($FileConfig.Name): $($issues -join ', ')"
                return @{ Status = "Warning"; Details = $issues -join ', ' }
            }
        }
        catch {
            Write-Error "Failed to read $($FileConfig.Name): $($_.Exception.Message)"
            $TestResults.Failed++
            return @{ Status = "Error"; Details = $_.Exception.Message }
        }
    } else {
        if ($FileConfig.Required) {
            Write-Error "$($FileConfig.Name) is missing: $($FileConfig.Path)"
            $TestResults.Failed++
            $TestResults.Issues += "Required file missing: $($FileConfig.Path)"
            return @{ Status = "Missing"; Details = "Required file not found" }
        } else {
            Write-Info "$($FileConfig.Name) is missing (optional)"
            return @{ Status = "Optional"; Details = "Optional file not found" }
        }
    }
}

function Test-CommandAvailability {
    param($CommandConfig)
    
    Write-Test "Testing $($CommandConfig.Name) availability..."
    
    try {
        $output = Invoke-Expression $CommandConfig.Command 2>$null
        if ($LASTEXITCODE -eq 0 -and $output) {
            if ($output -match $CommandConfig.Pattern) {
                Write-Success "$($CommandConfig.Name) is available: $output"
                $TestResults.Passed++
                return @{ Status = "Available"; Details = $output.Trim() }
            } else {
                Write-Warning "$($CommandConfig.Name) output doesn't match expected pattern: $output"
                $TestResults.Warnings++
                return @{ Status = "Warning"; Details = "Unexpected output format" }
            }
        } else {
            if ($CommandConfig.Required) {
                Write-Error "$($CommandConfig.Name) is not available or not working"
                $TestResults.Failed++
                $TestResults.Issues += "Required command missing: $($CommandConfig.Name)"
                return @{ Status = "Missing"; Details = "Command not available" }
            } else {
                Write-Info "$($CommandConfig.Name) is not available (optional)"
                return @{ Status = "Optional"; Details = "Optional command not available" }
            }
        }
    }
    catch {
        Write-Error "Failed to test $($CommandConfig.Name): $($_.Exception.Message)"
        $TestResults.Failed++
        return @{ Status = "Error"; Details = $_.Exception.Message }
    }
}

function Test-IntegrationFlow {
    Write-Test "Testing integration between services..."
    
    # Test if services can communicate with each other
    $integrationTests = @()
    
    # Test 1: MCP Server can be reached from main app context
    try {
        $mcpResponse = Invoke-WebRequest -Uri "http://127.0.0.1:3003" -TimeoutSec 5 -UseBasicParsing
        $integrationTests += @{ Name = "MCP Server Accessibility"; Status = "Pass" }
    } catch {
        $integrationTests += @{ Name = "MCP Server Accessibility"; Status = "Fail"; Error = $_.Exception.Message }
    }
    
    # Test 2: Cross-port communication check
    $portsOpen = 0
    foreach ($service in $TestConfig.Services) {
        $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $service.Port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            $portsOpen++
        }
    }
    
    if ($portsOpen -ge 2) {
        Write-Success "Multi-service communication possible ($portsOpen services running)"
        $TestResults.Passed++
    } elseif ($portsOpen -eq 1) {
        Write-Warning "Only one service running - limited integration testing"
        $TestResults.Warnings++
    } else {
        Write-Info "No services running - integration tests skipped"
    }
    
    return $integrationTests
}

function Test-PerformanceBaseline {
    if (-not $Detailed) { return }
    
    Write-Test "Establishing performance baseline..."
    
    # Memory usage check
    $memoryInfo = Get-ComputerInfo | Select-Object TotalPhysicalMemory, AvailablePhysicalMemory
    if ($memoryInfo.TotalPhysicalMemory -and $memoryInfo.TotalPhysicalMemory -gt 0) {
        $memoryUsagePercent = [math]::Round((($memoryInfo.TotalPhysicalMemory - $memoryInfo.AvailablePhysicalMemory) / $memoryInfo.TotalPhysicalMemory) * 100, 1)
    } else {
        $memoryUsagePercent = 0
        Write-Warning "Could not determine memory usage"
    }
    
    Write-Info "System Memory Usage: $memoryUsagePercent%"
    
    if ($memoryUsagePercent -lt 80) {
        Write-Success "Memory usage is healthy"
        $TestResults.Passed++
    } elseif ($memoryUsagePercent -lt 90) {
        Write-Warning "Memory usage is high ($memoryUsagePercent%)"
        $TestResults.Warnings++
        $TestResults.Recommendations += "Consider closing other applications to free memory"
    } else {
        Write-Error "Memory usage is critical ($memoryUsagePercent%)"
        $TestResults.Failed++
        $TestResults.Issues += "High memory usage may affect performance"
    }
    
    # CPU check
    $cpuUsage = Get-Counter '\Processor(_Total)\% Processor Time' | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue
    $cpuUsagePercent = [math]::Round($cpuUsage, 1)
    
    Write-Info "CPU Usage: $cpuUsagePercent%"
    
    if ($cpuUsagePercent -lt 70) {
        Write-Success "CPU usage is normal"
        $TestResults.Passed++
    } else {
        Write-Warning "CPU usage is elevated ($cpuUsagePercent%)"
        $TestResults.Warnings++
    }
}

function Fix-CommonIssues {
    if (-not $Fix) { return }
    
    Write-Progress "Attempting to fix common issues..."
    
    # Fix 1: Create missing .env files
    foreach ($file in $TestConfig.Files) {
        if ($file.Required -and -not (Test-Path $file.Path) -and $file.Path -like "*.env*") {
            Write-Progress "Creating missing environment file: $($file.Path)"
            
            # Look for template
            $templatePath = $file.Path + ".example"
            if (Test-Path $templatePath) {
                Copy-Item $templatePath $file.Path
                Write-Success "Created $($file.Path) from template"
            } else {
                # Create basic env file
                "# Auto-generated environment file`n# Please customize as needed`n" | Out-File $file.Path
                Write-Success "Created basic $($file.Path)"
            }
        }
    }
    
    # Fix 2: Install missing Node.js dependencies
    if (Test-Path "manus-agi/mcp-recipe-server/package.json") {
        Set-Location "manus-agi/mcp-recipe-server"
        if (-not (Test-Path "node_modules")) {
            Write-Progress "Installing MCP Server dependencies..."
            npm install 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "MCP Server dependencies installed"
            }
        }
        Set-Location "../.."
    }
    
    # Fix 3: Build TypeScript projects
    if (Test-Path "manus-agi/mcp-recipe-server/tsconfig.json") {
        Set-Location "manus-agi/mcp-recipe-server"
        Write-Progress "Building MCP Server TypeScript..."
        npm run build 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "MCP Server built successfully"
        }
        Set-Location "../.."
    }
}

function Generate-HealthReport {
    Write-Host ""
    Write-Host "📊 System Health Report" -ForegroundColor Magenta
    Write-Host "=======================" -ForegroundColor Magenta
    
    $total = $TestResults.Passed + $TestResults.Failed + $TestResults.Warnings
    $successRate = if ($total -gt 0) { [math]::Round(($TestResults.Passed / $total) * 100, 1) } else { 0 }
    
    Write-Host "Overall Health Score: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })
    Write-Host "Tests Passed: $($TestResults.Passed)" -ForegroundColor Green
    Write-Host "Tests Failed: $($TestResults.Failed)" -ForegroundColor Red
    Write-Host "Warnings: $($TestResults.Warnings)" -ForegroundColor Yellow
    
    if ($TestResults.Issues.Count -gt 0) {
        Write-Host ""
        Write-Host "🚨 Critical Issues:" -ForegroundColor Red
        foreach ($issue in $TestResults.Issues) {
            Write-Host "  • $issue" -ForegroundColor Red
        }
    }
    
    if ($TestResults.Recommendations.Count -gt 0) {
        Write-Host ""
        Write-Host "💡 Recommendations:" -ForegroundColor Yellow
        foreach ($recommendation in $TestResults.Recommendations) {
            Write-Host "  • $recommendation" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    if ($TestResults.Failed -eq 0) {
        Write-Success "System is ready for operation! 🚀"
        if ($TestResults.Warnings -gt 0) {
            Write-Info "Consider addressing warnings for optimal performance"
        }
    } else {
        Write-Error "System has critical issues that need resolution"
        Write-Info "Run with -Fix parameter to attempt automatic fixes"
    }
    
    Write-Host ""
}

# Main execution
try {
    $startTime = Get-Date
    
    Write-Progress "Starting comprehensive system validation..."
    
    # Change to workspace directory if available
    if (Test-Path "demo-project") {
        Set-Location "demo-project"
    }
    
    # Phase 1: Command availability testing
    Write-Host ""
    Write-Host "Phase 1: Development Tools Validation" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    
    foreach ($command in $TestConfig.Commands) {
        $result = Test-CommandAvailability -CommandConfig $command
    }
    
    # Phase 2: File configuration testing
    Write-Host ""
    Write-Host "Phase 2: Configuration Files Validation" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    
    foreach ($file in $TestConfig.Files) {
        $result = Test-FileConfiguration -FileConfig $file
    }
    
    # Phase 3: Service health testing
    Write-Host ""
    Write-Host "Phase 3: Service Health Validation" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    
    foreach ($service in $TestConfig.Services) {
        $result = Test-ServiceHealth -Service $service
    }
    
    # Phase 4: Integration testing (if not Quick mode)
    if (-not $Quick) {
        Write-Host ""
        Write-Host "Phase 4: Integration Flow Testing" -ForegroundColor Cyan
        Write-Host "=================================" -ForegroundColor Cyan
        
        $integrationResults = Test-IntegrationFlow
    }
    
    # Phase 5: Performance baseline (if Detailed mode)
    if ($Detailed) {
        Write-Host ""
        Write-Host "Phase 5: Performance Baseline" -ForegroundColor Cyan
        Write-Host "=============================" -ForegroundColor Cyan
        
        Test-PerformanceBaseline
    }
    
    # Phase 6: Auto-fix (if Fix mode)
    if ($Fix) {
        Write-Host ""
        Write-Host "Phase 6: Automatic Issue Resolution" -ForegroundColor Cyan
        Write-Host "===================================" -ForegroundColor Cyan
        
        Fix-CommonIssues
    }
    
    # Generate final report
    Generate-HealthReport
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Info "Validation completed in $([math]::Round($duration, 1)) seconds"
    
    # Exit with appropriate code
    if ($TestResults.Failed -eq 0) {
        exit 0
    } else {
        exit 1
    }
}
catch {
    Write-Error "System validation failed: $($_.Exception.Message)"
    Write-Error $_.ScriptStackTrace
    exit 1
}