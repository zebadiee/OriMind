const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');

/**
 * 🤖 ReliaKit AI Dashboard - Multi-Model Intelligence Arbitration
 * Chi Flow Architecture with Light-Speed Model Coordination
 * Pure energy arbitration across GPT-4, Claude-3, Gemini Pro
 */

class ReliaKitAIDashboard {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.port = process.env.PORT || 5000;
        this.energyState = 'arbitrating';
        this.activeConnections = new Set();
        this.models = new Map();
        this.arbitrationQueue = [];
        this.performanceMetrics = new Map();
        
        this.initializeModels();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.setupGracefulShutdown();
        this.startArbitrationEngine();
    }

    initializeModels() {
        // Initialize cutting-edge AI model configurations with comprehensive token limits
        this.models.set('gpt-4-turbo', {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            provider: 'OpenAI',
            energy_state: 'optimal',
            confidence: 0.96,
            speed: 0.85,
            cost_efficiency: 0.75,
            token_limit: 128000,
            context_window: '128K tokens',
            specialties: ['reasoning', 'code', 'analysis', 'long-context'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.01, output: 0.03 }
        });

        this.models.set('gpt-4o', {
            id: 'gpt-4o',
            name: 'GPT-4o (Omni)',
            provider: 'OpenAI',
            energy_state: 'multimodal',
            confidence: 0.97,
            speed: 0.9,
            cost_efficiency: 0.8,
            token_limit: 128000,
            context_window: '128K tokens',
            specialties: ['multimodal', 'vision', 'audio', 'reasoning', 'real-time'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.005, output: 0.015 }
        });

        this.models.set('claude-3-5-sonnet', {
            id: 'claude-3-5-sonnet',
            name: 'Claude-3.5 Sonnet',
            provider: 'Anthropic',
            energy_state: 'flowing',
            confidence: 0.95,
            speed: 0.9,
            cost_efficiency: 0.85,
            token_limit: 200000,
            context_window: '200K tokens',
            specialties: ['writing', 'analysis', 'safety', 'code', 'long-context'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.003, output: 0.015 }
        });

        this.models.set('claude-3-opus', {
            id: 'claude-3-opus',
            name: 'Claude-3 Opus',
            provider: 'Anthropic',
            energy_state: 'premium',
            confidence: 0.98,
            speed: 0.7,
            cost_efficiency: 0.6,
            token_limit: 200000,
            context_window: '200K tokens',
            specialties: ['complex-reasoning', 'research', 'creative-writing', 'analysis'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.015, output: 0.075 }
        });

        this.models.set('gemini-2-flash', {
            id: 'gemini-2-flash',
            name: 'Gemini 2.0 Flash',
            provider: 'Google',
            energy_state: 'streaming',
            confidence: 0.93,
            speed: 0.98,
            cost_efficiency: 0.95,
            token_limit: 1000000,
            context_window: '1M tokens',
            specialties: ['speed', 'efficiency', 'long-context', 'multimodal'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.00015, output: 0.0006 }
        });

        this.models.set('gemini-2-exp', {
            id: 'gemini-2-exp',
            name: 'Gemini 2.0 Experimental',
            provider: 'Google',
            energy_state: 'experimental',
            confidence: 0.94,
            speed: 0.85,
            cost_efficiency: 0.7,
            token_limit: 2000000,
            context_window: '2M tokens',
            specialties: ['experimental', 'research', 'ultra-long-context', 'advanced-reasoning'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.0, output: 0.0 }
        });

        this.models.set('deepseek-v3', {
            id: 'deepseek-v3',
            name: 'DeepSeek V3',
            provider: 'DeepSeek',
            energy_state: 'deep-thinking',
            confidence: 0.94,
            speed: 0.8,
            cost_efficiency: 0.98,
            token_limit: 128000,
            context_window: '128K tokens',
            specialties: ['reasoning', 'mathematics', 'code', 'cost-effective'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.00014, output: 0.00028 }
        });

        this.models.set('llama-3-1-405b', {
            id: 'llama-3-1-405b',
            name: 'Llama 3.1 405B',
            provider: 'Meta',
            energy_state: 'open-source',
            confidence: 0.93,
            speed: 0.75,
            cost_efficiency: 0.9,
            token_limit: 128000,
            context_window: '128K tokens',
            specialties: ['open-source', 'code', 'reasoning', 'multilingual'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.002, output: 0.002 }
        });

        this.models.set('nvidia-nemotron-4-340b', {
            id: 'nvidia-nemotron-4-340b',
            name: 'NVIDIA Nemotron-4 340B',
            provider: 'NVIDIA',
            energy_state: 'gpu-accelerated',
            confidence: 0.92,
            speed: 0.88,
            cost_efficiency: 0.85,
            token_limit: 4096,
            context_window: '4K tokens',
            specialties: ['gpu-optimization', 'scientific', 'inference', 'enterprise'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.004, output: 0.016 }
        });

        this.models.set('nvidia-llama-3-1-nemotron-70b', {
            id: 'nvidia-llama-3-1-nemotron-70b',
            name: 'NVIDIA Llama-3.1-Nemotron-70B',
            provider: 'NVIDIA',
            energy_state: 'enterprise',
            confidence: 0.91,
            speed: 0.92,
            cost_efficiency: 0.88,
            token_limit: 128000,
            context_window: '128K tokens',
            specialties: ['enterprise', 'gpu-acceleration', 'instruction-following', 'helpfulness'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.0015, output: 0.0015 }
        });

        this.models.set('qwen-2-5-72b', {
            id: 'qwen-2-5-72b',
            name: 'Qwen 2.5 72B',
            provider: 'Alibaba',
            energy_state: 'multilingual',
            confidence: 0.90,
            speed: 0.85,
            cost_efficiency: 0.92,
            token_limit: 128000,
            context_window: '128K tokens',
            specialties: ['multilingual', 'chinese', 'code', 'mathematics'],
            availability: true,
            last_response_time: 0,
            cost_per_1k_tokens: { input: 0.0008, output: 0.0008 }
        });

        // Initialize performance tracking
        this.models.forEach((model, id) => {
            this.performanceMetrics.set(id, {
                total_requests: 0,
                successful_responses: 0,
                average_response_time: 0,
                error_rate: 0,
                energy_efficiency: model.cost_efficiency,
                arbitration_wins: 0
            });
        });
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.static('public'));
        
        // Chi flow middleware - light-speed responses
        this.app.use((req, res, next) => {
            res.setHeader('X-Energy-State', this.energyState);
            res.setHeader('X-Arbitration-Speed', 'light_speed');
            res.setHeader('X-Multi-Model', 'active');
            next();
        });
    }

    setupRoutes() {
        // Health endpoint for Guardian monitoring
        this.app.get('/health', (req, res) => {
            res.json({
                service: 'ReliaKit AI Dashboard',
                energy_state: this.energyState,
                models: Array.from(this.models.keys()),
                arbitration_speed: 'light_speed',
                active_connections: this.activeConnections.size,
                queue_size: this.arbitrationQueue.length,
                uptime: process.uptime(),
                performance_summary: this.getPerformanceSummary(),
                chi_flow_principles: [
                    'multi_model_arbitration',
                    'light_speed_decisions',
                    'energy_efficient_routing',
                    'intelligent_load_balancing',
                    'continuous_optimization'
                ]
            });
        });

        // Models endpoint
        this.app.get('/api/models', (req, res) => {
            const modelsList = Array.from(this.models.values()).map(model => ({
                ...model,
                metrics: this.performanceMetrics.get(model.id)
            }));
            
            res.json({
                models: modelsList,
                total: modelsList.length,
                arbitration_state: 'active'
            });
        });

        // Arbitration endpoint - main intelligence routing
        this.app.post('/api/arbitrate', async (req, res) => {
            const { query, context, requirements, priority } = req.body;
            
            try {
                const arbitrationResult = await this.arbitrateRequest(query, context, requirements, priority);
                res.json({
                    result: arbitrationResult,
                    energy_state: 'optimized',
                    arbitration_time: arbitrationResult.processing_time
                });
            } catch (error) {
                res.status(500).json({
                    error: 'Arbitration energy disrupted',
                    message: error.message,
                    energy_state: 'redirecting',
                    fallback: 'available'
                });
            }
        });

        // Performance analytics endpoint
        this.app.get('/api/analytics', (req, res) => {
            const analytics = {
                overall_performance: this.getPerformanceSummary(),
                model_rankings: this.getModelRankings(),
                energy_efficiency: this.calculateEnergyEfficiency(),
                arbitration_patterns: this.getArbitrationPatterns(),
                optimization_recommendations: this.getOptimizationRecommendations()
            };
            
            res.json(analytics);
        });

        // Real-time model switching
        this.app.post('/api/switch-model', async (req, res) => {
            const { modelId, reason } = req.body;
            
            if (!this.models.has(modelId)) {
                return res.status(404).json({
                    error: 'Model not found',
                    available_models: Array.from(this.models.keys())
                });
            }

            const switchResult = await this.switchPrimaryModel(modelId, reason);
            res.json({
                success: true,
                switch_result: switchResult,
                energy_state: 'recalibrated'
            });
        });

        // Benchmark endpoint
        this.app.post('/api/benchmark', async (req, res) => {
            const { test_query, iterations } = req.body;
            
            try {
                const benchmarkResults = await this.runBenchmark(test_query, iterations || 3);
                res.json({
                    benchmark: benchmarkResults,
                    energy_state: 'analyzed',
                    recommendation: this.getBenchmarkRecommendation(benchmarkResults)
                });
            } catch (error) {
                res.status(500).json({
                    error: 'Benchmark energy scattered',
                    message: error.message
                });
            }
        });

        // Enhanced model comparison endpoint with token limits and pricing
        this.app.get('/api/models/compare', (req, res) => {
            const modelComparison = Array.from(this.models.values()).map(model => ({
                id: model.id,
                name: model.name,
                provider: model.provider,
                token_limit: model.token_limit,
                context_window: model.context_window,
                confidence: model.confidence,
                speed: model.speed,
                cost_efficiency: model.cost_efficiency,
                cost_per_1k_tokens: model.cost_per_1k_tokens,
                specialties: model.specialties,
                energy_state: model.energy_state,
                availability: model.availability,
                metrics: this.performanceMetrics.get(model.id)
            }));

            // Sort by different criteria
            const sortedByTokens = [...modelComparison].sort((a, b) => b.token_limit - a.token_limit);
            const sortedByCost = [...modelComparison].sort((a, b) => {
                const aCost = a.cost_per_1k_tokens ? a.cost_per_1k_tokens.input + a.cost_per_1k_tokens.output : Infinity;
                const bCost = b.cost_per_1k_tokens ? b.cost_per_1k_tokens.input + b.cost_per_1k_tokens.output : Infinity;
                return aCost - bCost;
            });
            const sortedBySpeed = [...modelComparison].sort((a, b) => b.speed - a.speed);

            res.json({
                all_models: modelComparison,
                total_models: modelComparison.length,
                rankings: {
                    by_context_size: sortedByTokens.slice(0, 5),
                    by_cost_efficiency: sortedByCost.slice(0, 5),
                    by_speed: sortedBySpeed.slice(0, 5)
                },
                providers: [...new Set(modelComparison.map(m => m.provider))],
                max_context_available: Math.max(...modelComparison.map(m => m.token_limit)),
                cheapest_option: sortedByCost[0],
                fastest_option: sortedBySpeed[0],
                energy_state: 'comprehensive_analysis'
            });
        });

        // Token requirement analyzer endpoint
        this.app.post('/api/analyze-tokens', (req, res) => {
            const { text, target_models } = req.body;
            const estimatedTokens = Math.ceil(text.length / 4);
            
            const suitableModels = Array.from(this.models.values()).filter(model => {
                if (target_models && !target_models.includes(model.id)) return false;
                return model.token_limit >= estimatedTokens + 1000; // Buffer for response
            }).sort((a, b) => {
                // Sort by cost efficiency for suitable models
                const aCost = a.cost_per_1k_tokens ? a.cost_per_1k_tokens.input + a.cost_per_1k_tokens.output : 1;
                const bCost = b.cost_per_1k_tokens ? b.cost_per_1k_tokens.input + b.cost_per_1k_tokens.output : 1;
                return aCost - bCost;
            });

            const costEstimates = suitableModels.map(model => ({
                model: model.name,
                estimated_cost: model.cost_per_1k_tokens ? 
                    ((estimatedTokens / 1000) * (model.cost_per_1k_tokens.input + model.cost_per_1k_tokens.output)).toFixed(4) : 
                    'Free/Unknown',
                token_utilization: `${((estimatedTokens / model.token_limit) * 100).toFixed(1)}%`,
                remaining_capacity: model.token_limit - estimatedTokens
            }));

            res.json({
                text_length: text.length,
                estimated_tokens: estimatedTokens,
                suitable_models: suitableModels.length,
                cost_estimates: costEstimates,
                recommendations: {
                    cheapest: costEstimates[0],
                    highest_capacity: suitableModels.sort((a, b) => b.token_limit - a.token_limit)[0]?.name,
                    best_value: suitableModels.find(m => m.cost_efficiency > 0.9)?.name || 'DeepSeek V3'
                },
                energy_state: 'token_optimized'
            });
        });

        // Default route
        this.app.get('/', (req, res) => {
            res.json({
                service: 'ReliaKit AI Dashboard',
                message: '🤖 Multi-Model Intelligence Arbitration - Light Speed Decisions',
                energy_state: this.energyState,
                websocket: `ws://localhost:${this.port}`,
                models: Array.from(this.models.keys()),
                total_models: this.models.size,
                max_context_tokens: Math.max(...Array.from(this.models.values()).map(m => m.token_limit)),
                providers: [...new Set(Array.from(this.models.values()).map(m => m.provider))],
                endpoints: [
                    'GET /health - Service energy status',
                    'GET /api/models - Available AI models',
                    'GET /api/models/compare - Comprehensive model comparison',
                    'POST /api/analyze-tokens - Token requirement analysis',
                    'POST /api/arbitrate - Intelligent request routing',
                    'GET /api/analytics - Performance insights',
                    'POST /api/switch-model - Dynamic model switching',
                    'POST /api/benchmark - Model performance testing'
                ]
            });
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            console.log('🔗 New arbitration connection established');
            this.activeConnections.add(ws);

            // Send initial state
            ws.send(JSON.stringify({
                type: 'connection',
                message: 'AI arbitration channel established',
                energy_state: this.energyState,
                available_models: Array.from(this.models.keys()),
                server_time: new Date().toISOString()
            }));

            // Handle incoming messages
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleWebSocketMessage(ws, data);
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Arbitration parsing disrupted',
                        error: error.message,
                        energy_state: 'redirecting'
                    }));
                }
            });

            // Handle disconnection
            ws.on('close', () => {
                console.log('🔌 Arbitration connection gracefully closed');
                this.activeConnections.delete(ws);
            });

            // Handle errors
            ws.on('error', (error) => {
                console.log('⚡ Arbitration energy disturbance:', error.message);
                this.activeConnections.delete(ws);
            });
        });
    }

    async handleWebSocketMessage(ws, data) {
        const { type, payload } = data;

        switch (type) {
            case 'real_time_arbitration':
                await this.handleRealTimeArbitration(ws, payload);
                break;
            case 'model_performance_request':
                await this.handlePerformanceRequest(ws, payload);
                break;
            case 'optimization_request':
                await this.handleOptimizationRequest(ws, payload);
                break;
            case 'subscribe_metrics':
                await this.handleMetricsSubscription(ws, payload);
                break;
            default:
                ws.send(JSON.stringify({
                    type: 'unknown_arbitration',
                    message: 'Arbitration pattern not recognized',
                    received_type: type
                }));
        }
    }

    async handleRealTimeArbitration(ws, payload) {
        const { query, context, requirements } = payload;
        
        const result = await this.arbitrateRequest(query, context, requirements, 'real-time');
        
        ws.send(JSON.stringify({
            type: 'arbitration_result',
            result,
            energy_state: 'optimized'
        }));
    }

    async handlePerformanceRequest(ws, payload) {
        const performance = this.getPerformanceSummary();
        
        ws.send(JSON.stringify({
            type: 'performance_data',
            performance,
            rankings: this.getModelRankings(),
            energy_state: 'analyzed'
        }));
    }

    async handleOptimizationRequest(ws, payload) {
        const optimizations = this.getOptimizationRecommendations();
        
        ws.send(JSON.stringify({
            type: 'optimization_recommendations',
            optimizations,
            energy_state: 'optimized'
        }));
    }

    async handleMetricsSubscription(ws, payload) {
        // Subscribe to real-time metrics updates
        ws.metricsSubscription = true;
        
        ws.send(JSON.stringify({
            type: 'metrics_subscription_active',
            message: 'Real-time metrics streaming enabled',
            energy_state: 'streaming'
        }));
    }

    async arbitrateRequest(query, context, requirements, priority = 'normal') {
        const startTime = Date.now();
        
        // Analyze request characteristics
        const requestAnalysis = this.analyzeRequest(query, context, requirements);
        
        // Select optimal model based on analysis
        const selectedModel = this.selectOptimalModel(requestAnalysis, priority);
        
        // Simulate AI model processing
        const response = await this.processWithModel(selectedModel, query, context);
        
        const processingTime = Date.now() - startTime;
        
        // Update performance metrics
        this.updatePerformanceMetrics(selectedModel.id, processingTime, true);
        
        // Broadcast to WebSocket subscribers
        this.broadcastArbitrationResult({
            model: selectedModel.id,
            processing_time: processingTime,
            confidence: response.confidence,
            energy_efficiency: response.energy_efficiency
        });
        
        return {
            selected_model: selectedModel,
            response: response,
            processing_time: processingTime,
            arbitration_reasoning: requestAnalysis.reasoning,
            energy_efficiency: response.energy_efficiency
        };
    }

    analyzeRequest(query, context, requirements) {
        // Enhanced intelligent request analysis with token estimation
        const totalText = query + (context || '');
        const estimatedTokens = Math.ceil(totalText.length / 4); // Rough token estimation
        const complexity = query.length > 500 ? 'high' : query.length > 100 ? 'medium' : 'low';
        const type = this.detectRequestType(query);
        const urgency = requirements?.priority || 'normal';
        const requiresLongContext = estimatedTokens > 32000;
        const requiresMultimodal = this.detectMultimodalNeed(query);
        const requiresCostOptimization = requirements?.cost_sensitive || false;
        
        return {
            complexity,
            type,
            urgency,
            estimated_tokens: estimatedTokens,
            requires_long_context: requiresLongContext,
            requires_multimodal: requiresMultimodal,
            requires_cost_optimization: requiresCostOptimization,
            reasoning: `Request analyzed as ${complexity} complexity ${type} task with ${urgency} priority, ~${estimatedTokens} tokens${requiresLongContext ? ' (long-context required)' : ''}${requiresMultimodal ? ' (multimodal)' : ''}${requiresCostOptimization ? ' (cost-optimized)' : ''}`
        };
    }

    detectRequestType(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('code') || lowerQuery.includes('function') || lowerQuery.includes('debug') || lowerQuery.includes('programming')) {
            return 'coding';
        } else if (lowerQuery.includes('write') || lowerQuery.includes('essay') || lowerQuery.includes('article') || lowerQuery.includes('content')) {
            return 'writing';
        } else if (lowerQuery.includes('analyze') || lowerQuery.includes('data') || lowerQuery.includes('insight') || lowerQuery.includes('research')) {
            return 'analysis';
        } else if (lowerQuery.includes('image') || lowerQuery.includes('visual') || lowerQuery.includes('picture') || lowerQuery.includes('multimodal')) {
            return 'multimodal';
        } else if (lowerQuery.includes('math') || lowerQuery.includes('calculate') || lowerQuery.includes('equation')) {
            return 'mathematics';
        } else if (lowerQuery.includes('reason') || lowerQuery.includes('logic') || lowerQuery.includes('think')) {
            return 'reasoning';
        } else if (lowerQuery.includes('translate') || lowerQuery.includes('language') || lowerQuery.includes('chinese')) {
            return 'multilingual';
        }
        return 'general';
    }

    detectMultimodalNeed(query) {
        const multimodalKeywords = ['image', 'visual', 'picture', 'photo', 'diagram', 'chart', 'video', 'audio'];
        return multimodalKeywords.some(keyword => query.toLowerCase().includes(keyword));
    }

    selectOptimalModel(analysis, priority) {
        const availableModels = Array.from(this.models.values()).filter(m => m.availability);
        
        // Filter models based on token requirements
        const tokenSuitableModels = availableModels.filter(model => {
            if (analysis.requires_long_context) {
                return model.token_limit >= 100000; // Need at least 100K tokens for long context
            }
            return model.token_limit >= analysis.estimated_tokens + 1000; // Buffer for response
        });
        
        // If no models can handle the token requirement, use the largest available
        const candidateModels = tokenSuitableModels.length > 0 ? tokenSuitableModels : 
            availableModels.sort((a, b) => b.token_limit - a.token_limit).slice(0, 3);
        
        // Apply advanced arbitration logic based on request characteristics and token requirements
        let scores = candidateModels.map(model => {
            let score = model.confidence * 0.3 + model.speed * 0.25 + model.cost_efficiency * 0.2;
            
            // Token efficiency scoring
            if (analysis.requires_long_context && model.token_limit >= 200000) score += 0.3;
            else if (analysis.requires_long_context && model.token_limit >= 100000) score += 0.15;
            
            // Cost optimization for budget-conscious requests
            if (analysis.requires_cost_optimization) {
                const costScore = model.cost_per_1k_tokens ? 
                    1 - (model.cost_per_1k_tokens.input + model.cost_per_1k_tokens.output) * 100 : 0.5;
                score += costScore * 0.4;
            }
            
            // Specialty matching with enhanced categories
            if (analysis.type === 'coding' && model.specialties.includes('code')) score += 0.25;
            if (analysis.type === 'writing' && model.specialties.includes('writing')) score += 0.25;
            if (analysis.type === 'analysis' && model.specialties.includes('analysis')) score += 0.25;
            if (analysis.type === 'multimodal' && model.specialties.includes('multimodal')) score += 0.3;
            if (analysis.type === 'mathematics' && model.specialties.includes('mathematics')) score += 0.25;
            if (analysis.type === 'reasoning' && model.specialties.includes('reasoning')) score += 0.25;
            if (analysis.type === 'multilingual' && model.specialties.includes('multilingual')) score += 0.25;
            
            // Provider-specific boosts
            if (analysis.type === 'coding' && model.provider === 'DeepSeek') score += 0.15;
            if (analysis.requires_multimodal && model.provider === 'OpenAI') score += 0.15;
            if (analysis.requires_long_context && model.provider === 'Google') score += 0.2;
            if (priority === 'enterprise' && model.provider === 'NVIDIA') score += 0.2;
            
            // Priority adjustments
            if (priority === 'urgent' && model.speed > 0.9) score += 0.15;
            if (priority === 'cost-sensitive' && model.cost_efficiency > 0.85) score += 0.2;
            if (priority === 'experimental' && model.energy_state === 'experimental') score += 0.25;
            
            return { 
                model, 
                score,
                token_fit: model.token_limit >= analysis.estimated_tokens,
                cost_estimate: model.cost_per_1k_tokens ? 
                    (analysis.estimated_tokens / 1000) * (model.cost_per_1k_tokens.input + model.cost_per_1k_tokens.output) : 
                    'N/A'
            };
        });
        
        // Sort by score and return the best with detailed reasoning
        scores.sort((a, b) => b.score - a.score);
        const selected = scores[0];
        
        // Add selection reasoning
        selected.selection_reasoning = {
            token_compatibility: selected.token_fit,
            estimated_cost: selected.cost_estimate,
            specialty_match: selected.model.specialties.filter(s => 
                analysis.type === 'coding' && s === 'code' ||
                analysis.type === 'writing' && s === 'writing' ||
                analysis.type === 'analysis' && s === 'analysis' ||
                analysis.type === 'multimodal' && s === 'multimodal' ||
                analysis.type === 'mathematics' && s === 'mathematics' ||
                analysis.type === 'reasoning' && s === 'reasoning' ||
                analysis.type === 'multilingual' && s === 'multilingual'
            ),
            alternatives_considered: scores.slice(1, 4).map(s => ({
                model: s.model.name,
                score: s.score.toFixed(3),
                reason: s.model.specialties.join(', ')
            }))
        };
        
        return selected.model;
    }

    async processWithModel(model, query, context) {
        // Simulate AI model processing with different characteristics
        const baseDelay = model.speed > 0.9 ? 100 : model.speed > 0.8 ? 200 : 300;
        const processingDelay = baseDelay + Math.random() * 200;
        
        await new Promise(resolve => setTimeout(resolve, processingDelay));
        
        return {
            model_id: model.id,
            response: `Processed by ${model.name}: ${query.substring(0, 50)}...`,
            confidence: model.confidence + (Math.random() * 0.1 - 0.05),
            energy_efficiency: model.cost_efficiency + (Math.random() * 0.1 - 0.05),
            processing_details: {
                specialties_matched: model.specialties,
                provider: model.provider,
                optimization_applied: true
            }
        };
    }

    updatePerformanceMetrics(modelId, processingTime, success) {
        const metrics = this.performanceMetrics.get(modelId);
        if (metrics) {
            metrics.total_requests++;
            if (success) {
                metrics.successful_responses++;
                metrics.arbitration_wins++;
            }
            
            // Update average response time
            metrics.average_response_time = 
                (metrics.average_response_time * (metrics.total_requests - 1) + processingTime) / 
                metrics.total_requests;
            
            metrics.error_rate = 1 - (metrics.successful_responses / metrics.total_requests);
        }
    }

    getPerformanceSummary() {
        const summary = {};
        this.performanceMetrics.forEach((metrics, modelId) => {
            summary[modelId] = {
                ...metrics,
                energy_score: (metrics.energy_efficiency * 0.5 + 
                              (1 - metrics.error_rate) * 0.3 + 
                              (1000 / (metrics.average_response_time || 1000)) * 0.2)
            };
        });
        return summary;
    }

    getModelRankings() {
        const performance = this.getPerformanceSummary();
        const rankings = Object.entries(performance)
            .map(([modelId, metrics]) => ({ modelId, ...metrics }))
            .sort((a, b) => b.energy_score - a.energy_score);
        
        return rankings;
    }

    calculateEnergyEfficiency() {
        const totalRequests = Array.from(this.performanceMetrics.values())
            .reduce((sum, metrics) => sum + metrics.total_requests, 0);
        
        if (totalRequests === 0) return 1.0;
        
        const totalEfficiency = Array.from(this.performanceMetrics.values())
            .reduce((sum, metrics) => sum + (metrics.energy_efficiency * metrics.total_requests), 0);
        
        return totalEfficiency / totalRequests;
    }

    getArbitrationPatterns() {
        return {
            most_used_model: this.getMostUsedModel(),
            optimal_time_distribution: this.getTimeDistribution(),
            success_patterns: this.getSuccessPatterns()
        };
    }

    getMostUsedModel() {
        let maxRequests = 0;
        let mostUsed = null;
        
        this.performanceMetrics.forEach((metrics, modelId) => {
            if (metrics.total_requests > maxRequests) {
                maxRequests = metrics.total_requests;
                mostUsed = modelId;
            }
        });
        
        return mostUsed;
    }

    getTimeDistribution() {
        const distribution = {};
        this.performanceMetrics.forEach((metrics, modelId) => {
            distribution[modelId] = metrics.average_response_time;
        });
        return distribution;
    }

    getSuccessPatterns() {
        const patterns = {};
        this.performanceMetrics.forEach((metrics, modelId) => {
            patterns[modelId] = {
                success_rate: metrics.total_requests > 0 ? 
                    metrics.successful_responses / metrics.total_requests : 0,
                arbitration_win_rate: metrics.arbitration_wins / (metrics.total_requests || 1)
            };
        });
        return patterns;
    }

    getOptimizationRecommendations() {
        const rankings = this.getModelRankings();
        const recommendations = [];
        
        if (rankings.length > 0) {
            const topModel = rankings[0];
            const worstModel = rankings[rankings.length - 1];
            
            recommendations.push({
                type: 'model_prioritization',
                message: `Consider prioritizing ${topModel.modelId} for better performance`,
                impact: 'high'
            });
            
            if (worstModel.error_rate > 0.1) {
                recommendations.push({
                    type: 'model_maintenance',
                    message: `${worstModel.modelId} shows high error rate - needs attention`,
                    impact: 'medium'
                });
            }
        }
        
        return recommendations;
    }

    async switchPrimaryModel(modelId, reason) {
        const model = this.models.get(modelId);
        if (!model) return { success: false, error: 'Model not found' };
        
        // Update model priority
        model.priority = 'primary';
        
        return {
            success: true,
            switched_to: modelId,
            reason,
            timestamp: new Date().toISOString()
        };
    }

    async runBenchmark(testQuery, iterations) {
        const results = {};
        
        for (const [modelId, model] of this.models) {
            if (!model.availability) continue;
            
            const modelResults = [];
            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                await this.processWithModel(model, testQuery, {});
                const endTime = Date.now();
                modelResults.push(endTime - startTime);
            }
            
            results[modelId] = {
                average_time: modelResults.reduce((a, b) => a + b, 0) / modelResults.length,
                min_time: Math.min(...modelResults),
                max_time: Math.max(...modelResults),
                consistency: this.calculateConsistency(modelResults)
            };
        }
        
        return results;
    }

    calculateConsistency(times) {
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);
        return 1 - (stdDev / mean); // Higher value = more consistent
    }

    getBenchmarkRecommendation(results) {
        const fastest = Object.entries(results)
            .sort((a, b) => a[1].average_time - b[1].average_time)[0];
        
        const mostConsistent = Object.entries(results)
            .sort((a, b) => b[1].consistency - a[1].consistency)[0];
        
        return {
            fastest_model: fastest[0],
            most_consistent: mostConsistent[0],
            recommendation: `For speed: ${fastest[0]}, For consistency: ${mostConsistent[0]}`
        };
    }

    broadcastArbitrationResult(result) {
        this.activeConnections.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN && ws.metricsSubscription) {
                ws.send(JSON.stringify({
                    type: 'real_time_arbitration',
                    result,
                    timestamp: new Date().toISOString()
                }));
            }
        });
    }

    startArbitrationEngine() {
        // Periodic performance optimization
        setInterval(() => {
            this.optimizeModelPerformance();
        }, 60000); // Every minute
        
        // Real-time metrics broadcast
        setInterval(() => {
            this.broadcastMetrics();
        }, 5000); // Every 5 seconds
    }

    optimizeModelPerformance() {
        // Simulate dynamic performance optimization
        this.models.forEach((model, id) => {
            const metrics = this.performanceMetrics.get(id);
            if (metrics && metrics.total_requests > 10) {
                // Adjust model parameters based on performance
                if (metrics.error_rate < 0.05) {
                    model.confidence = Math.min(0.98, model.confidence + 0.01);
                } else if (metrics.error_rate > 0.15) {
                    model.confidence = Math.max(0.80, model.confidence - 0.02);
                }
            }
        });
    }

    broadcastMetrics() {
        const metrics = {
            performance: this.getPerformanceSummary(),
            rankings: this.getModelRankings(),
            energy_efficiency: this.calculateEnergyEfficiency(),
            timestamp: new Date().toISOString()
        };
        
        this.activeConnections.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN && ws.metricsSubscription) {
                ws.send(JSON.stringify({
                    type: 'metrics_update',
                    metrics,
                    energy_state: 'streaming'
                }));
            }
        });
    }

    setupGracefulShutdown() {
        process.on('SIGINT', () => {
            console.log('\n🤖 ReliaKit AI Dashboard: Energy transitioning gracefully...');
            this.energyState = 'transitioning';
            
            // Close all WebSocket connections gracefully
            this.activeConnections.forEach(ws => {
                ws.send(JSON.stringify({
                    type: 'server_shutdown',
                    message: 'AI arbitration energy returning to source',
                    energy_state: 'transitioning'
                }));
                ws.close();
            });
            
            this.server.close(() => {
                console.log('🙏 ReliaKit AI Dashboard energy gracefully returned to source');
                process.exit(0);
            });
        });
    }

    start() {
        this.server.listen(this.port, () => {
            this.energyState = 'arbitrating';
            console.log(`🤖 ReliaKit AI Dashboard: Multi-model intelligence flowing on port ${this.port}`);
            console.log(`⚡ Light-speed arbitration: http://localhost:${this.port}`);
            console.log(`🧠 Models active: ${Array.from(this.models.keys()).join(', ')}`);
            console.log(`🌊 WebSocket arbitration: ws://localhost:${this.port}`);
            console.log(`🚀 Arbitration engine: Light speed decisions active`);
        });
    }
}

// Initialize and start ReliaKit AI Dashboard
const reliaKitDashboard = new ReliaKitAIDashboard();
reliaKitDashboard.start();

module.exports = ReliaKitAIDashboard;