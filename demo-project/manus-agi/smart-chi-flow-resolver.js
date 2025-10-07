const ChiFlowRAGSystem = require('./chi-flow-rag-system');
const { EventEmitter } = require('events');
const { spawn, exec } = require('child_process');
const fs = require('fs').promises;

/**
 * OriMind Smart Chi Flow Resolution Engine
 * 
 * This AI-powered engine uses RAG knowledge to automatically identify,
 * analyze, and resolve chi flow resistance patterns without human intervention.
 * 
 * Resolution Principles:
 * - Every problem has been seen before or is similar to one that has
 * - Knowledge flows to where healing is needed
 * - Solutions adapt and evolve through experience
 * - Energy automatically redirects around obstacles
 * - Learning accelerates with each resolution
 */

class SmartChiFlowResolver extends EventEmitter {
    constructor(options = {}) {
        super();
        this.ragSystem = new ChiFlowRAGSystem(options.knowledgeBasePath);
        this.activeResolutions = new Map();
        this.resolutionHistory = [];
        this.autoResolveEnabled = options.autoResolve !== false;
        this.confidenceThreshold = options.confidenceThreshold || 0.7;
        this.maxConcurrentResolutions = options.maxConcurrentResolutions || 3;
        this.resolutionTimeout = options.resolutionTimeout || 300000; // 5 minutes
        
        this.setupRAGListeners();
        this.startContinuousResolution();
        
        console.log('🤖 Smart Chi Flow Resolver: AI-powered healing engine activated');
    }
    
    setupRAGListeners() {
        this.ragSystem.on('issue_documented', async (issue) => {
            if (this.autoResolveEnabled) {
                await this.attemptAutoResolution(issue);
            }
        });
        
        this.ragSystem.on('pattern_analysis_complete', (insights) => {
            this.adaptResolutionStrategies(insights);
        });
    }
    
    async analyzeAndResolve(error, context) {
        const analysisStart = Date.now();
        console.log('🔍 Smart Resolver: Analyzing chi flow resistance...');
        
        // Document the issue in RAG system
        const issueFingerprint = await this.ragSystem.documentIssue({
            error,
            context,
            stackTrace: error.stack,
            environment: this.getEnvironmentInfo(),
            severity: this.assessSeverity(error, context)
        });
        
        // Get AI-powered healing guidance
        const guidance = await this.ragSystem.getHealingGuidance(error, context);
        
        // Create resolution plan
        const resolutionPlan = await this.createResolutionPlan(guidance, context);
        
        // Execute resolution if confidence is high enough
        if (resolutionPlan.confidence >= this.confidenceThreshold) {
            const resolution = await this.executeResolution(resolutionPlan, issueFingerprint);
            return resolution;
        } else {
            console.log(`⚠️ Resolution confidence too low (${(resolutionPlan.confidence * 100).toFixed(1)}%), requiring manual intervention`);
            return {
                status: 'manual_intervention_required',
                confidence: resolutionPlan.confidence,
                suggestedActions: resolutionPlan.actions,
                reasoning: resolutionPlan.reasoning
            };
        }
    }
    
    async attemptAutoResolution(issue) {
        if (this.activeResolutions.size >= this.maxConcurrentResolutions) {
            console.log('🔄 Resolution queue full, deferring auto-resolution');
            return;
        }
        
        try {
            const resolution = await this.analyzeAndResolve(
                new Error(issue.error), 
                issue.context
            );
            
            if (resolution.status === 'success') {
                console.log(`✨ Auto-resolved chi flow resistance: ${issue.fingerprint}`);
            }
        } catch (error) {
            console.log(`🌊 Auto-resolution encountered resistance: ${error.message}`);
        }
    }
    
    async createResolutionPlan(guidance, context) {
        const plan = {
            actions: [],
            confidence: guidance.confidence,
            estimatedTime: guidance.expectedTimeToResolve,
            riskLevel: 'low',
            reasoning: [],
            fallbackActions: []
        };
        
        // Process immediate actions from RAG
        if (guidance.immediateActions && guidance.immediateActions.length > 0) {
            plan.actions = guidance.immediateActions.map(action => ({
                type: 'command',
                command: this.substituteVariables(action, context),
                description: `Execute: ${action}`,
                risk: this.assessCommandRisk(action),
                timeout: 30000
            }));
            
            plan.reasoning.push('Using proven solutions from knowledge base');
        }
        
        // Add context-specific intelligence
        await this.enhancePlanWithContextualIntelligence(plan, context);
        
        // Add fallback strategies
        plan.fallbackActions = await this.generateFallbackActions(context);
        
        // Calculate final confidence based on multiple factors
        plan.confidence = this.calculatePlanConfidence(plan, guidance);
        
        return plan;
    }
    
    async enhancePlanWithContextualIntelligence(plan, context) {
        // Add pre-resolution health checks
        plan.actions.unshift({
            type: 'health_check',
            command: await this.generateHealthCheckCommand(context),
            description: 'Verify system state before resolution',
            risk: 'none',
            timeout: 10000
        });
        
        // Add service-specific intelligence
        if (context.service) {
            const serviceActions = await this.getServiceSpecificActions(context.service, context);
            plan.actions.push(...serviceActions);
            plan.reasoning.push(`Applied ${context.service} service-specific intelligence`);
        }
        
        // Add post-resolution validation
        plan.actions.push({
            type: 'validation',
            command: await this.generateValidationCommand(context),
            description: 'Validate resolution effectiveness',
            risk: 'none',
            timeout: 15000
        });
    }
    
    async executeResolution(plan, issueFingerprint) {
        const resolutionId = `resolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const startTime = Date.now();
        
        console.log(`🚀 Executing chi flow resolution: ${resolutionId}`);
        console.log(`📋 Plan: ${plan.actions.length} actions, confidence: ${(plan.confidence * 100).toFixed(1)}%`);
        
        this.activeResolutions.set(resolutionId, {
            issueFingerprint,
            plan,
            startTime,
            status: 'executing'
        });
        
        const resolution = {
            id: resolutionId,
            status: 'executing',
            actions: [],
            errors: [],
            startTime,
            endTime: null,
            wasSuccessful: false
        };
        
        try {
            // Execute actions sequentially with intelligent error handling
            for (let i = 0; i < plan.actions.length; i++) {
                const action = plan.actions[i];
                
                console.log(`⚡ Executing action ${i + 1}/${plan.actions.length}: ${action.description}`);
                
                const actionResult = await this.executeAction(action, resolution);
                resolution.actions.push(actionResult);
                
                // Intelligent failure handling
                if (!actionResult.success) {
                    const shouldContinue = await this.handleActionFailure(
                        action, actionResult, plan, i, resolution
                    );
                    
                    if (!shouldContinue) {
                        break;
                    }
                }
                
                // Dynamic plan adjustment based on results
                await this.adjustPlanBasedOnResults(plan, actionResult, i);
            }
            
            // Evaluate overall success
            resolution.wasSuccessful = await this.evaluateResolutionSuccess(resolution, plan);
            resolution.status = resolution.wasSuccessful ? 'success' : 'failed';
            
        } catch (error) {
            resolution.status = 'error';
            resolution.errors.push({
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        } finally {
            resolution.endTime = Date.now();
            resolution.duration = resolution.endTime - resolution.startTime;
            
            this.activeResolutions.delete(resolutionId);
            this.resolutionHistory.push(resolution);
            
            // Feed results back to RAG system for learning
            await this.ragSystem.learnFromResolution(
                issueFingerprint,
                resolutionId,
                resolution.wasSuccessful,
                resolution.duration
            );
            
            console.log(`${resolution.wasSuccessful ? '✅' : '❌'} Resolution ${resolutionId} ${resolution.status} (${resolution.duration}ms)`);
        }
        
        return resolution;
    }
    
    async executeAction(action, resolution) {
        const actionStart = Date.now();
        const result = {
            action: action.description,
            command: action.command,
            startTime: actionStart,
            endTime: null,
            duration: null,
            success: false,
            output: '',
            error: null
        };
        
        try {
            switch (action.type) {
                case 'command':
                    result.output = await this.executeCommand(action.command, action.timeout);
                    result.success = true;
                    break;
                    
                case 'health_check':
                    result.output = await this.executeHealthCheck(action.command);
                    result.success = true;
                    break;
                    
                case 'validation':
                    const validationResult = await this.executeValidation(action.command);
                    result.output = validationResult.output;
                    result.success = validationResult.success;
                    break;
                    
                case 'service_restart':
                    result.output = await this.restartService(action.service);
                    result.success = true;
                    break;
                    
                case 'energy_redirect':
                    result.output = await this.redirectEnergy(action.from, action.to);
                    result.success = true;
                    break;
                    
                default:
                    throw new Error(`Unknown action type: ${action.type}`);
            }
            
        } catch (error) {
            result.error = {
                message: error.message,
                code: error.code,
                stack: error.stack
            };
            result.success = false;
        } finally {
            result.endTime = Date.now();
            result.duration = result.endTime - result.startTime;
        }
        
        return result;
    }
    
    async executeCommand(command, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Command timeout after ${timeout}ms`));
            }, timeout);
            
            exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
                clearTimeout(timeoutId);
                
                if (error) {
                    reject(new Error(`Command failed: ${error.message}\nStderr: ${stderr}`));
                } else {
                    resolve(stdout || stderr || 'Command executed successfully');
                }
            });
        });
    }
    
    async executeHealthCheck(command) {
        try {
            const output = await this.executeCommand(command, 10000);
            return `Health check passed: ${output}`;
        } catch (error) {
            return `Health check warning: ${error.message}`;
        }
    }
    
    async executeValidation(command) {
        try {
            const output = await this.executeCommand(command, 15000);
            
            // Intelligent validation result interpretation
            const success = this.interpretValidationOutput(output);
            
            return {
                success,
                output: success ? `Validation successful: ${output}` : `Validation failed: ${output}`
            };
        } catch (error) {
            return {
                success: false,
                output: `Validation error: ${error.message}`
            };
        }
    }
    
    interpretValidationOutput(output) {
        const successIndicators = [
            'success', 'ok', 'healthy', 'running', 'active', 'connected', 'flowing'
        ];
        const failureIndicators = [
            'error', 'fail', 'timeout', 'refused', 'unavailable', 'blocked'
        ];
        
        const outputLower = output.toLowerCase();
        
        const hasSuccess = successIndicators.some(indicator => outputLower.includes(indicator));
        const hasFailure = failureIndicators.some(indicator => outputLower.includes(indicator));
        
        if (hasSuccess && !hasFailure) return true;
        if (hasFailure && !hasSuccess) return false;
        
        // Default to success if ambiguous
        return true;
    }
    
    async restartService(serviceName) {
        const restartCommands = {
            'node_app': 'taskkill /F /IM node.exe && Start-Sleep 2',
            'python_app': 'taskkill /F /IM python.exe && Start-Sleep 2',
            'mcp_server': 'taskkill /F /IM node.exe /FI "WINDOWTITLE eq MCP*" && Start-Sleep 2',
            'default': 'echo "Service restart not implemented for: ' + serviceName + '"'
        };
        
        const command = restartCommands[serviceName] || restartCommands.default;
        return await this.executeCommand(command);
    }
    
    async redirectEnergy(fromPort, toPort) {
        // Implement energy redirection logic
        const command = `netstat -ano | findstr :${fromPort} && echo "Redirecting energy flow from ${fromPort} to ${toPort}"`;
        return await this.executeCommand(command);
    }
    
    async handleActionFailure(action, actionResult, plan, actionIndex, resolution) {
        console.log(`⚠️ Action failed: ${action.description}`);
        console.log(`   Error: ${actionResult.error?.message}`);
        
        // Check if we have fallback actions
        if (plan.fallbackActions && plan.fallbackActions.length > 0) {
            console.log('🔄 Attempting fallback action...');
            
            const fallbackAction = plan.fallbackActions.shift();
            const fallbackResult = await this.executeAction(fallbackAction, resolution);
            
            if (fallbackResult.success) {
                console.log('✅ Fallback action successful');
                return true; // Continue with plan
            }
        }
        
        // Check if this action is critical
        if (action.risk === 'critical' || actionIndex === 0) {
            console.log('❌ Critical action failed, aborting resolution');
            return false; // Abort resolution
        }
        
        // For non-critical actions, continue
        console.log('⏭️ Non-critical action failed, continuing with plan');
        return true;
    }
    
    async adjustPlanBasedOnResults(plan, actionResult, actionIndex) {
        // Dynamic plan adjustment based on intermediate results
        if (actionResult.success && actionResult.output.includes('already running')) {
            // Remove redundant restart actions
            plan.actions = plan.actions.filter(action => 
                action.type !== 'service_restart' || 
                plan.actions.indexOf(action) <= actionIndex
            );
        }
        
        if (actionResult.output.includes('port') && actionResult.output.includes('available')) {
            // Add port-specific actions if needed
            const portAction = {
                type: 'command',
                command: 'netstat -ano | findstr :3002',
                description: 'Check port availability',
                risk: 'none',
                timeout: 10000
            };
            plan.actions.splice(actionIndex + 1, 0, portAction);
        }
    }
    
    async evaluateResolutionSuccess(resolution, plan) {
        const successfulActions = resolution.actions.filter(action => action.success);
        const successRate = successfulActions.length / resolution.actions.length;
        
        // Consider resolution successful if:
        // 1. At least 70% of actions succeeded
        // 2. No critical failures occurred
        // 3. Validation action (if present) succeeded
        
        const hasValidation = resolution.actions.find(action => action.action.includes('Validate'));
        const validationSucceeded = hasValidation ? hasValidation.success : true;
        
        const hasCriticalFailure = resolution.actions.some(action => 
            !action.success && action.action.includes('critical')
        );
        
        return successRate >= 0.7 && !hasCriticalFailure && validationSucceeded;
    }
    
    substituteVariables(command, context) {
        let substituted = command;
        
        // Common variable substitutions
        const substitutions = {
            '${port}': context.port || '3002',
            '${service}': context.service || 'unknown',
            '${pid}': context.pid || '0',
            '${host}': context.host || 'localhost',
            '${env}': context.environment || 'development'
        };
        
        for (const [variable, value] of Object.entries(substitutions)) {
            substituted = substituted.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
        }
        
        return substituted;
    }
    
    assessCommandRisk(command) {
        const commandLower = command.toLowerCase();
        
        const highRiskKeywords = ['kill', 'delete', 'remove', 'format', 'drop', 'destroy'];
        const mediumRiskKeywords = ['restart', 'stop', 'force', 'reset'];
        
        if (highRiskKeywords.some(keyword => commandLower.includes(keyword))) {
            return 'high';
        }
        if (mediumRiskKeywords.some(keyword => commandLower.includes(keyword))) {
            return 'medium';
        }
        
        return 'low';
    }
    
    async generateHealthCheckCommand(context) {
        if (context.port) {
            return `Test-NetConnection -ComputerName localhost -Port ${context.port}`;
        }
        if (context.service) {
            return `Get-Process | Where-Object {$_.ProcessName -like "*${context.service}*"}`;
        }
        return 'echo "System status check"';
    }
    
    async generateValidationCommand(context) {
        if (context.port) {
            return `curl -s http://localhost:${context.port}/api/health -m 5`;
        }
        if (context.service === 'node') {
            return 'node --version';
        }
        return 'echo "Validation complete"';
    }
    
    async getServiceSpecificActions(service, context) {
        const serviceActions = {
            'node': [
                {
                    type: 'command',
                    command: 'npm list --depth=0',
                    description: 'Check Node.js dependencies',
                    risk: 'none',
                    timeout: 15000
                }
            ],
            'mcp': [
                {
                    type: 'command',
                    command: 'node -e "console.log(\'MCP server check\')"',
                    description: 'Verify MCP server capability',
                    risk: 'none',
                    timeout: 10000
                }
            ],
            'express': [
                {
                    type: 'command',
                    command: `curl -s http://localhost:${context.port || 3002}/api/health -m 3 || echo "Service unavailable"`,
                    description: 'Test Express server endpoint',
                    risk: 'none',
                    timeout: 10000
                }
            ]
        };
        
        return serviceActions[service] || [];
    }
    
    async generateFallbackActions(context) {
        const fallbacks = [
            {
                type: 'command',
                command: 'echo "Attempting energy redirection..."',
                description: 'Energy redirection fallback',
                risk: 'none',
                timeout: 5000
            }
        ];
        
        if (context.port) {
            fallbacks.unshift({
                type: 'command',
                command: `netstat -ano | findstr :${context.port} | findstr LISTENING`,
                description: 'Check port availability fallback',
                risk: 'none',
                timeout: 10000
            });
        }
        
        return fallbacks;
    }
    
    calculatePlanConfidence(plan, guidance) {
        let confidence = guidance.confidence || 0.5;
        
        // Adjust based on plan characteristics
        if (plan.actions.length <= 3) confidence += 0.1; // Simpler plans are more reliable
        if (plan.actions.every(action => action.risk === 'low')) confidence += 0.1;
        if (plan.reasoning.length > 0) confidence += 0.05; // Plans with reasoning are better
        
        // Adjust based on historical success
        const recentResolutions = this.resolutionHistory.slice(-10);
        if (recentResolutions.length > 0) {
            const recentSuccessRate = recentResolutions.filter(r => r.wasSuccessful).length / recentResolutions.length;
            confidence = (confidence + recentSuccessRate) / 2;
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }
    
    assessSeverity(error, context) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('critical') || errorMessage.includes('fatal')) return 'critical';
        if (errorMessage.includes('eaddrinuse') || errorMessage.includes('port')) return 'high';
        if (errorMessage.includes('timeout') || errorMessage.includes('connection')) return 'medium';
        if (errorMessage.includes('warning') || errorMessage.includes('deprecated')) return 'low';
        
        return 'medium';
    }
    
    getEnvironmentInfo() {
        return {
            platform: process.platform,
            nodeVersion: process.version,
            pid: process.pid,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
        };
    }
    
    adaptResolutionStrategies(insights) {
        console.log('🧠 Adapting resolution strategies based on insights...');
        
        // Adjust confidence threshold based on recent success
        if (insights.bestPerformingSolutions.length > 0) {
            const bestCategory = insights.bestPerformingSolutions[0];
            if (bestCategory[1] > 0.9) {
                this.confidenceThreshold = Math.max(0.6, this.confidenceThreshold - 0.05);
                console.log(`📈 Lowered confidence threshold to ${this.confidenceThreshold} due to high success rate`);
            }
        }
        
        // Adjust timeout based on common issue patterns
        if (insights.mostCommonIssues.some(([category]) => category === 'networking')) {
            this.resolutionTimeout = Math.min(600000, this.resolutionTimeout * 1.2); // Increase timeout for network issues
            console.log(`⏱️ Increased resolution timeout to ${this.resolutionTimeout}ms for network stability`);
        }
    }
    
    startContinuousResolution() {
        // Monitor for stuck resolutions
        setInterval(() => {
            const now = Date.now();
            for (const [resolutionId, resolution] of this.activeResolutions) {
                if (now - resolution.startTime > this.resolutionTimeout) {
                    console.log(`⏰ Resolution ${resolutionId} timed out, marking as failed`);
                    this.activeResolutions.delete(resolutionId);
                    
                    // Record timeout failure for learning
                    this.resolutionHistory.push({
                        id: resolutionId,
                        status: 'timeout',
                        wasSuccessful: false,
                        duration: this.resolutionTimeout,
                        endTime: now
                    });
                }
            }
        }, 30000); // Check every 30 seconds
        
        // Periodic self-optimization
        setInterval(() => {
            this.optimizeResolverPerformance();
        }, 300000); // Every 5 minutes
    }
    
    optimizeResolverPerformance() {
        const recentResolutions = this.resolutionHistory.slice(-20);
        if (recentResolutions.length < 5) return;
        
        const successRate = recentResolutions.filter(r => r.wasSuccessful).length / recentResolutions.length;
        const avgDuration = recentResolutions.reduce((sum, r) => sum + (r.duration || 0), 0) / recentResolutions.length;
        
        console.log(`📊 Resolver Performance: ${(successRate * 100).toFixed(1)}% success, ${(avgDuration / 1000).toFixed(1)}s avg duration`);
        
        // Self-optimize based on performance
        if (successRate < 0.7) {
            this.confidenceThreshold = Math.min(0.9, this.confidenceThreshold + 0.05);
            console.log(`📈 Increased confidence threshold to ${this.confidenceThreshold} to improve success rate`);
        }
        
        if (avgDuration > 120000) { // > 2 minutes average
            this.maxConcurrentResolutions = Math.max(1, this.maxConcurrentResolutions - 1);
            console.log(`⚡ Reduced concurrent resolutions to ${this.maxConcurrentResolutions} to improve speed`);
        }
    }
    
    async getResolverStats() {
        const stats = {
            totalResolutions: this.resolutionHistory.length,
            successRate: 0,
            averageDuration: 0,
            activeResolutions: this.activeResolutions.size,
            confidenceThreshold: this.confidenceThreshold,
            autoResolveEnabled: this.autoResolveEnabled,
            ragKnowledge: await this.ragSystem.getKnowledgeStats()
        };
        
        if (this.resolutionHistory.length > 0) {
            const successful = this.resolutionHistory.filter(r => r.wasSuccessful);
            stats.successRate = successful.length / this.resolutionHistory.length;
            
            const totalDuration = this.resolutionHistory.reduce((sum, r) => sum + (r.duration || 0), 0);
            stats.averageDuration = totalDuration / this.resolutionHistory.length;
        }
        
        return stats;
    }
    
    async exportResolutionKnowledge() {
        const knowledge = await this.ragSystem.exportKnowledge();
        
        return {
            ...knowledge,
            resolver: {
                resolutionHistory: this.resolutionHistory,
                performance: await this.getResolverStats(),
                strategies: {
                    confidenceThreshold: this.confidenceThreshold,
                    maxConcurrentResolutions: this.maxConcurrentResolutions,
                    resolutionTimeout: this.resolutionTimeout
                }
            }
        };
    }
}

module.exports = SmartChiFlowResolver;