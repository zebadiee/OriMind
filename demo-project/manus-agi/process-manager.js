#!/usr/bin/env node

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
        this.services = {
        "Chi Flow Platform": {
                "file": "guarded-chi-flow-platform.js",
                "port": 3002,
                "required": true
        },
        "Sherlock Omega IDE": {
                "path": "sherlock-omega",
                "file": "index.js",
                "port": 3000,
                "required": true
        },
        "ReliaKit Dashboard": {
                "path": "reliakit-dashboard",
                "file": "index.js",
                "port": 5000,
                "required": true
        }
};
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
        console.log(`🌊 Starting ${serviceName}...`);
        
        const servicePath = serviceConfig.path || '.';
        const serviceFile = path.join(servicePath, serviceConfig.file);
        
        if (!fs.existsSync(serviceFile)) {
            console.log(`⚠️  ${serviceName} file not found: ${serviceFile}`);
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
                console.log(`❌ ${serviceName} exited with code ${code}`);
                this.processes.delete(serviceName);
            });

            // Verify service started
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (this.processes.has(serviceName)) {
                console.log(`✅ ${serviceName} started (PID: ${child.pid})`);
            }

        } catch (error) {
            console.error(`❌ Failed to start ${serviceName}:`, error.message);
        }
    }

    logServiceOutput(serviceName, stream, data) {
        const logDir = 'logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        
        const logFile = path.join(logDir, `${serviceName.toLowerCase().replace(/\s+/g, '-')}.log`);
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${stream.toUpperCase()}] ${data}`;
        
        fs.appendFileSync(logFile, logEntry);
    }

    async stop() {
        console.log('🛑 Stopping OriMind services...');
        
        for (const [serviceName, processInfo] of this.processes) {
            console.log(`Stopping ${serviceName}...`);
            try {
                process.kill(processInfo.pid, 'SIGTERM');
                console.log(`✅ ${serviceName} stopped`);
            } catch (error) {
                console.log(`⚠️  Error stopping ${serviceName}: ${error.message}`);
            }
        }
        
        this.processes.clear();
        this.removePidFile();
        console.log('✅ All services stopped');
    }

    showStatus() {
        console.log('\n📊 OriMind Service Status:');
        console.log('============================');
        
        for (const [serviceName, processInfo] of this.processes) {
            const uptime = Math.round((Date.now() - processInfo.startTime) / 1000);
            console.log(`✅ ${serviceName}: PID ${processInfo.pid}, uptime ${uptime}s`);
            if (processInfo.port) {
                console.log(`   🌐 http://localhost:${processInfo.port}`);
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

module.exports = OriMindProcessManager;