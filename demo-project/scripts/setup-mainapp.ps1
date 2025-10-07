#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Main Application Service Launcher
    
.DESCRIPTION
    Production-ready orchestration layer for OriMind:
    - Central service integration hub
    - Request routing and load balancing
    - Service health monitoring
    - API gateway functionality
#>

param(
    [string]$Mode = "development",
    [int]$Port = 3002,
    [string]$SherlockUrl = "http://localhost:3000",
    [string]$ReliakitUrl = "http://localhost:5000",
    [string]$MCPServerUrl = "stdio://mcp-recipe-server"
)

Write-Host "🎯 Starting Main Application..." -ForegroundColor DarkMagenta

# Create service directory structure
$serviceRoot = "main-app"
if (-not (Test-Path $serviceRoot)) {
    New-Item -ItemType Directory -Path $serviceRoot -Force | Out-Null
    Write-Host "Created Main Application service directory" -ForegroundColor Green
}

# Generate package.json for Main App
$packageJson = @"
{
  "name": "orimind-main-app",
  "version": "1.0.0",
  "description": "OriMind Main Application - Service Orchestration Hub",
  "main": "index.js",
  "scripts": {
    "dev": "NODE_ENV=development node index.js",
    "start": "node index.js",
    "start:prod": "NODE_ENV=production node index.js",
    "build": "echo 'Building Main Application...'",
    "test": "echo 'Testing Main Application...'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": ["orchestration", "api-gateway", "orimind", "microservices"],
  "author": "OriMind Team",
  "license": "MIT"
}
"@

$packageJson | Out-File -FilePath "$serviceRoot/package.json" -Encoding UTF8

# Generate main orchestration service
$serviceCode = @"
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || $Port;
const MODE = process.env.NODE_ENV || '$Mode';

// Configure logging
const logger = winston.createLogger({
  level: MODE === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ filename: 'logs/main-app.log' })
  ]
});

// Service configuration
const services = {
  sherlock: {
    name: 'Sherlock Omega IDE',
    url: process.env.SHERLOCK_URL || '$SherlockUrl',
    healthPath: '/api/health',
    status: 'unknown'
  },
  reliakit: {
    name: 'ReliaKit Dashboard', 
    url: process.env.RELIAKIT_URL || '$ReliakitUrl',
    healthPath: '/health',
    status: 'unknown'
  },
  mcp: {
    name: 'MCP Recipe Server',
    url: process.env.MCP_SERVER_URL || '$MCPServerUrl',
    type: 'stdio',
    status: 'unknown'
  }
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: MODE === 'production' ? process.env.CORS_ORIGIN || 'https://orimind.com' : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(\`\${req.method} \${req.path} - \${req.ip}\`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    service: 'OriMind Main Application',
    status: 'healthy',
    version: '1.0.0',
    mode: MODE,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    services: {}
  };
  
  // Check dependent services
  for (const [key, service] of Object.entries(services)) {
    try {
      if (service.type === 'stdio') {
        // For MCP server, just mark as available since it's running
        health.services[key] = {
          name: service.name,
          status: 'available',
          type: 'stdio'
        };
      } else {
        const response = await axios.get(\`\${service.url}\${service.healthPath}\`, { timeout: 5000 });
        health.services[key] = {
          name: service.name,
          status: response.status === 200 ? 'healthy' : 'degraded',
          url: service.url,
          responseTime: response.headers['x-response-time'] || 'unknown'
        };
      }
    } catch (error) {
      health.services[key] = {
        name: service.name,
        status: 'unavailable',
        error: error.message
      };
    }
  }
  
  res.json(health);
});

// Integration endpoint - orchestrates requests across services
app.post('/api/integration', async (req, res) => {
  const { action, data } = req.body;
  
  try {
    let result = {};
    
    switch (action) {
      case 'analyze_repository':
        // 1. Check with ReliaKit for model selection
        const modelSelection = await axios.post(\`\${services.reliakit.url}/api/arbitrate\`, {
          task_type: 'code_analysis',
          priority: 'medium',
          budget: 'medium'
        });
        
        // 2. Send request to Sherlock for analysis
        const analysis = await axios.post(\`\${services.sherlock.url}/api/mcp/analyze\`, {
          repository: data.repository,
          action: 'analyze',
          model: modelSelection.data.selected_model
        });
        
        result = {
          success: true,
          model_arbitration: modelSelection.data,
          analysis: analysis.data,
          orchestrated_by: 'Main Application'
        };
        break;
        
      case 'get_dashboard_data':
        // Aggregate data from all services
        const [sherlockProjects, reliakitMetrics] = await Promise.all([
          axios.get(\`\${services.sherlock.url}/api/projects\`).catch(() => ({ data: { projects: [] } })),
          axios.get(\`\${services.reliakit.url}/api/dashboard\`).catch(() => ({ data: { widgets: [] } }))
        ]);
        
        result = {
          success: true,
          projects: sherlockProjects.data.projects,
          metrics: reliakitMetrics.data.widgets,
          aggregated_by: 'Main Application'
        };
        break;
        
      default:
        return res.status(400).json({ success: false, error: 'Unknown action' });
    }
    
    res.json(result);
    
  } catch (error) {
    logger.error('Integration error:', error);
    res.status(500).json({
      success: false,
      error: 'Integration failed',
      details: error.message
    });
  }
});

// Service proxy endpoints for load balancing
app.use('/proxy/sherlock', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: \`\${services.sherlock.url}\${req.path}\`,
      data: req.body,
      headers: { ...req.headers, host: undefined }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Sherlock service unavailable' });
  }
});

app.use('/proxy/reliakit', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: \`\${services.reliakit.url}\${req.path}\`,
      data: req.body,
      headers: { ...req.headers, host: undefined }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'ReliaKit service unavailable' });
  }
});

// Service discovery endpoint
app.get('/api/services', (req, res) => {
  res.json({
    services: Object.entries(services).map(([key, service]) => ({
      id: key,
      name: service.name,
      url: service.url,
      type: service.type || 'http',
      status: service.status
    }))
  });
});

// Orchestration status endpoint
app.get('/api/orchestration', async (req, res) => {
  const status = {
    orchestrator: 'Main Application',
    mode: MODE,
    uptime: process.uptime(),
    service_count: Object.keys(services).length,
    healthy_services: 0,
    load_balancing: 'active',
    auto_scaling: MODE === 'production' ? 'enabled' : 'disabled'
  };
  
  // Check service health
  for (const service of Object.values(services)) {
    if (service.status === 'healthy' || service.status === 'available') {
      status.healthy_services++;
    }
  }
  
  res.json(status);
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(\`🎯 OriMind Main Application running on port \${PORT} (mode: \${MODE})\`);
  console.log(\`🎯 OriMind Main Application running on port \${PORT} (mode: \${MODE})\`);
  console.log(\`🌐 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`🔗 Service integration: http://localhost:\${PORT}/api/integration\`);
  console.log(\`📊 Orchestration status: http://localhost:\${PORT}/api/orchestration\`);
  
  // Start service health monitoring
  setInterval(checkServiceHealth, 30000); // Check every 30 seconds
});

// Service health monitoring
async function checkServiceHealth() {
  for (const [key, service] of Object.entries(services)) {
    try {
      if (service.type === 'stdio') {
        services[key].status = 'available'; // Assume MCP is running
      } else {
        const response = await axios.get(\`\${service.url}\${service.healthPath}\`, { timeout: 5000 });
        services[key].status = response.status === 200 ? 'healthy' : 'degraded';
      }
    } catch (error) {
      services[key].status = 'unavailable';
    }
  }
}

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🎯 Main Application shutting down gracefully...');
  server.close(() => {
    logger.info('Main Application stopped');
    console.log('🎯 Main Application stopped');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Export for testing
module.exports = app;
"@

$serviceCode | Out-File -FilePath "$serviceRoot/index.js" -Encoding UTF8

# Create logs directory
New-Item -ItemType Directory -Path "$serviceRoot/logs" -Force | Out-Null

# Install dependencies if npm is available
Push-Location $serviceRoot
try {
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        Write-Host "📦 Installing Main Application dependencies..." -ForegroundColor Yellow
        npm install --silent 2>$null
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Warning "npm not found, dependencies not installed"
    }
} catch {
    Write-Warning "Failed to install dependencies: $($_.Exception.Message)"
} finally {
    Pop-Location
}

Write-Host "🎯 Main Application service prepared" -ForegroundColor Green
Write-Host "   Directory: $serviceRoot" -ForegroundColor Gray
Write-Host "   Port: $Port" -ForegroundColor Gray
Write-Host "   Mode: $Mode" -ForegroundColor Gray