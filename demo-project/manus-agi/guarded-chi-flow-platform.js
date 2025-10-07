const ChiFlowMainApp = require('./chi-flow-main-app');
const ContinuousFlowGuardian = require('./continuous-flow-guardian');

/**
 * OriMind Chi Flow Platform with Integrated Guardian
 * 
 * This unified launcher starts the main application with the Continuous Flow Guardian
 * providing eternal vigilance and automatic healing capabilities.
 * 
 * Combined Chi Flow Principles:
 * - Main app flows like pure energy
 * - Guardian watches invisibly in background
 * - RAG system learns from every resistance
 * - Smart resolver automatically fixes issues
 * - Wisdom accumulates and guides decisions
 * - Energy flows continuously without human intervention
 */

class GuardedChiFlowPlatform {
    constructor(options = {}) {
        this.options = {
            port: options.port || 3002,
            autoResolve: options.autoResolve !== false,
            guardianEnabled: options.guardianEnabled !== false,
            knowledgeBasePath: options.knowledgeBasePath || './chi-flow-knowledge',
            monitoringInterval: options.monitoringInterval || 15000, // 15 seconds
            confidenceThreshold: options.confidenceThreshold || 0.75,
            ...options
        };
        
        this.mainApp = null;
        this.guardian = null;
        this.isRunning = false;
        this.startTime = null;
    }
    
    async startPlatform() {
        console.log('🌊 OriMind Chi Flow Platform: Initializing pure energy architecture...');
        this.startTime = Date.now();
        
        try {
            // Start main application
            await this.startMainApplication();
            
            // Start guardian (if enabled)
            if (this.options.guardianEnabled) {
                await this.startGuardian();
            }
            
            // Setup graceful shutdown
            this.setupGracefulShutdown();
            
            this.isRunning = true;
            
            console.log('');
            console.log('✨ OriMind Chi Flow Platform: PURE ENERGY ACTIVE!');
            console.log('   🌊 Main application flowing on port', this.options.port);
            if (this.options.guardianEnabled) {
                console.log('   👁️ Continuous Guardian providing eternal vigilance');
                console.log('   🧠 RAG system accumulating wisdom from every interaction');
                console.log('   🤖 Smart resolver ready for automatic healing');
            }
            console.log('   ⚡ All operations non-blocking, streaming naturally');
            console.log('   💫 Background processes invisible like wind energy');
            console.log('   🔄 Self-healing through continuous flow monitoring');
            console.log('');
            console.log('🎯 Chi Flow Endpoints:');
            console.log(`   💚 Health: http://localhost:${this.options.port}/api/health`);
            console.log(`   📂 Projects: http://localhost:${this.options.port}/api/projects`);
            console.log(`   ⚡ Execute: POST http://localhost:${this.options.port}/api/execute`);
            console.log(`   📡 Communication: POST http://localhost:${this.options.port}/api/communicate`);
            console.log(`   🌊 WebSocket: ws://localhost:${this.options.port}`);
            if (this.options.guardianEnabled) {
                console.log(`   👁️ Guardian Status: GET http://localhost:${this.options.port}/api/guardian/status`);
                console.log(`   🧠 Guardian Wisdom: GET http://localhost:${this.options.port}/api/guardian/wisdom`);
            }
            console.log('');
            console.log('🌟 Energy flowing continuously - press Ctrl+C for graceful transition');
            
            return true;
            
        } catch (error) {
            console.log('🌊 Platform initialization encountered resistance:', error.message);
            await this.gracefulShutdown();
            throw error;
        }
    }
    
    async startMainApplication() {
        console.log('⚡ Starting main chi flow application...');
        
        this.mainApp = new ChiFlowMainApp();
        
        // Add guardian integration endpoints if guardian is enabled
        if (this.options.guardianEnabled) {
            this.addGuardianEndpoints();
        }
        
        // Start the main app in background
        return new Promise((resolve, reject) => {
            const server = this.mainApp.server;
            
            server.listen(this.options.port, () => {
                console.log(`🌊 Main application energy flowing on port ${this.options.port}`);
                resolve();
            });
            
            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.log(`⚠️ Port ${this.options.port} already in use - energy will find alternative path`);
                    // Try next port
                    this.options.port += 1;
                    setTimeout(() => {
                        server.listen(this.options.port, () => {
                            console.log(`🌊 Main application energy redirected to port ${this.options.port}`);
                            resolve();
                        });
                    }, 1000);
                } else {
                    reject(error);
                }
            });
        });
    }
    
    async startGuardian() {
        console.log('👁️ Activating Continuous Flow Guardian...');
        
        // Configure guardian for this platform
        const guardianConfig = {
            services: [
                { 
                    name: 'main-app', 
                    port: this.options.port, 
                    path: '/api/health', 
                    type: 'node' 
                },
                // Add other services if they're supposed to be running
                { 
                    name: 'mcp-server', 
                    port: 8000, 
                    path: '/health', 
                    type: 'node' 
                },
                { 
                    name: 'sherlock-ide', 
                    port: 3000, 
                    path: '/api/health', 
                    type: 'node' 
                },
                { 
                    name: 'reliakit-dashboard', 
                    port: 5000, 
                    path: '/health', 
                    type: 'python' 
                }
            ],
            autoResolve: this.options.autoResolve,
            confidenceThreshold: this.options.confidenceThreshold,
            knowledgeBasePath: this.options.knowledgeBasePath,
            monitoringInterval: this.options.monitoringInterval
        };
        
        this.guardian = new ContinuousFlowGuardian(guardianConfig);
        
        // Setup guardian event listeners
        this.setupGuardianListeners();
        
        // Start guardian monitoring
        await this.guardian.startGuarding();
        
        console.log('👁️ Guardian vigilance activated - eternal energy protection engaged');
    }
    
    addGuardianEndpoints() {
        // Guardian status endpoint
        this.mainApp.app.get('/api/guardian/status', async (req, res) => {
            try {
                if (!this.guardian) {
                    return res.json({
                        guardian_enabled: false,
                        message: 'Guardian not active on this instance'
                    });
                }
                
                const status = await this.guardian.getGuardianStatus();
                res.json({
                    guardian_enabled: true,
                    platform_uptime: Date.now() - this.startTime,
                    ...status
                });
            } catch (error) {
                this.mainApp.redirectEnergyFlow(res, error, 'guardian_status');
            }
        });
        
        // Guardian wisdom export
        this.mainApp.app.get('/api/guardian/wisdom', async (req, res) => {
            try {
                if (!this.guardian) {
                    return res.json({
                        guardian_enabled: false,
                        wisdom: 'Guardian wisdom requires active guardian'
                    });
                }
                
                const wisdom = await this.guardian.exportGuardianWisdom();
                res.json({
                    exported_at: new Date().toISOString(),
                    platform_uptime: Date.now() - this.startTime,
                    ...wisdom
                });
            } catch (error) {
                this.mainApp.redirectEnergyFlow(res, error, 'guardian_wisdom');
            }
        });
        
        // Force healing endpoint (for manual intervention)
        this.mainApp.app.post('/api/guardian/heal', async (req, res) => {
            try {
                if (!this.guardian) {
                    return res.json({
                        guardian_enabled: false,
                        message: 'Manual healing requires active guardian'
                    });
                }
                
                const { service, force = false } = req.body;
                
                // Immediate response
                res.json({
                    status: 'healing_initiated',
                    service: service || 'all_services',
                    force_mode: force,
                    message: 'Guardian healing energy directed to specified target'
                });
                
                // Background healing process
                setImmediate(async () => {
                    if (service) {
                        // Heal specific service
                        const targetService = this.guardian.services.find(s => s.name === service);
                        if (targetService) {
                            this.guardian.queueForHealing(targetService, { status: 'manual_healing_requested' });
                        }
                    } else {
                        // Heal all services
                        for (const svc of this.guardian.services) {
                            this.guardian.queueForHealing(svc, { status: 'manual_healing_requested' });
                        }
                    }
                });
                
            } catch (error) {
                this.mainApp.redirectEnergyFlow(res, error, 'guardian_healing');
            }
        });
        
        // Deep scan endpoint
        this.mainApp.app.post('/api/guardian/scan', async (req, res) => {
            try {
                if (!this.guardian) {
                    return res.json({
                        guardian_enabled: false,
                        message: 'Deep scanning requires active guardian'
                    });
                }
                
                // Immediate response
                res.json({
                    status: 'deep_scan_initiated',
                    message: 'Guardian performing comprehensive energy flow analysis'
                });
                
                // Background deep scan
                setImmediate(async () => {
                    await this.guardian.performDeepScan();
                });
                
            } catch (error) {
                this.mainApp.redirectEnergyFlow(res, error, 'guardian_scan');
            }
        });
    }
    
    setupGuardianListeners() {
        this.guardian.on('guardian_activated', () => {
            console.log('✨ Guardian has achieved full consciousness');
        });
        
        this.guardian.on('flow_state_updated', (state) => {
            // Broadcast flow state to WebSocket clients
            this.mainApp.broadcastEnergyUpdate('guardian_flow_state', state);
        });
        
        this.guardian.on('deep_scan_complete', (analysis) => {
            console.log(`🔍 Guardian deep scan: ${analysis.potentialIssues?.length || 0} potential issues identified`);
            this.mainApp.broadcastEnergyUpdate('deep_scan_results', {
                potentialIssues: analysis.potentialIssues?.length || 0,
                preventedIssues: analysis.potentialIssues?.filter(i => i.preventable).length || 0
            });
        });
        
        this.guardian.on('wisdom_synchronized', (wisdom) => {
            console.log('🧠 Guardian wisdom synchronized - institutional knowledge updated');
            this.mainApp.broadcastEnergyUpdate('wisdom_update', {
                knowledge_growth: wisdom.resolver?.ragKnowledge?.totalKnowledge || 0,
                healing_mastery: wisdom.guardian?.healingMastery || 0,
                prevention_effectiveness: wisdom.guardian?.preventionEffectiveness || 0
            });
        });
        
        this.guardian.on('flow_event', (event) => {
            // Forward significant flow events to main app
            if (event.type === 'healing_complete' || event.type === 'preventive_action_taken') {
                this.mainApp.broadcastEnergyUpdate('guardian_action', {
                    type: event.type,
                    timestamp: event.timestamp,
                    data: event.data
                });
            }
        });
    }
    
    setupGracefulShutdown() {
        const gracefulShutdown = async (signal) => {
            console.log(`\n🌊 Received ${signal} - Chi energy transitioning gracefully...`);
            await this.gracefulShutdown();
            process.exit(0);
        };
        
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('uncaughtException', async (error) => {
            console.log('🌊 Uncaught exception - Guardian attempting recovery:', error.message);
            
            if (this.guardian && this.guardian.resolver) {
                try {
                    await this.guardian.resolver.analyzeAndResolve(error, {
                        component: 'platform',
                        operation: 'uncaught_exception'
                    });
                } catch (resolverError) {
                    console.log('❌ Guardian could not resolve exception:', resolverError.message);
                    await this.gracefulShutdown();
                    process.exit(1);
                }
            } else {
                await this.gracefulShutdown();
                process.exit(1);
            }
        });
    }
    
    async gracefulShutdown() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        const shutdownStart = Date.now();
        
        console.log('🌊 Initiating graceful energy transition...');
        
        try {
            // Stop guardian first
            if (this.guardian) {
                console.log('👁️ Guardian returning to dormant state...');
                await this.guardian.stopGuarding();
            }
            
            // Stop main application
            if (this.mainApp && this.mainApp.server) {
                console.log('⚡ Main application energy gracefully closing...');
                
                // Close WebSocket connections gracefully
                this.mainApp.energyChannels.forEach((ws) => {
                    ws.close(1000, 'Platform graceful shutdown');
                });
                
                // Close HTTP server
                await new Promise((resolve) => {
                    this.mainApp.server.close(() => {
                        console.log('✨ Main application energy channels gracefully closed');
                        resolve();
                    });
                });
            }
            
            const shutdownDuration = Date.now() - shutdownStart;
            console.log(`🙏 Chi flow platform gracefully transitioned (${shutdownDuration}ms)`);
            console.log('💫 All energy returns to source - platform consciousness complete');
            
        } catch (error) {
            console.log('⚠️ Graceful shutdown encountered resistance:', error.message);
            console.log('🌊 Forcing energy transition...');
        }
    }
    
    async waitForShutdown() {
        // Keep the platform running until shutdown signal
        return new Promise((resolve) => {
            const checkShutdown = () => {
                if (!this.isRunning) {
                    resolve();
                } else {
                    setTimeout(checkShutdown, 1000);
                }
            };
            checkShutdown();
        });
    }
    
    async getPlatformStatus() {
        const status = {
            platform: {
                running: this.isRunning,
                uptime: this.startTime ? Date.now() - this.startTime : 0,
                port: this.options.port,
                guardian_enabled: this.options.guardianEnabled
            },
            main_app: null,
            guardian: null
        };
        
        if (this.mainApp) {
            status.main_app = {
                energy_channels: this.mainApp.energyChannels.size,
                energy_level: this.mainApp.flowMetrics.energyLevel,
                blocked_operations: this.mainApp.flowMetrics.blockedOperations,
                flow_quality: this.mainApp.flowMetrics.flowQuality
            };
        }
        
        if (this.guardian) {
            status.guardian = await this.guardian.getGuardianStatus();
        }
        
        return status;
    }
}

// Direct execution
if (require.main === module) {
    const platform = new GuardedChiFlowPlatform({
        port: process.env.PORT || 3002,
        autoResolve: process.env.AUTO_RESOLVE !== 'false',
        guardianEnabled: process.env.GUARDIAN_ENABLED !== 'false',
        confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.75,
        monitoringInterval: parseInt(process.env.MONITORING_INTERVAL) || 15000
    });
    
    platform.startPlatform()
        .then(() => platform.waitForShutdown())
        .catch((error) => {
            console.log('💥 Platform failed to achieve energy flow:', error.message);
            process.exit(1);
        });
}

module.exports = GuardedChiFlowPlatform;