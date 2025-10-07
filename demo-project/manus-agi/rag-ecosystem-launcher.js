#!/usr/bin/env node

/**
 * 🚀 RAG-Enhanced OriMind Ecosystem Launcher
 * Intelligent service startup with self-healing and monitoring
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

class RAGEcosystemLauncher {
    constructor() {
        this.services = [
            { name: 'Chi Flow Main App', file: 'chi-flow-main-app.js', port: 3002, priority: 1 },
            { name: 'Sherlock Omega IDE', file: 'sherlock-omega/index.js', port: 3000, priority: 2 },
            { name: 'ReliaKit Dashboard', file: 'reliakit-dashboard/index.js', port: 5000, priority: 3 },
            { name: 'Cinematic RAG MCP', file: 'cinematic-rag-mcp-builder.js', port: 4000, priority: 4 },
            { name: 'Cinematic Chi Flow', file: 'cinematic-chi-flow-platform.js', port: 5001, priority: 5 },
            { name: 'Cinematic Sherlock', file: 'cinematic-sherlock-omega-ide.js', port: 6000, priority: 6 },
            { name: 'Cinematic ReliaKit', file: 'cinematic-reliakit-dashboard.js', port: 7000, priority: 7 },
            { name: 'Cinematic Ecosystem', file: 'cinematic-ecosystem-dashboard.js', port: 8000, priority: 8 }
        ];
        
        this.runningProcesses = new Map();
        this.startupAttempts = new Map();
        this.healthChecks = new Map();
        this.maxRetries = 3;
        this.startupDelay = 2000; // 2 seconds between service starts
    }

    async launchEcosystem() {
        console.log('🚀 RAG-Enhanced OriMind Ecosystem Launcher');
        console.log('==========================================');
        
        // Pre-flight checks
        await this.performPreflightChecks();
        
        // Kill any existing processes first
        await this.cleanupExistingProcesses();
        
        // Install dependencies if needed
        await this.ensureDependencies();
        
        // Start services in priority order
        await this.startServicesSequentially();
        
        // Perform health verification
        await this.verifyEcosystemHealth();
        
        // Start monitoring
        this.startContinuousMonitoring();
        
        console.log('\\n🎉 OriMind Ecosystem Launch Complete!');
        this.displayAccessPoints();
    }

    async performPreflightChecks() {
        console.log('\\n🔍 Performing Pre-flight Checks...');
        
        // Check Node.js version
        try {
            const nodeVersion = await this.executeCommand('node --version');
            console.log(`   ✅ Node.js: ${nodeVersion.trim()}`);
        } catch (error) {
            console.log('   ❌ Node.js not found');
            process.exit(1);
        }
        
        // Check if files exist
        for (const service of this.services) {
            if (fs.existsSync(service.file)) {
                console.log(`   ✅ ${service.name}: File exists`);
            } else {
                console.log(`   ❌ ${service.name}: Missing file ${service.file}`);
                // Remove missing services from launch list
                this.services = this.services.filter(s => s.name !== service.name);
            }
        }
        
        console.log(`   📊 Services ready for launch: ${this.services.length}`);
    }

    async cleanupExistingProcesses() {
        console.log('\\n🧹 Cleaning up existing processes...');
        
        try {
            // Kill any existing node processes
            await this.executeCommand('taskkill /F /IM node.exe', true);
            console.log('   ✅ Existing processes cleaned');
            
            // Wait for ports to be freed
            await this.delay(3000);
        } catch (error) {
            console.log('   ℹ️  No existing processes to clean');
        }
    }

    async ensureDependencies() {
        console.log('\\n📦 Ensuring dependencies...');
        
        // Check if node_modules exists
        if (!fs.existsSync('node_modules')) {
            console.log('   📥 Installing dependencies...');
            try {
                await this.executeCommand('npm install');
                console.log('   ✅ Dependencies installed');
            } catch (error) {
                console.log('   ⚠️  Dependency installation failed, continuing...');
            }
        } else {
            console.log('   ✅ Dependencies already installed');
        }
        
        // Install subdirectory dependencies
        const subDirs = ['sherlock-omega', 'reliakit-dashboard', 'mcp-recipe-server'];
        for (const dir of subDirs) {
            if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'package.json'))) {
                if (!fs.existsSync(path.join(dir, 'node_modules'))) {
                    console.log(`   📥 Installing ${dir} dependencies...`);
                    try {
                        await this.executeCommand(`cd ${dir} && npm install`);
                        console.log(`   ✅ ${dir} dependencies installed`);
                    } catch (error) {
                        console.log(`   ⚠️  ${dir} dependency installation failed`);
                    }
                }
            }
        }
    }

    async startServicesSequentially() {
        console.log('\\n🌊 Starting services in Chi Flow sequence...');
        
        for (const service of this.services.sort((a, b) => a.priority - b.priority)) {
            console.log(`\\n🔄 Starting ${service.name}...`);
            
            try {
                const success = await this.startService(service);
                if (success) {
                    console.log(`   ✅ ${service.name} started successfully`);
                    await this.delay(this.startupDelay); // Allow service to stabilize
                } else {
                    console.log(`   ❌ ${service.name} failed to start`);
                }
            } catch (error) {
                console.log(`   ❌ ${service.name} startup error: ${error.message}`);
            }
        }
    }

    async startService(service) {
        const attemptKey = service.name;
        const attempts = this.startupAttempts.get(attemptKey) || 0;
        
        if (attempts >= this.maxRetries) {
            console.log(`   ⚠️  Max retries reached for ${service.name}`);
            return false;
        }
        
        this.startupAttempts.set(attemptKey, attempts + 1);
        
        return new Promise((resolve) => {
            // Check if port is already in use
            this.testPort(service.port).then(portInUse => {
                if (portInUse) {
                    console.log(`   ⚠️  Port ${service.port} already in use, trying to start anyway`);
                }
                
                const child = spawn('node', [service.file], {
                    cwd: process.cwd(),
                    stdio: ['ignore', 'pipe', 'pipe'],
                    detached: false
                });

                this.runningProcesses.set(service.name, {
                    process: child,
                    service: service,
                    startTime: Date.now()
                });

                let output = '';
                child.stdout.on('data', (data) => {
                    output += data.toString();
                    // Look for startup success indicators
                    if (output.includes('listening') || output.includes('started') || output.includes('flowing')) {
                        console.log(`   🌊 ${service.name} energy flowing on port ${service.port}`);
                    }
                });

                child.stderr.on('data', (data) => {
                    const errorOutput = data.toString();
                    if (!errorOutput.includes('ExperimentalWarning')) {
                        console.log(`   ⚠️  ${service.name}: ${errorOutput.trim()}`);
                    }
                });

                // Give service time to start
                setTimeout(async () => {
                    if (!child.killed) {
                        // Test if service is actually responding
                        const responding = await this.testHealthEndpoint(service.port);
                        resolve(responding);
                    } else {
                        resolve(false);
                    }
                }, 5000);

                child.on('exit', (code) => {
                    if (code !== 0) {
                        console.log(`   ❌ ${service.name} exited with code ${code}`);
                        this.runningProcesses.delete(service.name);
                        resolve(false);
                    }
                });

                child.on('error', (error) => {
                    console.log(`   ❌ ${service.name} error: ${error.message}`);
                    this.runningProcesses.delete(service.name);
                    resolve(false);
                });
            });
        });
    }

    async verifyEcosystemHealth() {
        console.log('\\n🏥 Verifying Ecosystem Health...');
        
        let healthyServices = 0;
        const totalServices = this.services.length;
        
        for (const service of this.services) {
            const healthy = await this.testHealthEndpoint(service.port);
            const status = healthy ? '✅' : '❌';
            console.log(`   ${status} ${service.name} (${service.port}): ${healthy ? 'Healthy' : 'Unhealthy'}`);
            
            if (healthy) {
                healthyServices++;
                this.healthChecks.set(service.name, { status: 'healthy', lastCheck: Date.now() });
            } else {
                this.healthChecks.set(service.name, { status: 'unhealthy', lastCheck: Date.now() });
            }
        }
        
        const healthPercentage = (healthyServices / totalServices) * 100;
        console.log(`\\n📊 Ecosystem Health: ${healthPercentage.toFixed(1)}% (${healthyServices}/${totalServices} services)`);
        
        if (healthPercentage >= 70) {
            console.log('   🎯 Ecosystem is in good health!');
        } else if (healthPercentage >= 40) {
            console.log('   ⚠️  Ecosystem needs attention');
        } else {
            console.log('   🚨 Ecosystem requires immediate intervention');
        }
    }

    startContinuousMonitoring() {
        console.log('\\n👁️  Starting continuous monitoring...');
        
        // Health check every 30 seconds
        const healthCheckInterval = setInterval(async () => {
            await this.performHealthChecks();
        }, 30000);
        
        // Cleanup on exit
        process.on('SIGINT', () => {
            console.log('\\n🛑 Shutting down ecosystem gracefully...');
            clearInterval(healthCheckInterval);
            this.shutdownAllServices();
        });
        
        console.log('   ✅ Monitoring active - health checks every 30 seconds');
    }

    async performHealthChecks() {
        let issues = 0;
        
        for (const [serviceName, processInfo] of this.runningProcesses) {
            const service = processInfo.service;
            const healthy = await this.testHealthEndpoint(service.port);
            
            if (!healthy) {
                issues++;
                console.log(`⚠️  ${serviceName} health check failed - attempting restart`);
                
                // Kill unhealthy process
                try {
                    processInfo.process.kill('SIGTERM');
                } catch (error) {
                    // Process might already be dead
                }
                
                // Remove from running processes
                this.runningProcesses.delete(serviceName);
                
                // Attempt restart
                setTimeout(() => {
                    this.startService(service);
                }, 5000);
            }
        }
        
        if (issues === 0) {
            console.log('💚 All services healthy');
        }
    }

    shutdownAllServices() {
        console.log('\\n🌊 Gracefully closing all energy channels...');
        
        for (const [serviceName, processInfo] of this.runningProcesses) {
            try {
                processInfo.process.kill('SIGTERM');
                console.log(`   ✅ ${serviceName} gracefully stopped`);
            } catch (error) {
                console.log(`   ⚠️  ${serviceName} force stopped`);
            }
        }
        
        console.log('🙏 Chi flow complete - energy returns to source');
        process.exit(0);
    }

    displayAccessPoints() {
        console.log('\\n🌐 OriMind Ecosystem Access Points:');
        console.log('====================================');
        
        for (const [serviceName, processInfo] of this.runningProcesses) {
            const service = processInfo.service;
            console.log(`🌊 ${serviceName}:`);
            console.log(`   🔗 http://localhost:${service.port}`);
            console.log(`   💚 Health: http://localhost:${service.port}/api/health`);
            console.log('');
        }
        
        if (this.runningProcesses.size > 0) {
            console.log('🎯 Quick Health Check:');
            console.log('   curl http://localhost:3002/api/health  # Chi Flow Main App');
            console.log('   curl http://localhost:3000/api/health  # Sherlock IDE');
            console.log('   curl http://localhost:5000/health      # ReliaKit Dashboard');
            console.log('');
            console.log('🌟 Press Ctrl+C for graceful shutdown');
        }
    }

    // Utility methods
    async testPort(port) {
        return new Promise((resolve) => {
            const socket = require('net').createConnection({ port, host: 'localhost' });
            socket.on('connect', () => {
                socket.end();
                resolve(true);
            });
            socket.on('error', () => resolve(false));
            socket.setTimeout(2000, () => {
                socket.destroy();
                resolve(false);
            });
        });
    }

    async testHealthEndpoint(port) {
        const endpoints = ['/api/health', '/health', '/api/status', '/api/chi-status', '/api/ecosystem-status'];
        
        for (const endpoint of endpoints) {
            try {
                const result = await this.makeHealthRequest(port, endpoint);
                if (result) return true;
            } catch (error) {
                // Try next endpoint
            }
        }
        
        return false;
    }

    async makeHealthRequest(port, endpoint) {
        return new Promise((resolve) => {
            const req = http.request({
                hostname: 'localhost',
                port: port,
                path: endpoint,
                method: 'GET',
                timeout: 3000
            }, (res) => {
                resolve(res.statusCode >= 200 && res.statusCode < 300);
            });
            
            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
            
            req.end();
        });
    }

    async executeCommand(command, ignoreError = false) {
        return new Promise((resolve, reject) => {
            exec(command, { encoding: 'utf8', timeout: 30000 }, (error, stdout, stderr) => {
                if (error && !ignoreError) {
                    reject(new Error(`Command failed: ${error.message}`));
                } else {
                    resolve(stdout || stderr || 'Command executed');
                }
            });
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Launch the ecosystem
if (require.main === module) {
    const launcher = new RAGEcosystemLauncher();
    launcher.launchEcosystem().catch((error) => {
        console.error('\\n❌ Ecosystem launch failed:', error.message);
        process.exit(1);
    });
}

module.exports = RAGEcosystemLauncher;