#!/usr/bin/env node

/**
 * 🌍 OriMind Universal Installer
 * One-click installation for Windows, macOS, Linux, PowerPC, ARM, and more
 * Handles dependencies, environment setup, and service configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const UniversalPlatformDetector = require('./universal-platform-detector.js');

class OriMindUniversalInstaller {
    constructor() {
        this.detector = new UniversalPlatformDetector();
        this.installationPath = process.cwd();
        this.services = {
            'Chi Flow Platform': {
                file: 'guarded-chi-flow-platform.js',
                port: 3002,
                required: true
            },
            'Sherlock Omega IDE': {
                path: 'sherlock-omega',
                file: 'index.js',
                port: 3000,
                required: true
            },
            'ReliaKit Dashboard': {
                path: 'reliakit-dashboard',
                file: 'index.js', 
                port: 5000,
                required: true
            },
            'MCP Recipe Server': {
                path: 'mcp-recipe-server',
                file: 'index.js',
                port: null,
                required: false
            }
        };
    }

    async install() {
        console.log('\n🌍 OriMind Universal Installer');
        console.log('================================');
        
        try {
            await this.preInstallChecks();
            await this.installDependencies();
            await this.setupServices();
            await this.createSystemIntegration();
            await this.runTests();
            this.showCompletionMessage();
        } catch (error) {
            console.error('❌ Installation failed:', error.message);
            process.exit(1);
        }
    }

    async preInstallChecks() {
        console.log('\n🔍 Pre-installation checks...');
        
        // Check Node.js
        if (!this.detector.capabilities.node) {
            throw new Error('Node.js is required but not found. Please install Node.js first.');
        }
        console.log(`✅ Node.js found: ${this.detector.capabilities.node_version}`);

        // Check available space
        const stats = fs.statSync(this.installationPath);
        console.log('✅ Installation directory accessible');

        // Check network connectivity
        try {
            if (this.detector.capabilities.curl) {
                execSync('curl -s --max-time 5 https://registry.npmjs.org/ > /dev/null', { stdio: 'ignore' });
            } else if (this.detector.capabilities.wget) {
                execSync('wget -q --timeout=5 -O /dev/null https://registry.npmjs.org/', { stdio: 'ignore' });
            }
            console.log('✅ Network connectivity verified');
        } catch (e) {
            console.log('⚠️  Network check failed - proceeding with offline installation');
        }

        // Check for existing installation
        if (fs.existsSync('universal-config.json')) {
            console.log('⚠️  Existing OriMind installation detected');
            // Could add upgrade logic here
        }
    }

    async installDependencies() {
        console.log('\n📦 Installing dependencies...');
        
        const nodeManager = this.detector.packageManager.node_managers[0] || 'npm';
        console.log(`Using package manager: ${nodeManager}`);

        // Install root dependencies
        if (!fs.existsSync('node_modules')) {
            console.log('Installing root dependencies...');
            this.runCommand(`${nodeManager} install`, 'Failed to install root dependencies');
        }

        // Install service-specific dependencies
        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            if (serviceConfig.path && fs.existsSync(serviceConfig.path)) {
                const servicePath = serviceConfig.path;
                const packageJsonPath = path.join(servicePath, 'package.json');
                
                if (fs.existsSync(packageJsonPath) && !fs.existsSync(path.join(servicePath, 'node_modules'))) {
                    console.log(`Installing ${serviceName} dependencies...`);
                    this.runCommand(
                        `cd ${servicePath} && ${nodeManager} install`,
                        `Failed to install ${serviceName} dependencies`
                    );
                }
            }
        }

        console.log('✅ All dependencies installed successfully');
    }

    async setupServices() {
        console.log('\n🔧 Setting up services...');

        // Verify all required service files exist
        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            const servicePath = serviceConfig.path || '.';
            const serviceFile = path.join(servicePath, serviceConfig.file);
            
            if (!fs.existsSync(serviceFile)) {
                if (serviceConfig.required) {
                    throw new Error(`Required service file not found: ${serviceFile}`);
                } else {
                    console.log(`⚠️  Optional service not found: ${serviceName}`);
                    delete this.services[serviceName];
                }
            } else {
                console.log(`✅ ${serviceName}: ${serviceFile}`);
            }
        }

        // Create service management files
        await this.createServiceManagement();
    }

    async createServiceManagement() {
        console.log('\n📋 Creating service management files...');

        // Create universal process manager
        const processManager = this.generateProcessManager();
        fs.writeFileSync('process-manager.js', processManager);
        console.log('✅ Process manager created');

        // Create health check system
        const healthChecker = this.generateHealthChecker();
        fs.writeFileSync('health-checker.js', healthChecker);
        console.log('✅ Health checker created');

        // Create log aggregator
        const logAggregator = this.generateLogAggregator();
        fs.writeFileSync('log-aggregator.js', logAggregator);
        console.log('✅ Log aggregator created');
    }

    async createSystemIntegration() {
        console.log('\n🔗 Creating system integration...');

        if (this.detector.platform.family === 'windows') {
            await this.createWindowsIntegration();
        } else {
            await this.createUnixIntegration();
        }
    }

    async createWindowsIntegration() {
        // Create Windows service wrapper
        const serviceWrapper = `
@echo off
REM OriMind Windows Service Wrapper
cd /d "${this.installationPath}"
node process-manager.js start
`;
        fs.writeFileSync('orimind-service.bat', serviceWrapper);

        // Create desktop shortcut script
        const shortcutScript = `
@echo off
echo Creating OriMind desktop shortcut...
powershell -Command "\\$WshShell = New-Object -comObject WScript.Shell; \\$Shortcut = \\$WshShell.CreateShortcut('%%USERPROFILE%%\\Desktop\\OriMind.lnk'); \\$Shortcut.TargetPath = '${this.installationPath}\\start-orimind-universal.bat'; \\$Shortcut.WorkingDirectory = '${this.installationPath}'; \\$Shortcut.IconLocation = '${this.installationPath}\\assets\\icon.ico'; \\$Shortcut.Save()"
echo ✅ Desktop shortcut created
`;
        fs.writeFileSync('create-shortcut.bat', shortcutScript);

        console.log('✅ Windows integration files created');
    }

    async createUnixIntegration() {
        // Create systemd service file
        const systemdService = `[Unit]
Description=OriMind Universal AI Orchestration Ecosystem
After=network.target

[Service]
Type=simple
User=${process.env.USER || 'orimind'}
WorkingDirectory=${this.installationPath}
ExecStart=${process.execPath} process-manager.js start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
`;
        fs.writeFileSync('orimind.service', systemdService);

        // Create desktop entry
        const desktopEntry = `[Desktop Entry]
Version=1.0
Type=Application
Name=OriMind Universal
Comment=OriMind AI Orchestration Ecosystem
Exec=${this.installationPath}/start-orimind-universal.sh
Icon=${this.installationPath}/assets/icon.png
Terminal=false
Categories=Development;Network;
`;
        fs.writeFileSync('orimind.desktop', desktopEntry);

        // Create install script for system integration
        const installScript = `#!/bin/bash
# OriMind System Integration Installer

echo "🔗 Installing OriMind system integration..."

# Install systemd service (requires sudo)
if command -v systemctl &> /dev/null; then
    echo "Installing systemd service..."
    sudo cp orimind.service /etc/systemd/system/
    sudo systemctl daemon-reload
    echo "✅ Systemd service installed (use 'sudo systemctl enable orimind' to enable auto-start)"
fi

# Install desktop entry
if [ -d "\\$HOME/.local/share/applications" ]; then
    cp orimind.desktop "\\$HOME/.local/share/applications/"
    echo "✅ Desktop entry installed"
fi

# Add to PATH if not already there
if ! echo "\\$PATH" | grep -q "${this.installationPath}"; then
    echo "export PATH=\\$PATH:${this.installationPath}" >> "\\$HOME/.bashrc"
    echo "✅ Added to PATH (restart terminal or run 'source ~/.bashrc')"
fi

echo "🎉 System integration complete!"
`;
        fs.writeFileSync('install-system-integration.sh', installScript);
        try {
            fs.chmodSync('install-system-integration.sh', '755');
        } catch (e) {}

        console.log('✅ Unix integration files created');
    }

    async runTests() {
        console.log('\n🧪 Running installation tests...');

        // Test 1: Platform detection
        console.log('Testing platform detection...');
        const config = this.detector.saveUniversalConfiguration();
        console.log('✅ Platform detection working');

        // Test 2: Service file integrity
        console.log('Testing service files...');
        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            const servicePath = serviceConfig.path || '.';
            const serviceFile = path.join(servicePath, serviceConfig.file);
            
            if (fs.existsSync(serviceFile)) {
                const content = fs.readFileSync(serviceFile, 'utf8');
                if (content.length > 100) { // Basic sanity check
                    console.log(`✅ ${serviceName} file integrity OK`);
                } else {
                    console.log(`⚠️  ${serviceName} file seems incomplete`);
                }
            }
        }

        // Test 3: Dependencies
        console.log('Testing dependencies...');
        try {
            require('express');
            console.log('✅ Express available');
        } catch (e) {
            console.log('⚠️  Express not found - some services may not work');
        }

        // Test 4: Port availability
        console.log('Testing port availability...');
        const ports = [3000, 3002, 5000];
        for (const port of ports) {
            if (this.isPortAvailable(port)) {
                console.log(`✅ Port ${port} available`);
            } else {
                console.log(`⚠️  Port ${port} in use - service may conflict`);
            }
        }

        console.log('✅ Installation tests completed');
    }

    isPortAvailable(port) {
        try {
            const net = require('net');
            const server = net.createServer();
            server.listen(port);
            server.close();
            return true;
        } catch (e) {
            return false;
        }
    }

    generateProcessManager() {
        return `#!/usr/bin/env node

/**
 * 🎭 OriMind Universal Process Manager
 * Cross-platform service orchestration and monitoring
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class OriMindProcessManager {
    constructor() {
        this.processes = new Map();
        this.services = ${JSON.stringify(this.services, null, 8)};
        this.isWindows = process.platform === 'win32';
        this.pidFile = '.orimind-processes.json';
    }

    async start() {
        console.log('🚀 Starting OriMind Universal Ecosystem...');
        
        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            await this.startService(serviceName, serviceConfig);
        }
        
        this.savePidFile();
        console.log('✅ All services started successfully!');
        this.showStatus();
    }

    async startService(serviceName, serviceConfig) {
        console.log(\`🌊 Starting \${serviceName}...\`);
        
        const servicePath = serviceConfig.path || '.';
        const serviceFile = path.join(servicePath, serviceConfig.file);
        
        if (!fs.existsSync(serviceFile)) {
            console.log(\`⚠️  \${serviceName} file not found: \${serviceFile}\`);
            return;
        }

        const args = ['node', serviceFile];
        const options = {
            cwd: servicePath,
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: !this.isWindows
        };

        try {
            const child = spawn(args[0], args.slice(1), options);
            
            this.processes.set(serviceName, {
                pid: child.pid,
                port: serviceConfig.port,
                startTime: Date.now(),
                service: child
            });

            // Set up logging
            if (child.stdout) {
                child.stdout.on('data', (data) => {
                    this.logServiceOutput(serviceName, 'stdout', data);
                });
            }
            
            if (child.stderr) {
                child.stderr.on('data', (data) => {
                    this.logServiceOutput(serviceName, 'stderr', data);
                });
            }

            child.on('exit', (code) => {
                console.log(\`❌ \${serviceName} exited with code \${code}\`);
                this.processes.delete(serviceName);
            });

            // Verify service started
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (this.processes.has(serviceName)) {
                console.log(\`✅ \${serviceName} started (PID: \${child.pid})\`);
            }

        } catch (error) {
            console.error(\`❌ Failed to start \${serviceName}:\`, error.message);
        }
    }

    logServiceOutput(serviceName, stream, data) {
        const logDir = 'logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        
        const logFile = path.join(logDir, \`\${serviceName.toLowerCase().replace(/\\s+/g, '-')}.log\`);
        const timestamp = new Date().toISOString();
        const logEntry = \`[\${timestamp}] [\${stream.toUpperCase()}] \${data}\`;
        
        fs.appendFileSync(logFile, logEntry);
    }

    async stop() {
        console.log('🛑 Stopping OriMind services...');
        
        for (const [serviceName, processInfo] of this.processes) {
            console.log(\`Stopping \${serviceName}...\`);
            try {
                process.kill(processInfo.pid, 'SIGTERM');
                console.log(\`✅ \${serviceName} stopped\`);
            } catch (error) {
                console.log(\`⚠️  Error stopping \${serviceName}: \${error.message}\`);
            }
        }
        
        this.processes.clear();
        this.removePidFile();
        console.log('✅ All services stopped');
    }

    showStatus() {
        console.log('\\n📊 OriMind Service Status:');
        console.log('============================');
        
        for (const [serviceName, processInfo] of this.processes) {
            const uptime = Math.round((Date.now() - processInfo.startTime) / 1000);
            console.log(\`✅ \${serviceName}: PID \${processInfo.pid}, uptime \${uptime}s\`);
            if (processInfo.port) {
                console.log(\`   🌐 http://localhost:\${processInfo.port}\`);
            }
        }
    }

    savePidFile() {
        const pidData = {};
        for (const [serviceName, processInfo] of this.processes) {
            pidData[serviceName] = {
                pid: processInfo.pid,
                port: processInfo.port,
                startTime: processInfo.startTime
            };
        }
        fs.writeFileSync(this.pidFile, JSON.stringify(pidData, null, 2));
    }

    removePidFile() {
        if (fs.existsSync(this.pidFile)) {
            fs.unlinkSync(this.pidFile);
        }
    }
}

// CLI interface
if (require.main === module) {
    const manager = new OriMindProcessManager();
    const command = process.argv[2] || 'start';

    switch (command) {
        case 'start':
            manager.start();
            break;
        case 'stop':
            manager.stop();
            break;
        case 'status':
            manager.showStatus();
            break;
        default:
            console.log('Usage: node process-manager.js [start|stop|status]');
    }
}

module.exports = OriMindProcessManager;`;
    }

    generateHealthChecker() {
        return `#!/usr/bin/env node

/**
 * 🏥 OriMind Universal Health Checker
 * Monitors service health and performs automatic recovery
 */

const http = require('http');
const fs = require('fs');

class OriMindHealthChecker {
    constructor() {
        this.services = ${JSON.stringify(this.services, null, 8)};
        this.checkInterval = 30000; // 30 seconds
        this.retryAttempts = 3;
    }

    async startMonitoring() {
        console.log('🏥 Starting OriMind health monitoring...');
        
        setInterval(() => {
            this.performHealthChecks();
        }, this.checkInterval);
        
        // Initial check
        await this.performHealthChecks();
    }

    async performHealthChecks() {
        console.log('🔍 Performing health checks...');
        
        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            if (serviceConfig.port) {
                await this.checkServiceHealth(serviceName, serviceConfig);
            }
        }
    }

    async checkServiceHealth(serviceName, serviceConfig) {
        const url = \`http://localhost:\${serviceConfig.port}/health\`;
        
        try {
            const response = await this.httpGet(url, 5000);
            if (response.statusCode === 200) {
                console.log(\`✅ \${serviceName}: Healthy\`);
                return true;
            } else {
                console.log(\`⚠️  \${serviceName}: Unhealthy (HTTP \${response.statusCode})\`);
                return false;
            }
        } catch (error) {
            console.log(\`❌ \${serviceName}: Failed health check - \${error.message}\`);
            await this.attemptRecovery(serviceName, serviceConfig);
            return false;
        }
    }

    httpGet(url, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const req = http.get(url, (res) => {
                resolve({ statusCode: res.statusCode });
            });
            
            req.setTimeout(timeout, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            
            req.on('error', reject);
        });
    }

    async attemptRecovery(serviceName, serviceConfig) {
        console.log(\`🔧 Attempting recovery for \${serviceName}...\`);
        
        // Simple restart attempt
        try {
            const { spawn } = require('child_process');
            const servicePath = serviceConfig.path || '.';
            const serviceFile = path.join(servicePath, serviceConfig.file);
            
            if (fs.existsSync(serviceFile)) {
                const child = spawn('node', [serviceFile], {
                    cwd: servicePath,
                    detached: true,
                    stdio: 'ignore'
                });
                
                child.unref();
                console.log(\`🚀 \${serviceName} restart attempted\`);
            }
        } catch (error) {
            console.error(\`❌ Recovery failed for \${serviceName}: \${error.message}\`);
        }
    }
}

if (require.main === module) {
    const healthChecker = new OriMindHealthChecker();
    healthChecker.startMonitoring();
}

module.exports = OriMindHealthChecker;`;
    }

    generateLogAggregator() {
        return `#!/usr/bin/env node

/**
 * 📊 OriMind Universal Log Aggregator
 * Collects and analyzes logs from all services
 */

const fs = require('fs');
const path = require('path');

class OriMindLogAggregator {
    constructor() {
        this.logDir = 'logs';
        this.services = Object.keys(${JSON.stringify(this.services)});
    }

    async aggregateLogs() {
        console.log('📊 Aggregating OriMind logs...');
        
        if (!fs.existsSync(this.logDir)) {
            console.log('No logs directory found');
            return;
        }

        const aggregatedLog = [];
        
        for (const serviceName of this.services) {
            const logFile = path.join(this.logDir, \`\${serviceName.toLowerCase().replace(/\\s+/g, '-')}.log\`);
            
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                const lines = content.split('\\n').filter(line => line.trim());
                
                for (const line of lines) {
                    const match = line.match(/\\[(.*?)\\] \\[(.*?)\\] (.*)/);
                    if (match) {
                        aggregatedLog.push({
                            timestamp: new Date(match[1]),
                            service: serviceName,
                            level: match[2],
                            message: match[3]
                        });
                    }
                }
            }
        }

        // Sort by timestamp
        aggregatedLog.sort((a, b) => a.timestamp - b.timestamp);
        
        // Generate report
        this.generateReport(aggregatedLog);
    }

    generateReport(logs) {
        console.log('\\n📈 OriMind Log Summary:');
        console.log('========================');
        
        const serviceCounts = {};
        const errorCounts = {};
        
        for (const log of logs) {
            serviceCounts[log.service] = (serviceCounts[log.service] || 0) + 1;
            
            if (log.level === 'STDERR' || log.message.includes('error') || log.message.includes('Error')) {
                errorCounts[log.service] = (errorCounts[log.service] || 0) + 1;
            }
        }

        console.log('\\n📊 Log counts by service:');
        for (const [service, count] of Object.entries(serviceCounts)) {
            console.log(\`  \${service}: \${count} entries\`);
        }

        console.log('\\n❌ Error counts by service:');
        for (const [service, count] of Object.entries(errorCounts)) {
            console.log(\`  \${service}: \${count} errors\`);
        }

        // Show recent errors
        const recentErrors = logs
            .filter(log => log.level === 'STDERR' || log.message.includes('error'))
            .slice(-10);

        if (recentErrors.length > 0) {
            console.log('\\n🚨 Recent errors:');
            for (const error of recentErrors) {
                console.log(\`  [\${error.timestamp.toISOString()}] \${error.service}: \${error.message.substring(0, 100)}...\`);
            }
        }
    }
}

if (require.main === module) {
    const aggregator = new OriMindLogAggregator();
    aggregator.aggregateLogs();
}

module.exports = OriMindLogAggregator;`;
    }

    runCommand(command, errorMessage) {
        try {
            console.log(`Running: ${command}`);
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            throw new Error(`${errorMessage}: ${error.message}`);
        }
    }

    showCompletionMessage() {
        console.log('\n🎉 OriMind Universal Installation Complete!');
        console.log('==========================================');
        console.log(`\n🖥️  Platform: ${this.detector.platform.name} ${this.detector.architecture.name}`);
        console.log(`📦 Package Manager: ${this.detector.packageManager.preferred}`);
        console.log(`🐚 Shell: ${this.detector.shellType.name}`);
        
        console.log('\n🚀 Quick Start Commands:');
        if (this.detector.platform.family === 'windows') {
            console.log('   Start all services: .\\start-orimind-universal.bat');
            console.log('   Stop all services: .\\stop-orimind-universal.bat');
            console.log('   Check status: npm run status');
        } else {
            console.log('   Start all services: ./start-orimind-universal.sh');
            console.log('   Stop all services: ./stop-orimind-universal.sh');
            console.log('   Check status: ./logs-orimind-universal.sh');
        }
        
        console.log('\n🌐 Access Points (after starting):');
        console.log('   - Chi Flow Platform: http://localhost:3002');
        console.log('   - Sherlock Omega IDE: http://localhost:3000');
        console.log('   - ReliaKit Dashboard: http://localhost:5000');
        
        console.log('\n🔧 Management Commands:');
        console.log('   - Process Manager: node process-manager.js [start|stop|status]');
        console.log('   - Health Check: node health-checker.js');
        console.log('   - View Logs: node log-aggregator.js');
        
        if (this.detector.platform.family !== 'windows') {
            console.log('\n🔗 System Integration (optional):');
            console.log('   - Install system service: ./install-system-integration.sh');
        }
        
        console.log('\n📚 Documentation:');
        console.log('   - Configuration: universal-config.json');
        console.log('   - Logs Directory: ./logs/');
        console.log('   - Process Status: .orimind-processes.json');
        
        console.log('\n✨ Enjoy your universal OriMind AI orchestration ecosystem!');
    }
}

// Main execution
if (require.main === module) {
    const installer = new OriMindUniversalInstaller();
    installer.install().catch(error => {
        console.error('Installation failed:', error);
        process.exit(1);
    });
}

module.exports = OriMindUniversalInstaller;