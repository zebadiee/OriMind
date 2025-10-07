#!/usr/bin/env node

/**
 * 🌟 OriMind Ecosystem Integration Hub
 * Orchestrates all OriMind services including the new MCP Builder Assistant
 * Creates the ultimate AI-powered development environment
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

class OriMindEcosystemHub {
    constructor() {
        this.services = {
            'Chi Flow Platform': {
                file: 'guarded-chi-flow-platform.js',
                port: 3002,
                status: 'stopped',
                description: 'RAG-powered self-healing platform with Guardian monitoring'
            },
            'Sherlock Omega IDE': {
                path: 'sherlock-omega',
                file: 'index.js',
                port: 3000,
                status: 'stopped',
                description: 'Intelligent development environment with real-time collaboration'
            },
            'ReliaKit Dashboard': {
                path: 'reliakit-dashboard',
                file: 'index.js',
                port: 5000,
                status: 'stopped',
                description: 'Multi-model AI arbitration with intelligent routing'
            },
            'MCP Builder Assistant': {
                file: 'orimind-mcp-builder-assistant.js',
                port: 4000,
                status: 'stopped',
                description: 'Ultimate AI assistant for building Model Context Protocol servers'
            },
            'MCP Recipe Server': {
                path: 'mcp-recipe-server',
                file: 'index.js',
                port: null,
                status: 'stopped',
                description: 'GitHub Recipe Book MCP server'
            }
        };
        
        this.processes = new Map();
        this.healthChecks = new Map();
        this.isRunning = false;
        
        this.setupGracefulShutdown();
    }

    async startEcosystem() {
        console.log('🌟 OriMind Ecosystem Integration Hub');
        console.log('====================================');
        console.log('🚀 Starting the ultimate AI development environment...');
        console.log('');

        this.isRunning = true;

        // Start services in optimal order for dependencies
        const startOrder = [
            'Chi Flow Platform',
            'ReliaKit Dashboard', 
            'MCP Builder Assistant',
            'Sherlock Omega IDE',
            'MCP Recipe Server'
        ];

        for (const serviceName of startOrder) {
            await this.startService(serviceName);
            await this.waitForService(serviceName);
        }

        // Start health monitoring
        this.startHealthMonitoring();
        
        // Show ecosystem status
        await this.showEcosystemStatus();
        
        console.log('');
        console.log('🎉 OriMind Ecosystem fully operational!');
        console.log('💡 The ultimate AI-powered development environment is ready');
        console.log('');
        this.showQuickStart();
    }

    async startService(serviceName) {
        const serviceConfig = this.services[serviceName];
        if (!serviceConfig) {
            console.log(`❌ Unknown service: ${serviceName}`);
            return false;
        }

        console.log(`🌊 Starting ${serviceName}...`);
        
        const servicePath = serviceConfig.path || '.';
        const serviceFile = path.join(servicePath, serviceConfig.file);
        
        if (!fs.existsSync(serviceFile)) {
            console.log(`⚠️  Service file not found: ${serviceFile}`);
            return false;
        }

        try {
            const child = spawn('node', [serviceFile], {
                cwd: servicePath,
                stdio: ['ignore', 'pipe', 'pipe'],
                detached: process.platform !== 'win32'
            });

            this.processes.set(serviceName, {
                process: child,
                pid: child.pid,
                startTime: Date.now(),
                port: serviceConfig.port
            });

            // Handle output
            child.stdout.on('data', (data) => {
                console.log(`[${serviceName}] ${data.toString().trim()}`);
            });

            child.stderr.on('data', (data) => {
                console.error(`[${serviceName}] ${data.toString().trim()}`);
            });

            child.on('exit', (code) => {
                console.log(`❌ ${serviceName} exited with code ${code}`);
                this.processes.delete(serviceName);
                serviceConfig.status = 'stopped';
            });

            serviceConfig.status = 'starting';
            console.log(`✅ ${serviceName} started (PID: ${child.pid})`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to start ${serviceName}: ${error.message}`);
            return false;
        }
    }

    async waitForService(serviceName, maxWait = 30000) {
        const serviceConfig = this.services[serviceName];
        const processInfo = this.processes.get(serviceName);
        
        if (!processInfo || !serviceConfig.port) {
            return true; // Skip waiting for services without ports
        }

        console.log(`⏳ Waiting for ${serviceName} to be ready...`);
        
        const startTime = Date.now();
        while (Date.now() - startTime < maxWait) {
            try {
                await this.checkServiceHealth(serviceName);
                serviceConfig.status = 'running';
                console.log(`✅ ${serviceName} is ready!`);
                return true;
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log(`⚠️  ${serviceName} took too long to start`);
        return false;
    }

    async checkServiceHealth(serviceName) {
        const serviceConfig = this.services[serviceName];
        const port = serviceConfig.port;
        
        if (!port) return true;

        return new Promise((resolve, reject) => {
            const req = http.get(`http://localhost:${port}/api/health`, (res) => {
                if (res.statusCode === 200) {
                    resolve(true);
                } else {
                    reject(new Error(`Health check failed: ${res.statusCode}`));
                }
            });

            req.on('error', reject);
            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('Health check timeout'));
            });
        });
    }

    startHealthMonitoring() {
        console.log('🏥 Starting health monitoring...');
        
        setInterval(async () => {
            for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
                if (this.processes.has(serviceName)) {
                    try {
                        await this.checkServiceHealth(serviceName);
                        serviceConfig.status = 'running';
                    } catch (error) {
                        console.log(`⚠️  ${serviceName} health check failed: ${error.message}`);
                        serviceConfig.status = 'unhealthy';
                    }
                }
            }
        }, 30000); // Check every 30 seconds
    }

    async showEcosystemStatus() {
        console.log('');
        console.log('📊 OriMind Ecosystem Status:');
        console.log('============================');
        
        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            const processInfo = this.processes.get(serviceName);
            const statusIcon = this.getStatusIcon(serviceConfig.status);
            const portInfo = serviceConfig.port ? ` (Port ${serviceConfig.port})` : '';
            
            console.log(`${statusIcon} ${serviceName}${portInfo}`);
            console.log(`   ${serviceConfig.description}`);
            
            if (processInfo) {
                const uptime = Math.round((Date.now() - processInfo.startTime) / 1000);
                console.log(`   PID: ${processInfo.pid}, Uptime: ${uptime}s`);
            }
            console.log('');
        }
    }

    getStatusIcon(status) {
        switch (status) {
            case 'running': return '✅';
            case 'starting': return '🔄';
            case 'unhealthy': return '⚠️ ';
            case 'stopped': return '❌';
            default: return '❓';
        }
    }

    showQuickStart() {
        console.log('🚀 OriMind Ecosystem Quick Start:');
        console.log('=================================');
        console.log('');
        console.log('🌐 Web Interfaces:');
        console.log('   🌊 Chi Flow Platform:    http://localhost:3002');
        console.log('   🔍 Sherlock Omega IDE:   http://localhost:3000');
        console.log('   🤖 ReliaKit Dashboard:   http://localhost:5000');
        console.log('   🛠️  MCP Builder:          http://localhost:4000');
        console.log('');
        console.log('🎯 Key Features:');
        console.log('   🧠 RAG-Powered Learning:  All interactions build institutional knowledge');
        console.log('   🤖 11 AI Models:          DeepSeek, GPT-4, Claude, Gemini, Llama, and more');
        console.log('   ⚡ Intelligent Arbitration: Automatic model selection for optimal results');
        console.log('   🔧 MCP Builder:           AI-powered assistant for building MCP servers');
        console.log('   👁️  Guardian Monitoring:   Continuous health checks and auto-healing');
        console.log('');
        console.log('💡 Getting Started with MCP Builder:');
        console.log('   1. Open http://localhost:4000 in your browser');
        console.log('   2. Describe what kind of MCP you want to build');
        console.log('   3. Let the AI assistant guide you through the process');
        console.log('   4. Get fully functional MCP code with tests and docs');
        console.log('');
        console.log('🌟 The future of AI-powered development is here!');
    }

    async integrateMCPBuilder() {
        console.log('🔗 Integrating MCP Builder with OriMind ecosystem...');
        
        // Create integration configuration
        const integrationConfig = {
            mcp_builder: {
                url: 'http://localhost:4000',
                features: {
                    ai_arbitration: 'http://localhost:5000/api/arbitrate',
                    rag_learning: 'http://localhost:3002/api/guardian/wisdom',
                    code_analysis: 'http://localhost:3000/api/analyze',
                    health_monitoring: 'http://localhost:3002/api/health'
                }
            },
            ecosystem_benefits: {
                shared_knowledge: 'MCP Builder learns from all OriMind interactions',
                model_arbitration: 'Uses ReliaKit for optimal AI model selection',
                code_intelligence: 'Integrates with Sherlock for advanced code analysis',
                guardian_protection: 'Protected by Chi Flow Guardian monitoring'
            }
        };

        fs.writeFileSync('mcp-builder-integration.json', JSON.stringify(integrationConfig, null, 2));
        console.log('✅ MCP Builder integration configuration saved');
    }

    async demonstrateMCPBuilder() {
        console.log('');
        console.log('🎭 MCP Builder Assistant Demonstration:');
        console.log('=======================================');
        
        // Wait for MCP Builder to be ready
        try {
            await this.checkServiceHealth('MCP Builder Assistant');
            
            console.log('✅ MCP Builder Assistant is ready!');
            console.log('');
            console.log('🎯 Example MCP Projects You Can Build:');
            console.log('');
            
            const examples = [
                {
                    name: 'File System Manager',
                    description: 'Advanced file operations with smart search and organization',
                    complexity: 'Basic',
                    features: ['Read/write files', 'Directory traversal', 'File search', 'Metadata extraction']
                },
                {
                    name: 'Web Data Extractor',
                    description: 'Intelligent web scraping with AI-powered data extraction',
                    complexity: 'Intermediate',
                    features: ['URL fetching', 'HTML parsing', 'Data extraction', 'Rate limiting']
                },
                {
                    name: 'AI Model Router',
                    description: 'Smart routing between multiple AI models based on task type',
                    complexity: 'Advanced',
                    features: ['Model selection', 'Request routing', 'Response optimization', 'Cost tracking']
                },
                {
                    name: 'Security Scanner',
                    description: 'Comprehensive security analysis and vulnerability detection',
                    complexity: 'Expert',
                    features: ['Code scanning', 'Vulnerability detection', 'Compliance checking', 'Report generation']
                }
            ];

            examples.forEach((example, index) => {
                console.log(`${index + 1}. 🎯 ${example.name}`);
                console.log(`   📝 ${example.description}`);
                console.log(`   📊 Complexity: ${example.complexity}`);
                console.log(`   ⚡ Features: ${example.features.join(', ')}`);
                console.log('');
            });

            console.log('🚀 To build any of these MCPs:');
            console.log('   1. Visit http://localhost:4000');
            console.log('   2. Describe your requirements');
            console.log('   3. Select a template or let AI recommend one');
            console.log('   4. Get production-ready code instantly!');
            
        } catch (error) {
            console.log('⚠️  MCP Builder not ready yet. Please wait a moment and try again.');
        }
    }

    setupGracefulShutdown() {
        const shutdown = async () => {
            if (!this.isRunning) return;
            
            console.log('');
            console.log('🛑 Shutting down OriMind Ecosystem...');
            this.isRunning = false;

            for (const [serviceName, processInfo] of this.processes) {
                console.log(`🛑 Stopping ${serviceName}...`);
                try {
                    process.kill(processInfo.pid, 'SIGTERM');
                } catch (error) {
                    console.log(`⚠️  Error stopping ${serviceName}: ${error.message}`);
                }
            }

            console.log('✅ OriMind Ecosystem shutdown complete');
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        process.on('SIGQUIT', shutdown);
    }

    async stopEcosystem() {
        console.log('🛑 Stopping OriMind Ecosystem...');
        
        for (const [serviceName, processInfo] of this.processes) {
            console.log(`🛑 Stopping ${serviceName}...`);
            try {
                process.kill(processInfo.pid, 'SIGTERM');
                this.services[serviceName].status = 'stopped';
            } catch (error) {
                console.log(`⚠️  Error stopping ${serviceName}: ${error.message}`);
            }
        }
        
        this.processes.clear();
        this.isRunning = false;
        console.log('✅ All services stopped');
    }

    async getEcosystemStatus() {
        const status = {
            ecosystem: 'OriMind Universal',
            version: '1.0.0',
            status: this.isRunning ? 'running' : 'stopped',
            services: {},
            total_services: Object.keys(this.services).length,
            running_services: 0,
            timestamp: new Date().toISOString()
        };

        for (const [serviceName, serviceConfig] of Object.entries(this.services)) {
            const processInfo = this.processes.get(serviceName);
            
            status.services[serviceName] = {
                status: serviceConfig.status,
                port: serviceConfig.port,
                description: serviceConfig.description,
                pid: processInfo?.pid,
                uptime: processInfo ? Math.round((Date.now() - processInfo.startTime) / 1000) : 0
            };

            if (serviceConfig.status === 'running') {
                status.running_services++;
            }
        }

        return status;
    }
}

// CLI interface
if (require.main === module) {
    const hub = new OriMindEcosystemHub();
    const command = process.argv[2] || 'start';

    switch (command) {
        case 'start':
            hub.startEcosystem()
                .then(() => hub.integrateMCPBuilder())
                .then(() => hub.demonstrateMCPBuilder())
                .catch(console.error);
            break;

        case 'stop':
            hub.stopEcosystem();
            break;

        case 'status':
            hub.getEcosystemStatus()
                .then(status => console.log(JSON.stringify(status, null, 2)));
            break;

        case 'demo':
            hub.demonstrateMCPBuilder();
            break;

        default:
            console.log('Usage: node ecosystem-hub.js [start|stop|status|demo]');
            console.log('');
            console.log('Commands:');
            console.log('  start  - Start the complete OriMind ecosystem');
            console.log('  stop   - Stop all services');
            console.log('  status - Show ecosystem status');
            console.log('  demo   - Show MCP Builder demonstration');
    }
}

module.exports = OriMindEcosystemHub;