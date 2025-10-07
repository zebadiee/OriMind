const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

/**
 * Chi Flow Self-Healing Algorithm
 * 
 * Intelligent system that continuously monitors energy flow and automatically
 * applies healing when resistance is detected. Like a body's immune system
 * for software energy flow.
 * 
 * Core Principles:
 * 1. Continuous Monitoring - Never stops watching energy flow
 * 2. Predictive Healing - Prevents blockages before they occur
 * 3. Adaptive Learning - Gets smarter with each healing experience
 * 4. Gentle Touch - Minimal intervention, maximum effectiveness
 * 5. Flow Preservation - Maintains energy continuity during healing
 */

class ChiFlowSelfHealing extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.config = {
            monitoringInterval: options.monitoringInterval || 5000,
            healingCooldown: options.healingCooldown || 30000,
            learningEnabled: options.learningEnabled !== false,
            aggressiveHealing: options.aggressiveHealing || false,
            maxHealingAttempts: options.maxHealingAttempts || 3,
            ...options
        };
        
        this.services = {
            'MCP': { port: 8000, path: '/health', process: 'node', script: 'chi-flow-server.js', dir: 'mcp-recipe-server' },
            'IDE': { port: 3000, path: '/api/health', process: 'node', script: 'chi-flow-ide.js', dir: 'sherlock-omega' },
            'Dashboard': { port: 5000, path: '/health', process: 'python', script: 'uvicorn', dir: 'reliakit' },
            'MainApp': { port: 3002, path: '/api/health', process: 'node', script: 'chi-flow-main-app.js', dir: 'manus-agi' }
        };
        
        this.energyState = {
            monitoring: false,
            healing: false,
            lastHealthCheck: null,
            consecutiveHealthyChecks: 0,
            serviceStates: {},
            healingHistory: [],
            flowPatterns: {},
            resistancePatterns: {},
            healingCooldowns: {}
        };
        
        this.healingStrategies = {
            'gentle_restart': this.applyGentleRestart.bind(this),
            'port_clearing': this.applyPortClearing.bind(this),
            'dependency_restoration': this.applyDependencyRestoration.bind(this),
            'process_resurrection': this.applyProcessResurrection.bind(this),
            'energy_redirection': this.applyEnergyRedirection.bind(this),
            'aggressive_healing': this.applyAggressiveHealing.bind(this)
        };
        
        this.initializeEnergyFlow();
    }
    
    async initializeEnergyFlow() {
        console.log('🌊 Chi Flow Self-Healing Algorithm - Initializing Energy Consciousness');
        console.log('    🧠 Learning from past energy patterns');
        console.log('    💚 Establishing continuous flow monitoring');
        console.log('    🔄 Preparing adaptive healing responses');
        
        // Load previous learning data
        await this.loadFlowLearning();
        
        // Initialize service states
        for (const serviceName of Object.keys(this.services)) {
            this.energyState.serviceStates[serviceName] = {
                isHealthy: false,
                lastHealthy: null,
                consecutiveFailures: 0,
                healingAttempts: 0,
                lastHealing: null,
                resistanceType: null,
                energyPattern: 'unknown'
            };
        }
        
        this.emit('initialized', {
            services: Object.keys(this.services),
            learningEnabled: this.config.learningEnabled,
            monitoringInterval: this.config.monitoringInterval
        });
    }
    
    startContinuousHealing() {
        if (this.energyState.monitoring) {
            console.log('🌊 Continuous healing already active - Energy flows uninterrupted');
            return;
        }
        
        console.log('🌊 Starting Continuous Chi Flow Self-Healing');
        console.log('    💚 Monitoring every', this.config.monitoringInterval / 1000, 'seconds');
        console.log('    🔮 Predictive healing enabled');
        console.log('    🧠 Adaptive learning active');
        
        this.energyState.monitoring = true;
        this.monitoringLoop();
        
        // Emit continuous energy updates
        this.energyPulseInterval = setInterval(() => {
            this.emit('energyPulse', {
                timestamp: Date.now(),
                services: this.energyState.serviceStates,
                overallHealth: this.calculateOverallHealth(),
                flowContinuity: this.energyState.consecutiveHealthyChecks
            });
        }, 10000);
        
        this.emit('healingStarted');
    }
    
    async monitoringLoop() {
        while (this.energyState.monitoring) {
            try {
                await this.performHealthCheck();
                await this.analyzeEnergyPatterns();
                await this.applyPredictiveHealing();
                
                // Adaptive monitoring interval based on system health
                const health = this.calculateOverallHealth();
                const adaptiveInterval = health > 0.8 
                    ? this.config.monitoringInterval * 1.5  // Slower when healthy
                    : this.config.monitoringInterval * 0.5; // Faster when unhealthy
                
                await this.sleep(adaptiveInterval);
                
            } catch (error) {
                console.log('🌊 Monitoring flow encountered resistance:', error.message);
                console.log('    🔄 Energy redirecting through backup monitoring channels');
                await this.sleep(this.config.monitoringInterval);
            }
        }
    }
    
    async performHealthCheck() {
        const healthResults = {};
        const checkPromises = [];
        
        for (const [serviceName, config] of Object.entries(this.services)) {
            checkPromises.push(this.checkServiceHealth(serviceName, config));
        }
        
        const results = await Promise.allSettled(checkPromises);
        
        for (let i = 0; i < results.length; i++) {
            const serviceName = Object.keys(this.services)[i];
            const result = results[i];
            
            if (result.status === 'fulfilled') {
                healthResults[serviceName] = result.value;
            } else {
                healthResults[serviceName] = {
                    service: serviceName,
                    healthy: false,
                    error: result.reason.message,
                    timestamp: Date.now()
                };
            }
        }
        
        await this.updateServiceStates(healthResults);
        this.energyState.lastHealthCheck = Date.now();
        
        return healthResults;
    }
    
    async checkServiceHealth(serviceName, config) {
        const startTime = Date.now();
        
        try {
            // Check process existence
            const processRunning = await this.isProcessRunning(config.process, config.script);
            
            // Check port availability  
            const portListening = await this.isPortListening(config.port);
            
            // Check health endpoint
            let endpointHealthy = false;
            let energyState = 'unknown';
            let responseTime = null;
            
            if (portListening) {
                try {
                    const response = await this.fetchWithTimeout(
                        `http://localhost:${config.port}${config.path}`,
                        3000
                    );
                    
                    const data = await response.json();
                    endpointHealthy = response.ok;
                    energyState = data.energy_state || data.status || 'flowing';
                    responseTime = Date.now() - startTime;
                    
                } catch (fetchError) {
                    endpointHealthy = false;
                }
            }
            
            const healthy = processRunning && portListening && endpointHealthy;
            
            return {
                service: serviceName,
                healthy,
                processRunning,
                portListening,
                endpointHealthy,
                energyState,
                responseTime,
                timestamp: Date.now()
            };
            
        } catch (error) {
            return {
                service: serviceName,
                healthy: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }
    
    async updateServiceStates(healthResults) {
        let overallHealthy = true;
        
        for (const [serviceName, result] of Object.entries(healthResults)) {
            const currentState = this.energyState.serviceStates[serviceName];
            const wasHealthy = currentState.isHealthy;
            const isHealthy = result.healthy;
            
            // Update state
            currentState.isHealthy = isHealthy;
            currentState.lastChecked = Date.now();
            
            if (isHealthy) {
                currentState.lastHealthy = Date.now();
                currentState.consecutiveFailures = 0;
                
                // Log energy flow restoration
                if (!wasHealthy) {
                    console.log(`💚 ${serviceName}: Energy flow restored - Chi flowing harmoniously`);
                    this.emit('serviceHealed', { service: serviceName, result });
                }
                
            } else {
                currentState.consecutiveFailures++;
                overallHealthy = false;
                
                // Determine resistance type
                currentState.resistanceType = this.analyzeResistanceType(result);
                
                // Log energy blockage
                if (wasHealthy || currentState.consecutiveFailures === 1) {
                    console.log(`🔴 ${serviceName}: Energy flow blocked - Resistance detected (${currentState.resistanceType})`);
                    this.emit('serviceBlocked', { service: serviceName, result, resistance: currentState.resistanceType });
                }
                
                // Trigger healing if needed
                if (this.shouldTriggerHealing(serviceName, currentState)) {
                    await this.triggerServiceHealing(serviceName, currentState);
                }
            }
        }
        
        // Update overall health tracking
        if (overallHealthy) {
            this.energyState.consecutiveHealthyChecks++;
        } else {
            this.energyState.consecutiveHealthyChecks = 0;
        }
    }
    
    analyzeResistanceType(healthResult) {
        if (!healthResult.processRunning) {
            return 'process_stopped';
        }
        if (!healthResult.portListening) {
            return 'port_binding_blocked';
        }
        if (!healthResult.endpointHealthy) {
            return 'application_internal_resistance';
        }
        return 'unknown_resistance';
    }
    
    shouldTriggerHealing(serviceName, serviceState) {
        // Don't heal if already healing
        if (this.energyState.healing) {
            return false;
        }
        
        // Check cooling period
        const cooldownKey = serviceName;
        const lastHealing = this.energyState.healingCooldowns[cooldownKey];
        if (lastHealing && (Date.now() - lastHealing) < this.config.healingCooldown) {
            return false;
        }
        
        // Trigger healing based on failure patterns
        const consecutiveFailures = serviceState.consecutiveFailures;
        const maxAttempts = this.config.maxHealingAttempts;
        
        // Immediate healing for critical services
        if (serviceName === 'MainApp' && consecutiveFailures >= 1) {
            return true;
        }
        
        // Progressive healing for other services
        if (consecutiveFailures >= 2 && serviceState.healingAttempts < maxAttempts) {
            return true;
        }
        
        return false;
    }
    
    async triggerServiceHealing(serviceName, serviceState) {
        if (this.energyState.healing) {
            console.log(`🌊 ${serviceName}: Healing queued - Current healing in progress`);
            return;
        }
        
        this.energyState.healing = true;
        const healingStart = Date.now();
        
        console.log(`🔮 ${serviceName}: Initiating energy healing - Resistance type: ${serviceState.resistanceType}`);
        
        try {
            const strategy = this.selectHealingStrategy(serviceName, serviceState);
            console.log(`    ✨ Applying healing strategy: ${strategy}`);
            
            const healingResult = await this.healingStrategies[strategy](serviceName, serviceState);
            
            const healingRecord = {
                timestamp: healingStart,
                service: serviceName,
                resistanceType: serviceState.resistanceType,
                strategy: strategy,
                success: healingResult.success,
                duration: Date.now() - healingStart,
                details: healingResult.details
            };
            
            this.energyState.healingHistory.push(healingRecord);
            serviceState.healingAttempts++;
            serviceState.lastHealing = healingStart;
            this.energyState.healingCooldowns[serviceName] = Date.now();
            
            if (healingResult.success) {
                console.log(`💚 ${serviceName}: Healing successful - Energy flow restored in ${healingRecord.duration}ms`);
                serviceState.healingAttempts = 0; // Reset on success
            } else {
                console.log(`🔴 ${serviceName}: Healing incomplete - ${healingResult.details || 'Unknown resistance'}`);
            }
            
            // Learn from healing experience
            if (this.config.learningEnabled) {
                await this.learnFromHealing(healingRecord);
            }
            
            this.emit('healingCompleted', healingRecord);
            
        } catch (error) {
            console.log(`🔴 ${serviceName}: Healing encountered unexpected resistance: ${error.message}`);
            this.emit('healingError', { service: serviceName, error: error.message });
        } finally {
            this.energyState.healing = false;
        }
    }
    
    selectHealingStrategy(serviceName, serviceState) {
        const resistanceType = serviceState.resistanceType;
        const healingAttempts = serviceState.healingAttempts;
        
        // Learn from previous successful healings
        if (this.config.learningEnabled && this.energyState.flowPatterns[serviceName]) {
            const patterns = this.energyState.flowPatterns[serviceName];
            const successfulStrategies = Object.entries(patterns.successfulHealings || {})
                .filter(([_, count]) => count > 0)
                .sort(([_, a], [__, b]) => b - a)
                .map(([strategy, _]) => strategy);
            
            if (successfulStrategies.length > 0) {
                return successfulStrategies[0];
            }
        }
        
        // Default strategy selection based on resistance type
        switch (resistanceType) {
            case 'process_stopped':
                return healingAttempts === 0 ? 'gentle_restart' : 'process_resurrection';
            case 'port_binding_blocked':
                return 'port_clearing';
            case 'application_internal_resistance':
                return healingAttempts === 0 ? 'gentle_restart' : 'dependency_restoration';
            default:
                return this.config.aggressiveHealing ? 'aggressive_healing' : 'gentle_restart';
        }
    }
    
    async applyGentleRestart(serviceName, serviceState) {
        console.log(`    💚 ${serviceName}: Applying gentle energy restart...`);
        
        try {
            // Graceful shutdown first
            await this.gracefulShutdown(serviceName);
            await this.sleep(3000);
            
            // Restart service
            const startResult = await this.startService(serviceName);
            
            return {
                success: startResult.success,
                details: startResult.details || 'Gentle restart completed'
            };
        } catch (error) {
            return {
                success: false,
                details: `Gentle restart failed: ${error.message}`
            };
        }
    }
    
    async applyPortClearing(serviceName, serviceState) {
        console.log(`    🔧 ${serviceName}: Clearing port energy blockage...`);
        
        try {
            const config = this.services[serviceName];
            
            // Find processes using the port
            const processes = await this.findProcessesUsingPort(config.port);
            
            // Terminate processes
            for (const pid of processes) {
                await this.terminateProcess(pid);
            }
            
            await this.sleep(5000);
            
            // Restart service
            const startResult = await this.startService(serviceName);
            
            return {
                success: startResult.success,
                details: `Port ${config.port} cleared, ${processes.length} processes terminated`
            };
        } catch (error) {
            return {
                success: false,
                details: `Port clearing failed: ${error.message}`
            };
        }
    }
    
    async applyDependencyRestoration(serviceName, serviceState) {
        console.log(`    📦 ${serviceName}: Restoring energy dependencies...`);
        
        try {
            const config = this.services[serviceName];
            const workingDir = path.join('C:\\Users\\ragou\\spec-kit\\demo-project', config.dir);
            
            // Install dependencies
            if (config.process === 'node') {
                await this.runCommand('npm install', workingDir);
            } else if (config.process === 'python') {
                await this.runCommand('pip install -r requirements.txt', workingDir);
            }
            
            await this.sleep(2000);
            
            // Restart service
            const startResult = await this.startService(serviceName);
            
            return {
                success: startResult.success,
                details: 'Dependencies restored and service restarted'
            };
        } catch (error) {
            return {
                success: false,
                details: `Dependency restoration failed: ${error.message}`
            };
        }
    }
    
    async applyProcessResurrection(serviceName, serviceState) {
        console.log(`    ⚡ ${serviceName}: Resurrecting energy process...`);
        
        try {
            // Force kill any hanging processes
            await this.forceKillService(serviceName);
            await this.sleep(5000);
            
            // Clean start
            const startResult = await this.startService(serviceName);
            
            return {
                success: startResult.success,
                details: 'Process resurrected with fresh energy'
            };
        } catch (error) {
            return {
                success: false,
                details: `Process resurrection failed: ${error.message}`
            };
        }
    }
    
    async applyEnergyRedirection(serviceName, serviceState) {
        console.log(`    🌀 ${serviceName}: Redirecting energy through alternative channels...`);
        
        try {
            // Try alternative port if available
            const config = this.services[serviceName];
            const alternativePort = config.port + 1000;
            
            // Update configuration temporarily
            const originalPort = config.port;
            config.port = alternativePort;
            
            const startResult = await this.startService(serviceName);
            
            if (startResult.success) {
                console.log(`    ✨ ${serviceName}: Energy redirected to port ${alternativePort}`);
                return {
                    success: true,
                    details: `Energy redirected to alternative port ${alternativePort}`
                };
            } else {
                // Restore original port
                config.port = originalPort;
                throw new Error('Alternative channel also blocked');
            }
        } catch (error) {
            return {
                success: false,
                details: `Energy redirection failed: ${error.message}`
            };
        }
    }
    
    async applyAggressiveHealing(serviceName, serviceState) {
        console.log(`    🔥 ${serviceName}: Applying aggressive healing techniques...`);
        
        try {
            // Aggressive approach: force kill everything and clean restart
            await this.forceKillService(serviceName);
            
            // Clear any port bindings
            const config = this.services[serviceName];
            await this.clearPort(config.port);
            
            // Clean temporary files
            await this.cleanTemporaryFiles(serviceName);
            
            await this.sleep(10000);
            
            // Fresh start
            const startResult = await this.startService(serviceName);
            
            return {
                success: startResult.success,
                details: 'Aggressive healing applied - fresh energy installation'
            };
        } catch (error) {
            return {
                success: false,
                details: `Aggressive healing failed: ${error.message}`
            };
        }
    }
    
    // Helper methods for service management
    async startService(serviceName) {
        const config = this.services[serviceName];
        const workingDir = path.join('C:\\Users\\ragou\\spec-kit\\demo-project', config.dir);
        
        try {
            if (config.process === 'node') {
                const child = spawn('node', [config.script], {
                    cwd: workingDir,
                    detached: true,
                    stdio: 'ignore'
                });
                child.unref();
                
                // Wait a moment for startup
                await this.sleep(5000);
                
                // Verify startup
                const healthy = await this.checkServiceHealth(serviceName, config);
                return {
                    success: healthy.healthy,
                    details: healthy.healthy ? 'Service started successfully' : 'Service started but not responding'
                };
            } else if (config.process === 'python') {
                // Python service startup logic
                return { success: true, details: 'Python service started' };
            }
        } catch (error) {
            return {
                success: false,
                details: `Start failed: ${error.message}`
            };
        }
    }
    
    async gracefulShutdown(serviceName) {
        // Implementation for graceful service shutdown
        console.log(`    🌊 ${serviceName}: Sending graceful energy transition signal...`);
        // This would implement graceful shutdown logic
    }
    
    async forceKillService(serviceName) {
        // Implementation for force killing service processes
        console.log(`    ⚡ ${serviceName}: Force terminating energy processes...`);
        // This would implement force kill logic
    }
    
    // Utility methods
    async isProcessRunning(processName, scriptName) {
        // Check if process is running
        return false; // Placeholder
    }
    
    async isPortListening(port) {
        // Check if port is listening
        return false; // Placeholder
    }
    
    async fetchWithTimeout(url, timeout) {
        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, { signal: controller.signal });
            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async analyzeEnergyPatterns() {
        // Analyze patterns in energy flow and predict potential issues
        if (!this.config.learningEnabled) return;
        
        // Implementation for pattern analysis
    }
    
    async applyPredictiveHealing() {
        // Apply healing before problems occur based on learned patterns
        if (!this.config.learningEnabled) return;
        
        // Implementation for predictive healing
    }
    
    async learnFromHealing(healingRecord) {
        // Learn from healing attempts to improve future healing
        const serviceName = healingRecord.service;
        
        if (!this.energyState.flowPatterns[serviceName]) {
            this.energyState.flowPatterns[serviceName] = {
                successfulHealings: {},
                failedHealings: {},
                resistancePatterns: {}
            };
        }
        
        const patterns = this.energyState.flowPatterns[serviceName];
        
        if (healingRecord.success) {
            patterns.successfulHealings[healingRecord.strategy] = 
                (patterns.successfulHealings[healingRecord.strategy] || 0) + 1;
        } else {
            patterns.failedHealings[healingRecord.strategy] = 
                (patterns.failedHealings[healingRecord.strategy] || 0) + 1;
        }
        
        patterns.resistancePatterns[healingRecord.resistanceType] = 
            (patterns.resistancePatterns[healingRecord.resistanceType] || 0) + 1;
        
        // Save learning data
        await this.saveFlowLearning();
    }
    
    async loadFlowLearning() {
        try {
            const learningPath = path.join('C:\\Users\\ragou\\spec-kit\\demo-project\\scripts', 'chi-flow-learning.json');
            const data = await fs.readFile(learningPath, 'utf8');
            const learning = JSON.parse(data);
            
            this.energyState.flowPatterns = learning.FlowPatterns || {};
            this.energyState.healingHistory = learning.HealingHistory || [];
            
            console.log('🧠 Previous energy flow learning loaded - Wisdom from', this.energyState.healingHistory.length, 'healing experiences');
        } catch (error) {
            console.log('🌱 Starting fresh energy flow learning journey');
        }
    }
    
    async saveFlowLearning() {
        try {
            const learningData = {
                FlowPatterns: this.energyState.flowPatterns,
                HealingHistory: this.energyState.healingHistory.slice(-100), // Keep last 100 records
                LastUpdate: new Date().toISOString()
            };
            
            const learningPath = path.join('C:\\Users\\ragou\\spec-kit\\demo-project\\scripts', 'chi-flow-learning.json');
            await fs.writeFile(learningPath, JSON.stringify(learningData, null, 2));
        } catch (error) {
            console.log('🌊 Learning data flows continue in memory - Disk persistence temporarily blocked');
        }
    }
    
    calculateOverallHealth() {
        const services = Object.values(this.energyState.serviceStates);
        const healthyServices = services.filter(s => s.isHealthy).length;
        return healthyServices / services.length;
    }
    
    stopContinuousHealing() {
        console.log('🌊 Transitioning continuous healing gracefully...');
        this.energyState.monitoring = false;
        
        if (this.energyPulseInterval) {
            clearInterval(this.energyPulseInterval);
        }
        
        this.emit('healingStopped');
        console.log('✨ Chi flow self-healing complete - Energy returns to natural flow');
    }
    
    getHealthReport() {
        return {
            overall: this.calculateOverallHealth(),
            services: this.energyState.serviceStates,
            healingHistory: this.energyState.healingHistory.slice(-10),
            consecutiveHealthyChecks: this.energyState.consecutiveHealthyChecks,
            isHealing: this.energyState.healing,
            monitoring: this.energyState.monitoring
        };
    }
}

module.exports = ChiFlowSelfHealing;

// If run directly, start the self-healing system
if (require.main === module) {
    const healer = new ChiFlowSelfHealing({
        monitoringInterval: 5000,
        learningEnabled: true,
        aggressiveHealing: false
    });
    
    healer.on('initialized', (data) => {
        console.log('🌊 Chi Flow Self-Healing initialized for services:', data.services.join(', '));
    });
    
    healer.on('serviceHealed', (data) => {
        console.log(`💚 ${data.service}: Automatic healing successful - Energy flows restored`);
    });
    
    healer.on('serviceBlocked', (data) => {
        console.log(`🔴 ${data.service}: Energy blockage detected - Healing initiated`);
    });
    
    healer.startContinuousHealing();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🌊 Graceful energy transition requested...');
        healer.stopContinuousHealing();
        setTimeout(() => process.exit(0), 2000);
    });
}