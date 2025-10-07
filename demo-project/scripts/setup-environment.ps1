#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OriMind Environment Dependency Manager
    Automatically configures and validates environment dependencies for all components

.DESCRIPTION
    This script ensures all environment dependencies are properly configured:
    - Creates .env files from templates with intelligent fallbacks
    - Validates required tools and dependencies
    - Sets up service-specific configurations
    - Performs health checks on environment setup

.PARAMETER Force
    Force recreation of existing .env files

.PARAMETER Validate
    Only validate existing configuration without making changes

.EXAMPLE
    .\setup-environment.ps1
    Standard environment setup with safe defaults

.EXAMPLE
    .\setup-environment.ps1 -Force
    Force recreation of all environment files

.EXAMPLE
    .\setup-environment.ps1 -Validate
    Only validate current environment configuration
#>

param(
    [switch]$Force,
    [switch]$Validate
)

# Color output functions
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Progress { param($Message) Write-Host "🔄 $Message" -ForegroundColor Blue }

Write-Host "🚀 OriMind Environment Dependency Manager" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

# Find workspace root
$WorkspaceRoot = Get-Location
if (Test-Path "demo-project") {
    $WorkspaceRoot = Join-Path $WorkspaceRoot "demo-project"
    Set-Location $WorkspaceRoot
    Write-Info "Using workspace root: $WorkspaceRoot"
}

# Define environment templates and targets
$EnvConfigs = @(
    @{
        Name = "Main Enhanced Environment"
        Template = ".env.enhanced.template"
        Target = ".env"
        Required = $true
        Priority = 1
    },
    @{
        Name = "MCP Server Environment"
        Template = "manus-agi/mcp-recipe-server/.env.example"
        Target = "manus-agi/mcp-recipe-server/.env"
        Required = $true
        Priority = 2
    },
    @{
        Name = "Sherlock IDE Local Config"
        Template = "sherlock-web-ide/.env.local.example"
        Target = "sherlock-web-ide/.env.local"
        Required = $false
        Priority = 3
    },
    @{
        Name = "ReliaKit Dashboard Config"
        Template = "reliakit-dashboard/.env.template"
        Target = "reliakit-dashboard/.env"
        Required = $false
        Priority = 3
    }
)

# Tool validation list
$RequiredTools = @(
    @{ Name = "node"; Command = "node --version"; MinVersion = "18.0.0" },
    @{ Name = "npm"; Command = "npm --version"; MinVersion = "8.0.0" },
    @{ Name = "python"; Command = "python --version"; MinVersion = "3.8.0" },
    @{ Name = "git"; Command = "git --version"; MinVersion = "2.20.0" }
)

$OptionalTools = @(
    @{ Name = "docker"; Command = "docker --version"; Purpose = "Container deployment" },
    @{ Name = "docker-compose"; Command = "docker-compose --version"; Purpose = "Multi-container orchestration" }
)

function Test-ToolVersion {
    param($Tool, $ActualVersion, $MinVersion)
    
    try {
        $actual = [version]($ActualVersion -replace '[^\d\.].*$', '')
        $minimum = [version]$MinVersion
        return $actual -ge $minimum
    }
    catch {
        return $false
    }
}

function Validate-Tools {
    Write-Progress "Validating required development tools..."
    
    $allValid = $true
    
    foreach ($tool in $RequiredTools) {
        try {
            $output = Invoke-Expression $tool.Command 2>$null
            if ($LASTEXITCODE -eq 0 -and $output) {
                $version = $output -replace '^[^0-9]*([0-9]+\.[0-9]+\.[0-9]+).*$', '$1'
                if (Test-ToolVersion -Tool $tool.Name -ActualVersion $version -MinVersion $tool.MinVersion) {
                    Write-Success "$($tool.Name) $version (✓ >= $($tool.MinVersion))"
                } else {
                    Write-Warning "$($tool.Name) $version (⚠️ < $($tool.MinVersion))"
                    $allValid = $false
                }
            } else {
                Write-Error "$($tool.Name) not found or not working"
                $allValid = $false
            }
        }
        catch {
            Write-Error "$($tool.Name) validation failed: $($_.Exception.Message)"
            $allValid = $false
        }
    }
    
    Write-Progress "Checking optional tools..."
    foreach ($tool in $OptionalTools) {
        try {
            $output = Invoke-Expression $tool.Command 2>$null
            if ($LASTEXITCODE -eq 0 -and $output) {
                $version = $output -replace '^[^0-9]*([0-9]+\.[0-9]+\.[0-9]+).*$', '$1'
                Write-Success "$($tool.Name) $version (for $($tool.Purpose))"
            } else {
                Write-Warning "$($tool.Name) not available (optional - $($tool.Purpose))"
            }
        }
        catch {
            Write-Warning "$($tool.Name) not available (optional - $($tool.Purpose))"
        }
    }
    
    return $allValid
}

function Setup-EnvironmentFile {
    param($Config)
    
    $templatePath = $Config.Template
    $targetPath = $Config.Target
    
    Write-Progress "Setting up $($Config.Name)..."
    
    # Check if template exists
    if (-not (Test-Path $templatePath)) {
        if ($Config.Required) {
            Write-Error "Required template not found: $templatePath"
            return $false
        } else {
            Write-Warning "Optional template not found: $templatePath"
            return $true
        }
    }
    
    # Check if target already exists
    if ((Test-Path $targetPath) -and -not $Force) {
        Write-Info "$($Config.Name) already exists: $targetPath"
        return $true
    }
    
    try {
        # Ensure target directory exists
        $targetDir = Split-Path $targetPath -Parent
        if ($targetDir -and -not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # Copy template to target
        Copy-Item $templatePath $targetPath -Force
        
        # Process environment variable substitutions
        $content = Get-Content $targetPath -Raw
        
        # Replace ${VAR:-default} patterns with actual environment values or defaults
        $content = $content -replace '\$\{([^}:]+):-([^}]*)\}', {
            param($match)
            $varName = $match.Groups[1].Value
            $defaultValue = $match.Groups[2].Value
            $envValue = [Environment]::GetEnvironmentVariable($varName)
            if ($envValue) { $envValue } else { $defaultValue }
        }
        
        # Write processed content
        Set-Content $targetPath $content -NoNewline
        
        Write-Success "$($Config.Name) configured: $targetPath"
        return $true
    }
    catch {
        Write-Error "Failed to setup $($Config.Name): $($_.Exception.Message)"
        return $false
    }
}

function Validate-EnvironmentFiles {
    Write-Progress "Validating environment configurations..."
    
    $allValid = $true
    
    foreach ($config in $EnvConfigs) {
        if (Test-Path $config.Target) {
            Write-Success "$($config.Name) exists: $($config.Target)"
            
            # Basic validation - check for common issues
            $content = Get-Content $config.Target -Raw
            
            # Check for unresolved variables
            $unresolvedVars = [regex]::Matches($content, '\$\{[^}]+\}')
            if ($unresolvedVars.Count -gt 0) {
                Write-Warning "$($config.Name) has unresolved variables:"
                foreach ($var in $unresolvedVars) {
                    Write-Warning "  - $($var.Value)"
                }
            }
            
            # Check for empty required values (basic patterns)
            if ($content -match '^\s*(GITHUB_TOKEN|OPENROUTER_API_KEY|NEXTAUTH_SECRET)\s*=\s*$') {
                Write-Warning "$($config.Name) has empty important values (consider setting them)"
            }
        } else {
            if ($config.Required) {
                Write-Error "$($config.Name) missing: $($config.Target)"
                $allValid = $false
            } else {
                Write-Warning "$($config.Name) missing (optional): $($config.Target)"
            }
        }
    }
    
    return $allValid
}

function Test-ServicePorts {
    Write-Progress "Checking service port availability..."
    
    $ports = @(3000, 3001, 3002, 5000, 11434)
    $busyPorts = @()
    
    foreach ($port in $ports) {
        try {
            $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                $busyPorts += $port
            }
        }
        catch {
            # Port is likely available
        }
    }
    
    if ($busyPorts.Count -gt 0) {
        Write-Warning "Some ports are in use: $($busyPorts -join ', ')"
        Write-Info "This might indicate services are already running"
        return $false
    } else {
        Write-Success "All required ports are available"
        return $true
    }
}

function Generate-SetupSummary {
    Write-Host ""
    Write-Host "📋 Environment Setup Summary" -ForegroundColor Magenta
    Write-Host "============================" -ForegroundColor Magenta
    
    # Check which components are ready
    $components = @(
        @{ Name = "Enhanced Environment"; File = ".env"; Required = $true },
        @{ Name = "MCP Recipe Server"; File = "manus-agi/mcp-recipe-server/.env"; Required = $true },
        @{ Name = "Sherlock Web IDE"; File = "sherlock-web-ide/.env.local"; Required = $false },
        @{ Name = "ReliaKit Dashboard"; File = "reliakit-dashboard/.env"; Required = $false }
    )
    
    foreach ($component in $components) {
        if (Test-Path $component.File) {
            Write-Success "$($component.Name): Configured"
        } else {
            if ($component.Required) {
                Write-Error "$($component.Name): Missing (Required)"
            } else {
                Write-Warning "$($component.Name): Not configured (Optional)"
            }
        }
    }
    
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "  1. Review and customize .env files as needed" -ForegroundColor Gray
    Write-Host "  2. Set API keys for full functionality" -ForegroundColor Gray
    Write-Host "  3. Run: .\start-orimind.ps1" -ForegroundColor Gray
    Write-Host ""
}

# Main execution
try {
    $startTime = Get-Date
    
    if ($Validate) {
        Write-Info "Running validation-only mode..."
        $toolsValid = Validate-Tools
        $envValid = Validate-EnvironmentFiles
        $portsAvailable = Test-ServicePorts
        
        if ($toolsValid -and $envValid) {
            Write-Success "Environment validation completed successfully!"
            exit 0
        } else {
            Write-Error "Environment validation found issues"
            exit 1
        }
    }
    
    # Full setup mode
    Write-Progress "Starting environment dependency setup..."
    
    # Step 1: Validate tools
    $toolsValid = Validate-Tools
    if (-not $toolsValid) {
        Write-Error "Please install missing tools before proceeding"
        exit 1
    }
    
    # Step 2: Setup environment files
    $allSetup = $true
    $sortedConfigs = $EnvConfigs | Sort-Object Priority
    
    foreach ($config in $sortedConfigs) {
        $result = Setup-EnvironmentFile -Config $config
        if (-not $result -and $config.Required) {
            $allSetup = $false
        }
    }
    
    # Step 3: Validate setup
    $envValid = Validate-EnvironmentFiles
    
    # Step 4: Check ports
    $portsChecked = Test-ServicePorts
    
    # Step 5: Generate summary
    Generate-SetupSummary
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    if ($allSetup -and $envValid) {
        Write-Success "Environment setup completed successfully in $([math]::Round($duration, 1)) seconds!"
        Write-Info "You can now run: .\start-orimind.ps1"
        exit 0
    } else {
        Write-Error "Environment setup completed with issues"
        exit 1
    }
}
catch {
    Write-Error "Environment setup failed: $($_.Exception.Message)"
    Write-Error $_.ScriptStackTrace
    exit 1
}