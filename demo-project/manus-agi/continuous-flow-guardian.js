const SmartChiFlowResolver = require('./smart-chi-flow-resolver');
const ChiFlowRAGSystem = require('./chi-flow-rag-system');
const { EventEmitter } = require('events');
const { exec } = require('child_process');
const fs = require('fs').promises;

/**
 * OriMind Continuous Flow Guardian
 * 
 * The ultimate background guardian that ensures pure chi energy flows 
 * continuously through the entire OriMind ecosystem without interruption.
 * 
 * Guardian Principles:
 * - Energy never stops flowing, only redirects
 * - Prevention is superior to healing  
 * - Continuous learning prevents recurring resistance
 * - Guardian operates invisibly like natural forces
 * - Every intervention strengthens the overall flow
 * - Wisdom accumulates and guides future decisions
 */

class ContinuousFlowGuardian extends EventEmitter {
    constructor(options = {}) {
        super();
        
        // Core components
        this.resolver = new SmartChiFlowResolver({
            autoResolve: options.autoResolve !== false,
            confidenceThreshold: options.confidenceThreshold || 0.75,
            knowledgeBasePath: options.knowledgeBasePath || './chi-flow-knowledge'
        });
        
        // Guardian configuration  
        this.services = options.services || [
            { name: 'mcp-server', port: 8000, path: '/health', type: 'node' },
            { name: 'sherlock-ide', port: 3000, path: '/api/health', type: 'node' },
            { name: 'reliakit-dashboard', port: 5000, path: '/health', type: 'python' },
            { name: 'main-app', port: 3002, path: '/api/health', type: 'node' }
        ];
        
        this.monitoringInterval = options.monitoringInterval || 10000; // 10 seconds
        this.deepScanInterval = options.deepScanInterval || 300000; // 5 minutes
        this.healingInterval = options.healingInterval || 60000; // 1 minute
        this.wisdomSyncInterval = options.wisdomSyncInterval || 3600000; // 1 hour
        
        // Guardian state
        this.flowState = {
            overall: 'initializing',
            services: new Map(),
            energyLevel: 1.0,
            blockageCount: 0,
            healingActive: false,
            lastDeepScan: null,
            lastWisdomSync: null
        };
        
        this.monitoringActive = false;
        this.healingQueue = [];
        this.flowHistory = [];
        this.performanceMetrics = {
            uptimePercentage: 100,
            averageResponseTime: 0,
            healingSuccessRate: 0,
            preventedIssues: 0
        };
        
        // Setup event listeners
        this.setupResolverListeners();
        
        console.log('👁️ Continuous Flow Guardian: Eternal vigilance over chi energy initiated');
    }
    
    setupResolverListeners() {
        this.resolver.on('issue_documented', (issue) => {
            this.logFlowEvent('resistance_detected', {
                issue: issue.fingerprint,
                severity: issue.severity,
                category: issue.category
            });
        });
        
        this.resolver.on('resolution_complete', (resolution) => {
            this.logFlowEvent('healing_complete', {
                resolution: resolution.id,
                success: resolution.wasSuccessful,
                duration: resolution.duration
            });
            
            this.updatePerformanceMetrics(resolution);
        });
    }
    
    async startGuarding() {
        if (this.monitoringActive) {
            console.log('👁️ Guardian already active - maintaining eternal vigilance');
            return;
        }
        
        console.log('🌊 Starting Continuous Flow Guardian...');
        this.monitoringActive = true;
        this.flowState.overall = 'active';
        
        // Initialize service states
        await this.initializeServiceStates();
        
        // Start all monitoring cycles
        this.startContinuousMonitoring();
        this.startDeepScanning();
        this.startPreventiveHealing();
        this.startWisdomSynchronization();
        this.startFlowOptimization();
        
        console.log('✨ Continuous Flow Guardian: Pure energy protection active');
        this.emit('guardian_activated');
    }
    
    async stopGuarding() {
        console.log('🌊 Gracefully transitioning Guardian to dormant state...');
        
        this.monitoringActive = false;
        this.flowState.overall = 'dormant';
        
        // Clear all intervals
        if (this.monitoringTimer) clearInterval(this.monitoringTimer);
        if (this.deepScanTimer) clearInterval(this.deepScanTimer);
        if (this.healingTimer) clearInterval(this.healingTimer);
        if (this.wisdomTimer) clearInterval(this.wisdomTimer);
        if (this.optimizationTimer) clearInterval(this.optimizationTimer);
        
        console.log('🙏 Guardian energy returns to source - vigilance complete');
        this.emit('guardian_deactivated');
    }
    
    async initializeServiceStates() {
        console.log('🔍 Initializing service energy states...');
        
        for (const service of this.services) {
            const state = await this.checkServiceHealth(service);
            this.flowState.services.set(service.name, {
                ...service,
                ...state,
                lastCheck: new Date().toISOString(),
                consecutiveFailures: 0,
                totalChecks: 1,
                uptimePercentage: state.healthy ? 100 : 0
            });
            
            console.log(`   ${state.healthy ? '✅' : '❌'} ${service.name}: ${state.status}`);
        }
    }
    
    startContinuousMonitoring() {
        this.monitoringTimer = setInterval(async () => {
            if (!this.monitoringActive) return;
            
            try {
                await this.performFlowMonitoring();
            } catch (error) {
                console.log(`🌊 Flow monitoring encountered resistance: ${error.message}`);
                await this.resolver.analyzeAndResolve(error, { 
                    component: 'flow_guardian',
                    operation: 'continuous_monitoring'
                });
            }
        }, this.monitoringInterval);
    }
    
    startDeepScanning() {
        this.deepScanTimer = setInterval(async () => {
            if (!this.monitoringActive) return;
            
            try {
                await this.performDeepScan();
            } catch (error) {
                console.log(`🔍 Deep scan encountered resistance: ${error.message}`);
            }
        }, this.deepScanInterval);
    }
    
    startPreventiveHealing() {
        this.healingTimer = setInterval(async () => {
            if (!this.monitoringActive || this.healingQueue.length === 0) return;
            
            try {
                await this.processHealingQueue();
            } catch (error) {
                console.log(`💚 Healing process encountered resistance: ${error.message}`);
            }
        }, this.healingInterval);
    }
    
    startWisdomSynchronization() {
        this.wisdomTimer = setInterval(async () => {
            if (!this.monitoringActive) return;
            
            try {
                await this.synchronizeWisdom();
            } catch (error) {
                console.log(`🧠 Wisdom sync encountered resistance: ${error.message}`);
            }
        }, this.wisdomSyncInterval);
    }
    
    startFlowOptimization() {
        this.optimizationTimer = setInterval(async () => {
            if (!this.monitoringActive) return;
            
            try {
                await this.optimizeEnergyFlow();
            } catch (error) {
                console.log(`⚡ Flow optimization encountered resistance: ${error.message}`);
            }
        }, this.healingInterval * 5); // Every 5 minutes
    }
    
    async performFlowMonitoring() {
        const monitoringStart = Date.now();
        let healthyServices = 0;
        let totalResponseTime = 0;
        
        // Check each service concurrently
        const healthChecks = this.services.map(async (service) => {
            const serviceState = this.flowState.services.get(service.name);
            const health = await this.checkServiceHealth(service);
            
            // Update service state
            serviceState.lastCheck = new Date().toISOString();
            serviceState.totalChecks += 1;
            serviceState.responseTime = health.responseTime;
            totalResponseTime += health.responseTime;
            
            if (health.healthy) {
                serviceState.consecutiveFailures = 0;
                serviceState.status = health.status;
                healthyServices += 1;
            } else {
                serviceState.consecutiveFailures += 1;
                serviceState.status = health.status;
                
                // Queue for healing if consecutive failures
                if (serviceState.consecutiveFailures >= 2) {
                    this.queueForHealing(service, health);
                }
            }
            
            // Update service uptime percentage
            const healthyChecks = serviceState.totalChecks - serviceState.consecutiveFailures;
            serviceState.uptimePercentage = (healthyChecks / serviceState.totalChecks) * 100;
            
            return { service: service.name, health };
        });
        
        await Promise.all(healthChecks);
        
        // Update overall flow state
        this.flowState.energyLevel = healthyServices / this.services.length;
        this.flowState.overall = this.calculateOverallFlowState(healthyServices);
        
        // Update performance metrics
        this.performanceMetrics.averageResponseTime = totalResponseTime / this.services.length;
        this.performanceMetrics.uptimePercentage = 
            Array.from(this.flowState.services.values())
                .reduce((sum, s) => sum + s.uptimePercentage, 0) / this.services.length;
        
        // Log flow event for pattern recognition
        this.logFlowEvent('monitoring_cycle', {
            healthyServices,
            totalServices: this.services.length,
            energyLevel: this.flowState.energyLevel,
            averageResponseTime: this.performanceMetrics.averageResponseTime,
            duration: Date.now() - monitoringStart
        });
        
        // Emit flow state for external monitoring
        this.emit('flow_state_updated', {
            overall: this.flowState.overall,
            energyLevel: this.flowState.energyLevel,
            services: Object.fromEntries(this.flowState.services)
        });
    }
    
    async checkServiceHealth(service) {
        const startTime = Date.now();
        
        try {
            // Primary health check via HTTP
            const healthResult = await this.httpHealthCheck(service);
            if (healthResult.healthy) {
                return {
                    healthy: true,
                    status: 'flowing',
                    responseTime: Date.now() - startTime,
                    method: 'http',
                    details: healthResult.details
                };
            }
        } catch (error) {
            // HTTP failed, try port check
        }
        
        try {
            // Secondary check via port connectivity
            const portResult = await this.portHealthCheck(service);
            return {
                healthy: portResult.open,
                status: portResult.open ? 'port_responsive' : 'port_closed',
                responseTime: Date.now() - startTime,
                method: 'port',
                details: portResult.details
            };
        } catch (error) {
            return {
                healthy: false,
                status: 'unreachable',
                responseTime: Date.now() - startTime,
                method: 'none',
                error: error.message
            };
        }
    }
    
    async httpHealthCheck(service) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Health check timeout'));
            }, 5000);
            
            exec(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${service.port}${service.path} -m 3`, 
                (error, stdout, stderr) => {
                    clearTimeout(timeout);
                    
                    if (error) {
                        reject(error);
                        return;
                    }
                    
                    const statusCode = parseInt(stdout.trim());
                    resolve({
                        healthy: statusCode >= 200 && statusCode < 400,
                        details: { statusCode, response: stdout }
                    });
                }
            );
        });
    }
    
    async portHealthCheck(service) {
        return new Promise((resolve, reject) => {
            exec(`Test-NetConnection -ComputerName localhost -Port ${service.port} -WarningAction SilentlyContinue | Select-Object TcpTestSucceeded`,
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    
                    const isOpen = stdout.includes('True');
                    resolve({
                        open: isOpen,
                        details: { portTest: stdout.trim() }
                    });
                }
            );
        });
    }
    
    calculateOverallFlowState(healthyServices) {
        const healthRatio = healthyServices / this.services.length;
        
        if (healthRatio === 1.0) return 'pure_flow';
        if (healthRatio >= 0.75) return 'flowing';
        if (healthRatio >= 0.5) return 'disrupted';
        if (healthRatio >= 0.25) return 'blocked';
        return 'critical';
    }
    
    queueForHealing(service, health) {
        const healingItem = {
            service,
            health,
            queuedAt: new Date().toISOString(),
            priority: this.calculateHealingPriority(service, health),
            attempts: 0
        };
        
        // Avoid duplicate healing
        const existingIndex = this.healingQueue.findIndex(item => item.service.name === service.name);
        if (existingIndex >= 0) {
            this.healingQueue[existingIndex] = healingItem; // Update existing
        } else {
            this.healingQueue.push(healingItem);
        }
        
        // Sort by priority
        this.healingQueue.sort((a, b) => b.priority - a.priority);
        
        console.log(`💊 Queued ${service.name} for healing (priority: ${healingItem.priority})`);
    }
    
    calculateHealingPriority(service, health) {
        let priority = 50; // Base priority
        
        // Service importance
        if (service.name.includes('main')) priority += 30;
        if (service.name.includes('mcp')) priority += 25;
        if (service.name.includes('dashboard')) priority += 20;
        if (service.name.includes('ide')) priority += 15;
        
        // Health severity
        const serviceState = this.flowState.services.get(service.name);
        if (serviceState.consecutiveFailures > 3) priority += 20;
        if (serviceState.uptimePercentage < 50) priority += 15;
        
        // System impact
        if (this.flowState.energyLevel < 0.5) priority += 25;
        
        return Math.min(100, priority);
    }
    
    async processHealingQueue() {
        if (this.flowState.healingActive || this.healingQueue.length === 0) return;
        
        this.flowState.healingActive = true;
        const healingItem = this.healingQueue.shift();
        
        console.log(`💚 Beginning healing process for ${healingItem.service.name}...`);
        
        try {
            const healing = await this.performHealing(healingItem);
            
            if (healing.wasSuccessful) {
                console.log(`✨ Healing successful for ${healingItem.service.name}`);
                this.performanceMetrics.healingSuccessRate = 
                    (this.performanceMetrics.healingSuccessRate * 0.9) + (1.0 * 0.1);
            } else {
                console.log(`⚠️ Healing incomplete for ${healingItem.service.name}, re-queuing`);
                healingItem.attempts += 1;
                if (healingItem.attempts < 3) {
                    healingItem.priority = Math.max(10, healingItem.priority - 10);
                    this.healingQueue.push(healingItem);
                }
                
                this.performanceMetrics.healingSuccessRate = 
                    (this.performanceMetrics.healingSuccessRate * 0.9) + (0.0 * 0.1);
            }
            
        } catch (error) {
            console.log(`🌊 Healing process encountered resistance: ${error.message}`);
        } finally {
            this.flowState.healingActive = false;
        }
    }
    
    async performHealing(healingItem) {
        const { service, health } = healingItem;
        
        // Create healing context
        const context = {
            service: service.name,
            port: service.port,
            type: service.type,
            health: health.status,
            consecutiveFailures: this.flowState.services.get(service.name).consecutiveFailures,
            operation: 'service_healing'
        };
        
        // Use smart resolver for healing
        const error = new Error(`Service ${service.name} not responding: ${health.status}`);
        const resolution = await this.resolver.analyzeAndResolve(error, context);
        
        // Verify healing effectiveness
        if (resolution.wasSuccessful) {
            // Wait a moment for service to stabilize
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Re-check service health
            const newHealth = await this.checkServiceHealth(service);
            if (newHealth.healthy) {
                this.logFlowEvent('healing_verified', {
                    service: service.name,
                    resolution: resolution.id,
                    newStatus: newHealth.status
                });
                
                return { wasSuccessful: true, verification: newHealth };
            }
        }
        
        return { wasSuccessful: false, resolution };
    }
    
    async performDeepScan() {
        console.log('🔍 Performing deep energy flow scan...');
        const scanStart = Date.now();
        
        this.flowState.lastDeepScan = new Date().toISOString();
        
        // Deep analysis of system state
        const deepAnalysis = {
            systemResources: await this.scanSystemResources(),
            networkConnectivity: await this.scanNetworkConnectivity(),
            processHealth: await this.scanProcessHealth(),
            energyPatterns: await this.analyzeEnergyPatterns(),
            potentialIssues: []
        };
        
        // Identify potential issues before they become problems
        deepAnalysis.potentialIssues = await this.identifyPotentialIssues(deepAnalysis);
        
        // Preemptive healing for potential issues
        for (const issue of deepAnalysis.potentialIssues) {
            if (issue.preventable && issue.confidence > 0.8) {
                await this.performPreventiveAction(issue);
                this.performanceMetrics.preventedIssues += 1;
            }
        }
        
        const scanDuration = Date.now() - scanStart;
        console.log(`🔍 Deep scan complete: ${deepAnalysis.potentialIssues.length} potential issues identified (${scanDuration}ms)`);
        
        this.logFlowEvent('deep_scan_complete', {
            duration: scanDuration,
            potentialIssues: deepAnalysis.potentialIssues.length,
            preventedIssues: deepAnalysis.potentialIssues.filter(i => i.preventable).length
        });
        
        this.emit('deep_scan_complete', deepAnalysis);
        return deepAnalysis;
    }
    
    async scanSystemResources() {
        try {
            const memoryInfo = await this.executeCommand('Get-Process | Measure-Object WorkingSet -Sum | Select-Object Sum');
            const cpuInfo = await this.executeCommand('Get-Counter "\\Processor(_Total)\\% Processor Time" -SampleInterval 1 -MaxSamples 1');
            
            return {
                memory: this.parseMemoryInfo(memoryInfo),
                cpu: this.parseCpuInfo(cpuInfo),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { error: error.message };
        }
    }
    
    async scanNetworkConnectivity() {
        const networkTests = this.services.map(async (service) => {
            try {
                const result = await this.executeCommand(
                    `Test-NetConnection -ComputerName localhost -Port ${service.port} -WarningAction SilentlyContinue`
                );
                return {
                    service: service.name,
                    port: service.port,
                    reachable: result.includes('True'),
                    details: result
                };
            } catch (error) {
                return {
                    service: service.name,
                    port: service.port,
                    reachable: false,
                    error: error.message
                };
            }
        });
        
        return Promise.all(networkTests);
    }
    
    async scanProcessHealth() {
        try {
            const nodeProcesses = await this.executeCommand('Get-Process node -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,WorkingSet,CPU');
            const pythonProcesses = await this.executeCommand('Get-Process python -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,WorkingSet,CPU');
            
            return {
                node: this.parseProcessInfo(nodeProcesses),
                python: this.parseProcessInfo(pythonProcesses),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { error: error.message };
        }
    }
    
    async analyzeEnergyPatterns() {
        const recentFlow = this.flowHistory.slice(-20); // Last 20 events
        
        const patterns = {
            failureFrequency: {},
            healingEffectiveness: {},
            energyTrends: [],
            cyclicalPatterns: []
        };
        
        // Analyze failure patterns
        recentFlow.forEach(event => {
            if (event.type === 'resistance_detected') {
                const service = event.data.service || 'unknown';
                patterns.failureFrequency[service] = (patterns.failureFrequency[service] || 0) + 1;
            }
        });
        
        // Analyze energy level trends
        const energyLevels = recentFlow
            .filter(event => event.type === 'monitoring_cycle')
            .map(event => event.data.energyLevel);
        
        if (energyLevels.length > 1) {
            const trend = energyLevels[energyLevels.length - 1] - energyLevels[0];
            patterns.energyTrends.push({
                direction: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
                magnitude: Math.abs(trend),
                confidence: energyLevels.length / 20
            });
        }
        
        return patterns;
    }
    
    async identifyPotentialIssues(analysis) {
        const issues = [];
        
        // Memory pressure detection
        if (analysis.systemResources?.memory?.percentUsed > 80) {
            issues.push({
                type: 'memory_pressure',
                severity: 'medium',
                confidence: 0.9,
                preventable: true,
                description: 'System memory usage approaching critical levels',
                action: 'garbage_collection_optimization'
            });
        }
        
        // Service isolation issues
        const unreachableServices = analysis.networkConnectivity?.filter(test => !test.reachable) || [];
        if (unreachableServices.length > 0) {
            issues.push({
                type: 'service_isolation',
                severity: 'high',
                confidence: 0.95,
                preventable: true,
                description: `${unreachableServices.length} services not reachable`,
                action: 'service_restart_sequence',
                affectedServices: unreachableServices.map(s => s.service)
            });
        }
        
        // Energy decline pattern
        const energyTrend = analysis.energyPatterns?.energyTrends?.[0];
        if (energyTrend?.direction === 'declining' && energyTrend.magnitude > 0.2) {
            issues.push({
                type: 'energy_decline',
                severity: 'medium',
                confidence: energyTrend.confidence,
                preventable: true,
                description: 'Sustained energy level decline detected',
                action: 'flow_optimization'
            });
        }
        
        return issues;
    }
    
    async performPreventiveAction(issue) {
        console.log(`🛡️ Performing preventive action for: ${issue.type}`);
        
        const context = {
            issue: issue.type,
            operation: 'preventive_action',
            confidence: issue.confidence
        };
        
        switch (issue.action) {
            case 'garbage_collection_optimization':
                await this.executeCommand('node -e "if (global.gc) global.gc(); console.log(\'GC triggered\')"');
                break;
                
            case 'service_restart_sequence':
                for (const serviceName of issue.affectedServices || []) {
                    await this.performServiceRestart(serviceName);
                }
                break;
                
            case 'flow_optimization':
                await this.optimizeEnergyFlow();
                break;
        }
        
        this.logFlowEvent('preventive_action_taken', {
            issue: issue.type,
            action: issue.action,
            confidence: issue.confidence
        });
    }
    
    async performServiceRestart(serviceName) {
        const service = this.services.find(s => s.name === serviceName);
        if (!service) return;
        
        console.log(`🔄 Preventively restarting ${serviceName}...`);
        
        try {
            // Graceful restart attempt
            await this.executeCommand(`taskkill /F /IM ${service.type}.exe /FI "WINDOWTITLE eq *${serviceName}*"`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Service-specific restart logic would go here
            // For now, we log the action
            this.logFlowEvent('preventive_restart', {
                service: serviceName,
                reason: 'isolation_detected'
            });
            
        } catch (error) {
            console.log(`🌊 Preventive restart encountered resistance: ${error.message}`);
        }
    }
    
    async synchronizeWisdom() {
        console.log('🧠 Synchronizing accumulated wisdom...');
        
        this.flowState.lastWisdomSync = new Date().toISOString();
        
        // Get knowledge statistics
        const resolverStats = await this.resolver.getResolverStats();
        
        // Analyze guardian performance
        const guardianWisdom = {
            uptimeAchievement: this.performanceMetrics.uptimePercentage,
            healingMastery: this.performanceMetrics.healingSuccessRate,
            preventionEffectiveness: this.performanceMetrics.preventedIssues,
            responseSpeed: this.performanceMetrics.averageResponseTime,
            totalFlowEvents: this.flowHistory.length,
            knowledgeGrowth: resolverStats.ragKnowledge.totalKnowledge
        };
        
        // Share wisdom with external systems
        this.emit('wisdom_synchronized', {
            resolver: resolverStats,
            guardian: guardianWisdom,
            timestamp: new Date().toISOString()
        });
        
        console.log(`🌟 Wisdom sync complete - ${Object.keys(guardianWisdom).length} metrics synchronized`);
    }
    
    async optimizeEnergyFlow() {
        console.log('⚡ Optimizing energy flow patterns...');
        
        // Analyze current flow efficiency
        const currentEfficiency = this.calculateFlowEfficiency();
        
        // Identify optimization opportunities
        const optimizations = await this.identifyOptimizations();
        
        // Apply safe optimizations
        for (const optimization of optimizations) {
            if (optimization.risk === 'low' && optimization.benefit > 0.1) {
                await this.applyOptimization(optimization);
            }
        }
        
        // Measure improvement
        const newEfficiency = this.calculateFlowEfficiency();
        const improvement = newEfficiency - currentEfficiency;
        
        if (improvement > 0) {
            console.log(`📈 Energy flow optimized: ${(improvement * 100).toFixed(1)}% improvement`);
        }
        
        this.logFlowEvent('flow_optimization', {
            originalEfficiency: currentEfficiency,
            newEfficiency: newEfficiency,
            improvement: improvement,
            optimizationsApplied: optimizations.length
        });
    }
    
    calculateFlowEfficiency() {
        const factors = [
            this.performanceMetrics.uptimePercentage / 100,
            Math.max(0, 1 - (this.performanceMetrics.averageResponseTime / 5000)), // 5s baseline
            this.performanceMetrics.healingSuccessRate,
            this.flowState.energyLevel
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }
    
    async identifyOptimizations() {
        const optimizations = [];
        
        // Response time optimization
        if (this.performanceMetrics.averageResponseTime > 1000) {
            optimizations.push({
                type: 'response_time',
                description: 'Reduce service response times',
                benefit: 0.2,
                risk: 'low',
                action: 'cache_optimization'
            });
        }
        
        // Monitoring frequency optimization
        if (this.flowState.energyLevel > 0.9 && this.monitoringInterval < 30000) {
            optimizations.push({
                type: 'monitoring_frequency',
                description: 'Reduce monitoring frequency during stable periods',
                benefit: 0.1,
                risk: 'low',
                action: 'adaptive_monitoring'
            });
        }
        
        return optimizations;
    }
    
    async applyOptimization(optimization) {
        console.log(`🔧 Applying optimization: ${optimization.description}`);
        
        switch (optimization.action) {
            case 'cache_optimization':
                // Implement caching strategies
                break;
                
            case 'adaptive_monitoring':
                // Temporarily increase monitoring interval during stable periods
                if (this.flowState.energyLevel > 0.9) {
                    const originalInterval = this.monitoringInterval;
                    this.monitoringInterval = Math.min(30000, this.monitoringInterval * 1.5);
                    
                    // Revert after some time
                    setTimeout(() => {
                        this.monitoringInterval = originalInterval;
                    }, 300000); // 5 minutes
                }
                break;
        }
    }
    
    logFlowEvent(type, data) {
        const event = {
            type,
            data,
            timestamp: new Date().toISOString(),
            guardian: true
        };
        
        this.flowHistory.push(event);
        
        // Keep history manageable
        if (this.flowHistory.length > 1000) {
            this.flowHistory = this.flowHistory.slice(-500);
        }
        
        this.emit('flow_event', event);
    }
    
    updatePerformanceMetrics(resolution) {
        // Update healing success rate
        const wasSuccessful = resolution.wasSuccessful ? 1 : 0;
        this.performanceMetrics.healingSuccessRate = 
            (this.performanceMetrics.healingSuccessRate * 0.9) + (wasSuccessful * 0.1);
    }
    
    async executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout || stderr);
                }
            });
        });
    }
    
    parseMemoryInfo(memoryOutput) {
        // Parse PowerShell memory output
        try {
            const lines = memoryOutput.split('\n');
            const sumLine = lines.find(line => line.includes('Sum'));
            if (sumLine) {
                const sumMatch = sumLine.match(/(\d+)/);
                if (sumMatch) {
                    const totalBytes = parseInt(sumMatch[1]);
                    return {
                        totalMB: Math.round(totalBytes / (1024 * 1024)),
                        percentUsed: Math.min(100, (totalBytes / (8 * 1024 * 1024 * 1024)) * 100) // Assume 8GB total
                    };
                }
            }
        } catch (error) {
            return { error: error.message };
        }
        
        return { totalMB: 0, percentUsed: 0 };
    }
    
    parseCpuInfo(cpuOutput) {
        // Parse PowerShell CPU output
        try {
            const match = cpuOutput.match(/(\d+(?:\.\d+)?)/);
            if (match) {
                return {
                    percentUsed: parseFloat(match[1])
                };
            }
        } catch (error) {
            return { error: error.message };
        }
        
        return { percentUsed: 0 };
    }
    
    parseProcessInfo(processOutput) {
        const processes = [];
        try {
            const lines = processOutput.split('\n').filter(line => line.trim());
            lines.forEach(line => {
                const match = line.match(/(\d+)\s+(\w+)\s+(\d+)\s+(\d+(?:\.\d+)?)/);
                if (match) {
                    processes.push({
                        id: parseInt(match[1]),
                        name: match[2],
                        workingSet: parseInt(match[3]),
                        cpu: parseFloat(match[4])
                    });
                }
            });
        } catch (error) {
            return { error: error.message };
        }
        
        return processes;
    }
    
    async getGuardianStatus() {
        return {
            active: this.monitoringActive,
            flowState: {
                overall: this.flowState.overall,
                energyLevel: this.flowState.energyLevel,
                healingActive: this.flowState.healingActive,
                lastDeepScan: this.flowState.lastDeepScan,
                lastWisdomSync: this.flowState.lastWisdomSync
            },
            services: Object.fromEntries(this.flowState.services),
            performanceMetrics: { ...this.performanceMetrics },
            healingQueue: this.healingQueue.length,
            totalFlowEvents: this.flowHistory.length,
            resolverStats: await this.resolver.getResolverStats()
        };
    }
    
    async exportGuardianWisdom() {
        const resolverKnowledge = await this.resolver.exportResolutionKnowledge();
        
        return {
            ...resolverKnowledge,
            guardian: {
                flowHistory: this.flowHistory,
                performanceMetrics: this.performanceMetrics,
                configuration: {
                    monitoringInterval: this.monitoringInterval,
                    deepScanInterval: this.deepScanInterval,
                    healingInterval: this.healingInterval,
                    wisdomSyncInterval: this.wisdomSyncInterval
                },
                services: this.services,
                uptime: process.uptime()
            }
        };
    }
}

module.exports = ContinuousFlowGuardian;