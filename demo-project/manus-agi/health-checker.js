#!/usr/bin/env node

/**
 * 🏥 OriMind Universal Health Checker
 * Monitors service health and performs automatic recovery
 */

const http = require('http');
const fs = require('fs');

class OriMindHealthChecker {
    constructor() {
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
        const url = `http://localhost:${serviceConfig.port}/health`;
        
        try {
            const response = await this.httpGet(url, 5000);
            if (response.statusCode === 200) {
                console.log(`✅ ${serviceName}: Healthy`);
                return true;
            } else {
                console.log(`⚠️  ${serviceName}: Unhealthy (HTTP ${response.statusCode})`);
                return false;
            }
        } catch (error) {
            console.log(`❌ ${serviceName}: Failed health check - ${error.message}`);
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
        console.log(`🔧 Attempting recovery for ${serviceName}...`);
        
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
                console.log(`🚀 ${serviceName} restart attempted`);
            }
        } catch (error) {
            console.error(`❌ Recovery failed for ${serviceName}: ${error.message}`);
        }
    }
}

if (require.main === module) {
    const healthChecker = new OriMindHealthChecker();
    healthChecker.startMonitoring();
}

module.exports = OriMindHealthChecker;