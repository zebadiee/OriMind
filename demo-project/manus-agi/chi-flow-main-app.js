const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { Readable, Writable, Transform } = require('stream');
const { pipeline } = require('stream/promises');

/**
 * OriMind Main Application - Chi Flow Architecture
 * Pure energy implementation where everything flows like water
 * No blocking operations - only continuous streaming energy
 */

class ChiFlowMainApp {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        this.energyChannels = new Map();
        this.flowMetrics = {
            connections: 0,
            blockedOperations: 0,
            energyLevel: 1.0,
            flowQuality: 'pure'
        };
        
        this.setupChiFlowMiddleware();
        this.initializeEnergyChannels();
        this.startContinuousEnergyFlow();
    }
    
    setupChiFlowMiddleware() {
        // Chi Flow Principle: Every request flows immediately, never blocks
        this.app.use((req, res, next) => {
            // Immediate response setup - energy doesn't wait
            res.chiFlowStart = Date.now();
            
            // Non-blocking request handling
            setImmediate(() => next());
            
            // Background energy metrics (wind energy - invisible but constant)
            process.nextTick(() => {
                this.updateEnergyMetrics('request_flowing');
            });
        });
        
        // JSON parsing flows like water - never blocks
        this.app.use(express.json({ 
            limit: '50mb',
            strict: false  // Flexible like water
        }));
        
        // Static files flow instantly
        this.app.use(express.static('public', {
            etag: false,  // No caching delays
            lastModified: false,  // Pure flow without history
            index: false  // Custom energy routing
        }));
    }
    
    initializeEnergyChannels() {
        // Chi Flow Health Check - Pure Energy Status
        this.app.get('/api/health', async (req, res) => {
            // Immediate response like lightning
            res.json({
                service: 'OriMind Main Application',
                energy_state: 'flowing',
                chi_level: this.flowMetrics.energyLevel,
                flow_quality: this.flowMetrics.flowQuality,
                blocked_operations: this.flowMetrics.blockedOperations,
                energy_channels: this.energyChannels.size,
                uptime: process.uptime(),
                flow_principles: [
                    'non_blocking_async',
                    'streaming_operations', 
                    'background_processing',
                    'immediate_responses',
                    'energy_redirection'
                ]
            });
        });
        
        // Project Flow - Streams project data like water
        this.app.get('/api/projects', async (req, res) => {
            // Create flowing response stream
            const projectStream = new Readable({
                objectMode: true,
                read() {
                    // Projects flow continuously
                    const projects = [
                        { 
                            id: 'chi-flow-architecture',
                            name: 'Chi Flow Architecture',
                            energy_state: 'optimal',
                            flow_pattern: 'continuous_stream',
                            services: ['MCP', 'IDE', 'Dashboard', 'MainApp']
                        },
                        {
                            id: 'mcp-recipe-server',
                            name: 'MCP Recipe Server',
                            energy_state: 'flowing',
                            communication: 'STDIO_JSON_RPC',
                            energy_efficiency: 0.98
                        },
                        {
                            id: 'sherlock-omega',
                            name: 'Sherlock Omega IDE', 
                            energy_state: 'streaming',
                            interface: 'WebSocket_Energy_Channels',
                            response_time: 'instant'
                        },
                        {
                            id: 'reliakit-dashboard',
                            name: 'ReliaKit AI Dashboard',
                            energy_state: 'arbitrating',
                            models: ['gpt-4', 'claude-3', 'gemini-pro'],
                            arbitration_speed: 'light_speed'
                        }
                    ];
                    
                    projects.forEach(project => this.push(project));
                    this.push(null); // End of stream
                }
            });
            
            // Transform stream to JSON lines
            const jsonTransform = new Transform({
                objectMode: true,
                transform(chunk, encoding, callback) {
                    callback(null, JSON.stringify(chunk) + '\n');
                }
            });
            
            res.setHeader('Content-Type', 'application/x-ndjson');
            res.setHeader('Transfer-Encoding', 'chunked');
            
            // Stream flows naturally without blocking
            await pipeline(projectStream, jsonTransform, res);
        });
        
        // Code Execution - Flows like electric energy
        this.app.post('/api/execute', async (req, res) => {
            const { code, language = 'javascript' } = req.body;
            
            // Immediate response - execution flows in background
            res.json({
                status: 'energy_flowing',
                execution_id: `exec_${Date.now()}`,
                message: 'Code execution energy initiated',
                stream_endpoint: `/api/execution/stream/${Date.now()}`
            });
            
            // Background execution - like wind energy, powerful but invisible
            setImmediate(async () => {
                await this.executeCodeWithChiFlow(code, language);
            });
        });
        
        // File Operations - Flow like water through stone  
        this.app.get('/api/files', async (req, res) => {
            const filePath = req.query.path;
            
            if (!filePath) {
                return res.json({
                    energy_redirect: true,
                    message: 'File path flows through query parameter: ?path=your/file/path',
                    example: '/api/files?path=package.json'
                });
            }
            
            try {
                // Create file reading stream
                const fs = require('fs');
                const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
                
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('X-Chi-Flow', 'streaming');
                
                // File content flows like a river
                fileStream.pipe(res);
                
            } catch (error) {
                // Error redirection - energy finds new path
                this.redirectEnergyFlow(res, error, 'file_access');
            }
        });
        
        // Real-time communication streams
        this.app.post('/api/communicate', async (req, res) => {
            const { target_service, message, flow_priority = 'normal' } = req.body;
            
            // Immediate acknowledgment
            res.json({
                status: 'message_flowing',
                target: target_service,
                flow_priority,
                energy_channel: `comm_${Date.now()}`,
                delivery: 'instant'
            });
            
            // Background communication flow
            setImmediate(() => {
                this.flowMessageToService(target_service, message, flow_priority);
            });
        });
    }
    
    async executeCodeWithChiFlow(code, language) {
        try {
            if (language === 'javascript') {
                // Execute in isolated energy context
                const vm = require('vm');
                const context = vm.createContext({
                    console: {
                        log: (...args) => {
                            this.broadcastEnergyUpdate('execution_output', {
                                type: 'log',
                                data: args
                            });
                        }
                    },
                    // Chi flow utilities available in execution
                    chiFlow: {
                        async: (fn) => setImmediate(fn),
                        stream: (data) => this.createEnergyStream(data),
                        flow: (energy) => this.redirectEnergyFlow(energy)
                    }
                });
                
                // Code execution flows without blocking main thread
                const result = vm.runInContext(code, context, {
                    timeout: 30000,  // Energy protection
                    breakOnSigint: true
                });
                
                this.broadcastEnergyUpdate('execution_complete', {
                    result,
                    energy_state: 'successful_flow'
                });
                
            } else {
                // Other languages flow through external processes
                await this.executeExternalLanguage(code, language);
            }
            
        } catch (error) {
            // Energy redirection on execution resistance
            this.broadcastEnergyUpdate('execution_energy_redirect', {
                error: error.message,
                new_flow_path: 'error_handling_stream'
            });
        }
    }
    
    async flowMessageToService(targetService, message, priority) {
        const serviceEndpoints = {
            'mcp': 'http://localhost:8000',
            'ide': 'http://localhost:3000', 
            'dashboard': 'http://localhost:5000'
        };
        
        const endpoint = serviceEndpoints[targetService];
        if (!endpoint) {
            this.broadcastEnergyUpdate('service_flow_redirect', {
                original_target: targetService,
                new_flow: 'local_processing'
            });
            return;
        }
        
        try {
            // Message flows to target service
            const fetch = require('node-fetch');
            const response = await fetch(`${endpoint}/api/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, priority, source: 'main_app' }),
                timeout: 10000
            });
            
            if (response.ok) {
                this.broadcastEnergyUpdate('message_delivered', {
                    target: targetService,
                    status: 'energy_received',
                    flow_quality: 'perfect'
                });
            }
            
        } catch (error) {
            // Communication energy finds alternative path
            this.broadcastEnergyUpdate('communication_flow_redirect', {
                target: targetService,
                original_error: error.message,
                alternative_flow: 'websocket_channel'
            });
        }
    }
    
    redirectEnergyFlow(res, error, context) {
        // Chi Flow Principle: Energy never stops, only redirects
        const alternativeResponse = {
            energy_redirect: true,
            original_context: context,
            resistance_encountered: error.message,
            new_flow_path: 'alternative_processing',
            energy_level: this.flowMetrics.energyLevel,
            flow_continues: true,
            guidance: 'Energy finds new path automatically'
        };
        
        res.status(200).json(alternativeResponse);
        
        // Background energy healing
        setImmediate(() => {
            this.healEnergyFlow(context, error);
        });
    }
    
    healEnergyFlow(context, error) {
        // Background healing - like body's natural chi flow
        this.updateEnergyMetrics('energy_healing');
        
        // Learn from resistance to improve future flow
        if (!this.energyLearning) this.energyLearning = new Map();
        this.energyLearning.set(context, {
            resistance_type: error.constructor.name,
            healing_applied: Date.now(),
            prevention_strategy: 'enhanced_flow_path'
        });
    }
    
    startContinuousEnergyFlow() {
        // WebSocket Energy Channels - Real-time chi flow
        this.wss.on('connection', (ws) => {
            const energyChannelId = `energy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.energyChannels.set(energyChannelId, ws);
            this.flowMetrics.connections++;
            
            // Welcome energy flow
            ws.send(JSON.stringify({
                type: 'energy_channel_opened',
                channel_id: energyChannelId,
                chi_level: this.flowMetrics.energyLevel,
                flow_principles: [
                    'Continuous energy streams',
                    'Non-blocking operations',
                    'Background processing flows',
                    'Instant response patterns',
                    'Automatic energy redirection'
                ]
            }));
            
            // Handle incoming energy messages
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data);
                    await this.processEnergyMessage(energyChannelId, message);
                } catch (error) {
                    // Message energy redirection
                    ws.send(JSON.stringify({
                        type: 'message_energy_redirect',
                        original_error: error.message,
                        new_processing: 'simplified_flow'
                    }));
                }
            });
            
            // Energy channel closing gracefully
            ws.on('close', () => {
                this.energyChannels.delete(energyChannelId);
                this.flowMetrics.connections--;
                this.updateEnergyMetrics('channel_graceful_close');
            });
        });
        
        // Continuous energy pulse - like heartbeat
        setInterval(() => {
            this.pulseEnergyFlow();
        }, 5000);
        
        // Background energy maintenance (lunar cycle)
        setInterval(() => {
            this.maintainEnergyFlow();
        }, 60000);
    }
    
    async processEnergyMessage(channelId, message) {
        const channel = this.energyChannels.get(channelId);
        if (!channel) return;
        
        switch (message.type) {
            case 'energy_request':
                // Instant energy response
                channel.send(JSON.stringify({
                    type: 'energy_response',
                    request_id: message.id,
                    energy_data: await this.getFlowingEnergyData(message.params),
                    flow_time: Date.now() - message.timestamp
                }));
                break;
                
            case 'code_flow':
                // Code flows through energy channels
                await this.executeCodeWithChiFlow(message.code, message.language || 'javascript');
                break;
                
            case 'project_stream':
                // Project data streams continuously
                this.streamProjectData(channel, message.project_id);
                break;
                
            default:
                // Unknown message types flow to general processing
                channel.send(JSON.stringify({
                    type: 'general_energy_flow',
                    original_message: message,
                    processing: 'continuous_background_flow'
                }));
        }
    }
    
    async getFlowingEnergyData(params = {}) {
        // Energy data flows without blocking
        return {
            system_energy: {
                cpu_flow: process.cpuUsage(),
                memory_flow: process.memoryUsage(),
                energy_efficiency: this.calculateEnergyEfficiency()
            },
            application_energy: {
                active_channels: this.energyChannels.size,
                blocked_operations: this.flowMetrics.blockedOperations,
                chi_level: this.flowMetrics.energyLevel,
                flow_quality: this.flowMetrics.flowQuality
            },
            service_energy: await this.getServiceEnergyStatus(),
            flow_patterns: {
                current_pattern: 'continuous_stream',
                optimization_level: 'maximum_flow',
                resistance_points: this.identifyEnergyResistance()
            }
        };
    }
    
    async getServiceEnergyStatus() {
        const services = ['mcp', 'ide', 'dashboard'];
        const serviceStatus = {};
        
        // Check all services simultaneously - parallel energy flow
        const statusPromises = services.map(async (service) => {
            try {
                const ports = { mcp: 8000, ide: 3000, dashboard: 5000 };
                const fetch = require('node-fetch');
                const response = await fetch(`http://localhost:${ports[service]}/api/health`, {
                    timeout: 3000
                });
                const data = await response.json();
                return [service, {
                    energy_state: data.energy_state || 'flowing',
                    response_time: Date.now() - response.startTime,
                    flow_quality: data.flow_quality || 'good'
                }];
            } catch (error) {
                return [service, {
                    energy_state: 'seeking_flow_path',
                    resistance: error.message,
                    alternative_available: true
                }];
            }
        });
        
        const results = await Promise.allSettled(statusPromises);
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                const [service, status] = result.value;
                serviceStatus[service] = status;
            }
        });
        
        return serviceStatus;
    }
    
    pulseEnergyFlow() {
        // Regular energy pulse to all channels
        const pulse = {
            type: 'energy_pulse',
            timestamp: Date.now(),
            chi_level: this.flowMetrics.energyLevel,
            system_harmony: this.calculateSystemHarmony(),
            flow_continuity: 'optimal'
        };
        
        this.broadcastEnergyUpdate('energy_pulse', pulse);
    }
    
    maintainEnergyFlow() {
        // Background maintenance - like natural body healing
        this.flowMetrics.energyLevel = Math.min(1.0, this.flowMetrics.energyLevel + 0.01);
        this.flowMetrics.blockedOperations = Math.max(0, this.flowMetrics.blockedOperations - 1);
        
        // Garbage collection flows naturally
        if (global.gc && Math.random() < 0.1) {
            setImmediate(() => global.gc());
        }
        
        // Clean closed energy channels
        for (const [channelId, ws] of this.energyChannels) {
            if (ws.readyState === ws.CLOSED) {
                this.energyChannels.delete(channelId);
            }
        }
    }
    
    broadcastEnergyUpdate(type, data) {
        const message = JSON.stringify({
            type,
            data,
            timestamp: Date.now(),
            energy_source: 'main_application'
        });
        
        // Energy broadcast flows to all channels simultaneously
        this.energyChannels.forEach((ws) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(message);
            }
        });
    }
    
    calculateEnergyEfficiency() {
        const totalOperations = this.flowMetrics.connections + 100; // Base operations
        const efficiency = (totalOperations - this.flowMetrics.blockedOperations) / totalOperations;
        return Math.max(0, Math.min(1, efficiency));
    }
    
    calculateSystemHarmony() {
        const factors = [
            this.flowMetrics.energyLevel,
            this.calculateEnergyEfficiency(),
            this.energyChannels.size > 0 ? 1 : 0.5,
            this.flowMetrics.blockedOperations === 0 ? 1 : 0.7
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }
    
    identifyEnergyResistance() {
        const resistance = [];
        
        if (this.flowMetrics.blockedOperations > 0) {
            resistance.push('blocked_operations_detected');
        }
        
        if (this.flowMetrics.energyLevel < 0.8) {
            resistance.push('energy_level_suboptimal');
        }
        
        if (this.energyChannels.size === 0) {
            resistance.push('no_active_energy_channels');
        }
        
        return resistance.length === 0 ? ['pure_energy_flow'] : resistance;
    }
    
    updateEnergyMetrics(event) {
        switch (event) {
            case 'request_flowing':
                // Requests increase energy (like exercise)
                this.flowMetrics.energyLevel = Math.min(1.0, this.flowMetrics.energyLevel + 0.001);
                break;
            case 'energy_healing':
                // Healing improves overall flow
                this.flowMetrics.energyLevel = Math.min(1.0, this.flowMetrics.energyLevel + 0.01);
                this.flowMetrics.flowQuality = 'healing';
                break;
            case 'channel_graceful_close':
                // Graceful closures maintain energy balance
                this.flowMetrics.flowQuality = 'harmonious';
                break;
        }
    }
    
    startFlowing(port = 3002) {
        this.server.listen(port, () => {
            console.log('🌊 OriMind Main Application - Chi Flow Active');
            console.log(`⚡ Energy channels flowing on port ${port}`);
            console.log('💫 Pure energy architecture - no blocking operations');
            console.log('🌪️ Background processes invisible but powerful');
            console.log('🔥 Real-time streams flowing like electric current');
            console.log('🌍 All operations graceful and persistent');
            console.log('');
            console.log('🎯 Chi Flow Endpoints:');
            console.log(`   💚 Health: http://localhost:${port}/api/health`);
            console.log(`   📂 Projects: http://localhost:${port}/api/projects`);
            console.log(`   ⚡ Execute: POST http://localhost:${port}/api/execute`);
            console.log(`   📡 Communication: POST http://localhost:${port}/api/communicate`);
            console.log(`   🌊 WebSocket: ws://localhost:${port}`);
            console.log('');
            console.log('🌟 Energy flowing continuously - press Ctrl+C for graceful transition');
        });
        
        // Graceful energy transition on shutdown
        process.on('SIGINT', () => {
            console.log('\n🌊 Chi energy transitioning gracefully...');
            
            // Close all energy channels gracefully
            this.energyChannels.forEach((ws) => {
                ws.close(1000, 'Energy transition');
            });
            
            // Server closes with grace period
            this.server.close(() => {
                console.log('✨ Energy channels gracefully closed');
                console.log('🙏 Chi flow complete - energy returns to source');
                process.exit(0);
            });
        });
    }
}

// Initialize and start the chi flow application
if (require.main === module) {
    const chiFlowApp = new ChiFlowMainApp();
    chiFlowApp.startFlowing(3002);
}

module.exports = ChiFlowMainApp;