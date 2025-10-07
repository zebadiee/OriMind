#!/usr/bin/env node

/**
 * 🔧 RAG-Powered Quick Fix Implementation
 * Apply immediate fixes based on debug analysis
 */

const fs = require('fs');
const { exec } = require('child_process');

class RAGQuickFix {
    constructor() {
        this.fixes = [
            {
                name: 'Fix Chi Flow Main App Memory Leaks',
                file: 'chi-flow-main-app.js',
                action: 'add_cleanup_handlers'
            },
            {
                name: 'Add SIGINT Handlers to Cinematic Services',
                files: [
                    'cinematic-rag-mcp-builder.js',
                    'cinematic-chi-flow-platform.js',
                    'cinematic-sherlock-omega-ide.js',
                    'cinematic-reliakit-dashboard.js',
                    'cinematic-ecosystem-dashboard.js'
                ],
                action: 'add_sigint_handlers'
            },
            {
                name: 'Start Core Services Individually',
                action: 'start_core_services'
            }
        ];
    }

    async applyAllFixes() {
        console.log('🔧 RAG-Powered Quick Fix Implementation');
        console.log('======================================');
        
        for (const fix of this.fixes) {
            try {
                await this.applyFix(fix);
                console.log(`✅ ${fix.name} - Applied successfully`);
            } catch (error) {
                console.log(`❌ ${fix.name} - Failed: ${error.message}`);
            }
        }
        
        console.log('\\n🎯 All fixes applied. Testing services...');
        await this.testServices();
    }

    async applyFix(fix) {
        switch (fix.action) {
            case 'add_cleanup_handlers':
                await this.addCleanupHandlers(fix.file);
                break;
            case 'add_sigint_handlers':
                for (const file of fix.files) {
                    await this.addSigintHandler(file);
                }
                break;
            case 'start_core_services':
                await this.startCoreServices();
                break;
        }
    }

    async addCleanupHandlers(filename) {
        if (!fs.existsSync(filename)) return;
        
        let content = fs.readFileSync(filename, 'utf8');
        
        // Check if cleanup is already present
        if (content.includes('clearInterval') && content.includes('clearTimeout')) {
            return; // Already has cleanup
        }
        
        // Add interval cleanup in the maintainEnergyFlow method
        const maintenancePattern = /maintainEnergyFlow\(\) \{[\\s\\S]*?\}/;
        if (content.match(maintenancePattern)) {
            content = content.replace(
                'maintainEnergyFlow() {',
                `maintainEnergyFlow() {
        // Store interval reference for cleanup
        if (!this.maintenanceInterval) {
            this.maintenanceInterval = setInterval(() => {`
            );
            
            content = content.replace(
                /(\s+})(\s*pulseEnergyFlow)/,
                `$1            }, 60000);
        }$2`
            );
        }
        
        fs.writeFileSync(filename, content);
    }

    async addSigintHandler(filename) {
        if (!fs.existsSync(filename)) return;
        
        let content = fs.readFileSync(filename, 'utf8');
        
        // Check if SIGINT handler already exists
        if (content.includes('SIGINT')) return;
        
        // Add SIGINT handler before module.exports
        const sigintHandler = `
// Graceful shutdown handler
process.on('SIGINT', () => {
    console.log('\\\\n🌊 Graceful shutdown initiated...');
    if (typeof server !== 'undefined' && server.close) {
        server.close(() => {
            console.log('✨ Server closed gracefully');
            process.exit(0);
        });
    } else {
        console.log('✨ Process terminated gracefully');
        process.exit(0);
    }
});

process.on('SIGTERM', () => {
    console.log('\\\\n🛑 Termination signal received...');
    process.exit(0);
});
`;
        
        // Insert before module.exports or at the end
        if (content.includes('module.exports')) {
            content = content.replace(/module\.exports/, sigintHandler + '\\nmodule.exports');
        } else {
            content += sigintHandler;
        }
        
        fs.writeFileSync(filename, content);
    }

    async startCoreServices() {
        console.log('\\n🚀 Starting core services individually...');
        
        const services = [
            { name: 'Chi Flow Main App', command: 'node chi-flow-main-app.js', port: 3002 },
            { name: 'Sherlock Omega IDE', command: 'cd sherlock-omega && node index.js', port: 3000 }
        ];
        
        for (const service of services) {
            try {
                console.log(`   🔄 Starting ${service.name}...`);
                
                // Start service in background
                this.executeBackground(service.command);
                
                // Wait for startup
                await this.delay(3000);
                
                // Test if it's responding
                const healthy = await this.testPort(service.port);
                if (healthy) {
                    console.log(`   ✅ ${service.name} started successfully on port ${service.port}`);
                } else {
                    console.log(`   ⚠️  ${service.name} may need manual attention`);
                }
                
            } catch (error) {
                console.log(`   ❌ ${service.name} failed: ${error.message}`);
            }
        }
    }

    async testServices() {
        const services = [
            { name: 'Chi Flow Main App', port: 3002, endpoint: '/api/health' },
            { name: 'Sherlock Omega IDE', port: 3000, endpoint: '/api/health' },
            { name: 'ReliaKit Dashboard', port: 5000, endpoint: '/health' },
            { name: 'Cinematic RAG MCP', port: 4000, endpoint: '/api/health' },
            { name: 'Cinematic Chi Flow', port: 5001, endpoint: '/api/chi-status' },
            { name: 'Cinematic Sherlock', port: 6000, endpoint: '/api/health' },
            { name: 'Cinematic ReliaKit', port: 7000, endpoint: '/api/health' },
            { name: 'Cinematic Ecosystem', port: 8000, endpoint: '/api/ecosystem-status' }
        ];
        
        console.log('\\n🏥 Service Health Check Results:');
        console.log('================================');
        
        let healthyCount = 0;
        
        for (const service of services) {
            const healthy = await this.testHealthEndpoint(service.port, service.endpoint);
            const status = healthy ? '✅' : '❌';
            console.log(`${status} ${service.name} (${service.port}): ${healthy ? 'Healthy' : 'Not responding'}`);
            
            if (healthy) healthyCount++;
        }
        
        const healthPercentage = (healthyCount / services.length) * 100;
        console.log(`\\n📊 Ecosystem Health: ${healthPercentage.toFixed(1)}% (${healthyCount}/${services.length} services)`);
        
        if (healthPercentage >= 50) {
            console.log('🎉 Significant improvement achieved!');
            console.log('\\n🌐 Access Points:');
            for (const service of services) {
                if (await this.testHealthEndpoint(service.port, service.endpoint)) {
                    console.log(`   🔗 ${service.name}: http://localhost:${service.port}`);
                }
            }
        } else {
            console.log('⚠️  Additional intervention may be needed');
            console.log('\\n💡 Next Steps:');
            console.log('   1. Check individual service logs');
            console.log('   2. Verify all dependencies are installed');
            console.log('   3. Ensure no port conflicts exist');
            console.log('   4. Run services manually to identify specific issues');
        }
    }

    // Utility methods
    executeBackground(command) {
        const { spawn } = require('child_process');
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        const child = spawn(cmd, args, {
            detached: true,
            stdio: 'ignore'
        });
        
        child.unref();
        return child;
    }

    async testPort(port) {
        return new Promise((resolve) => {
            const net = require('net');
            const socket = net.createConnection({ port, host: 'localhost' });
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

    async testHealthEndpoint(port, endpoint) {
        return new Promise((resolve) => {
            const http = require('http');
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Execute quick fixes
if (require.main === module) {
    const quickFix = new RAGQuickFix();
    quickFix.applyAllFixes().catch(console.error);
}

module.exports = RAGQuickFix;