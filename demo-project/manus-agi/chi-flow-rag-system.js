const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

/**
 * OriMind Chi Flow RAG (Retrieval-Augmented Generation) System
 * 
 * This system captures, stores, and learns from every chi flow resistance pattern,
 * building institutional knowledge for intelligent automated problem resolution.
 * 
 * Chi Flow RAG Principles:
 * - Every issue becomes wisdom
 * - Pattern recognition flows like water finding paths
 * - Solutions crystallize from experience
 * - Knowledge flows to where it's needed most
 * - Continuous learning without blocking operations
 */

class ChiFlowRAGSystem extends EventEmitter {
    constructor(knowledgeBasePath = './chi-flow-knowledge') {
        super();
        this.knowledgeBasePath = knowledgeBasePath;
        this.knowledgeBase = {
            issues: new Map(),
            solutions: new Map(),
            patterns: new Map(),
            flowStates: new Map(),
            healingMethods: new Map()
        };
        this.vectorStore = new Map(); // Simple vector storage for pattern matching
        this.learningQueue = [];
        this.isLearning = false;
        
        this.initializeKnowledgeBase();
        this.startContinuousLearning();
    }
    
    async initializeKnowledgeBase() {
        try {
            await fs.mkdir(this.knowledgeBasePath, { recursive: true });
            await this.loadExistingKnowledge();
            console.log('🧠 Chi Flow RAG System: Knowledge base initialized');
        } catch (error) {
            console.log('🌊 Chi Flow RAG: Creating new knowledge base from pure energy');
            await this.createInitialKnowledge();
        }
    }
    
    async loadExistingKnowledge() {
        const knowledgeFiles = [
            'issues.json',
            'solutions.json', 
            'patterns.json',
            'flow-states.json',
            'healing-methods.json'
        ];
        
        for (const file of knowledgeFiles) {
            try {
                const filePath = path.join(this.knowledgeBasePath, file);
                const data = await fs.readFile(filePath, 'utf8');
                const knowledge = JSON.parse(data);
                
                const category = file.replace('.json', '').replace('-', '');
                this.knowledgeBase[category] = new Map(Object.entries(knowledge));
                
                console.log(`📚 Loaded ${Object.keys(knowledge).length} ${category} patterns`);
            } catch (error) {
                console.log(`🌱 ${file}: Starting fresh knowledge stream`);
            }
        }
    }
    
    async createInitialKnowledge() {
        // Seed the knowledge base with fundamental chi flow patterns
        const initialKnowledge = {
            issues: {
                'port_binding_failure': {
                    pattern: 'EADDRINUSE|port.*already.*in.*use|bind.*failed',
                    severity: 'high',
                    category: 'infrastructure',
                    frequency: 0,
                    lastSeen: null,
                    contexts: ['server_startup', 'service_restart']
                },
                'node_module_missing': {
                    pattern: 'Cannot find module|MODULE_NOT_FOUND',
                    severity: 'medium',
                    category: 'dependencies',
                    frequency: 0,
                    lastSeen: null,
                    contexts: ['application_start', 'dependency_resolution']
                },
                'route_pattern_error': {
                    pattern: 'pathToRegexpError|Missing parameter name|Unexpected.*in.*expression',
                    severity: 'medium',
                    category: 'routing',
                    frequency: 0,
                    lastSeen: null,
                    contexts: ['express_routing', 'api_definition']
                },
                'memory_exhaustion': {
                    pattern: 'out of memory|heap.*exceeded|maximum.*call.*stack',
                    severity: 'critical',
                    category: 'resources',
                    frequency: 0,
                    lastSeen: null,
                    contexts: ['heavy_processing', 'memory_leak']
                },
                'connection_timeout': {
                    pattern: 'timeout|connection.*refused|ECONNREFUSED',
                    severity: 'medium',
                    category: 'networking',
                    frequency: 0,
                    lastSeen: null,
                    contexts: ['service_communication', 'external_apis']
                }
            },
            solutions: {
                'port_binding_failure': {
                    primarySolution: 'kill_existing_process',
                    alternatives: ['use_alternative_port', 'graceful_shutdown_existing'],
                    commands: [
                        'netstat -ano | findstr :${port}',
                        'taskkill /F /PID ${pid}',
                        'Start-Sleep 2'
                    ],
                    effectiveness: 0.95,
                    applicableContexts: ['windows', 'node_server'],
                    chiFlowPrinciple: 'energy_redirection'
                },
                'node_module_missing': {
                    primarySolution: 'install_dependencies',
                    alternatives: ['clear_cache_reinstall', 'update_package_json'],
                    commands: [
                        'npm install',
                        'npm ci',
                        'npm cache clean --force && npm install'
                    ],
                    effectiveness: 0.90,
                    applicableContexts: ['node_js', 'javascript'],
                    chiFlowPrinciple: 'dependency_flow_restoration'
                },
                'route_pattern_error': {
                    primarySolution: 'simplify_route_pattern',
                    alternatives: ['use_query_params', 'middleware_parsing'],
                    commands: [
                        'Replace complex route patterns with simple ones',
                        'Use req.query for file paths',
                        'Implement custom middleware for path parsing'
                    ],
                    effectiveness: 0.88,
                    applicableContexts: ['express_js', 'api_routing'],
                    chiFlowPrinciple: 'path_simplification'
                },
                'memory_exhaustion': {
                    primarySolution: 'increase_memory_limit',
                    alternatives: ['optimize_code', 'implement_streaming'],
                    commands: [
                        'node --max-old-space-size=4096 app.js',
                        'Implement streaming for large data',
                        'Add garbage collection triggers'
                    ],
                    effectiveness: 0.85,
                    applicableContexts: ['node_js', 'heavy_processing'],
                    chiFlowPrinciple: 'energy_optimization'
                },
                'connection_timeout': {
                    primarySolution: 'retry_with_backoff',
                    alternatives: ['health_check_first', 'fallback_endpoint'],
                    commands: [
                        'Implement exponential backoff',
                        'Add connection health checks',
                        'Use circuit breaker pattern'
                    ],
                    effectiveness: 0.92,
                    applicableContexts: ['networking', 'microservices'],
                    chiFlowPrinciple: 'connection_flow_healing'
                }
            },
            patterns: {
                'startup_sequence_failure': {
                    indicators: ['multiple_services_failing', 'dependency_cascade'],
                    commonCauses: ['port_conflicts', 'missing_dependencies', 'environment_mismatch'],
                    resolutionFlow: ['stop_all_services', 'clean_environment', 'sequential_restart'],
                    prevention: ['health_checks', 'dependency_validation', 'graceful_shutdown']
                },
                'service_communication_breakdown': {
                    indicators: ['connection_refused', 'timeout_errors', 'response_missing'],
                    commonCauses: ['network_issues', 'service_overload', 'configuration_drift'],
                    resolutionFlow: ['verify_endpoints', 'test_connectivity', 'restart_affected_services'],
                    prevention: ['monitoring', 'circuit_breakers', 'load_balancing']
                },
                'chi_flow_resistance': {
                    indicators: ['blocking_operations', 'slow_responses', 'resource_exhaustion'],
                    commonCauses: ['synchronous_patterns', 'resource_leaks', 'inefficient_algorithms'],
                    resolutionFlow: ['identify_blocking_code', 'implement_async_patterns', 'optimize_resources'],
                    prevention: ['async_by_default', 'streaming_operations', 'resource_monitoring']
                }
            }
        };
        
        // Save initial knowledge
        for (const [category, data] of Object.entries(initialKnowledge)) {
            this.knowledgeBase[category] = new Map(Object.entries(data));
            await this.saveKnowledgeCategory(category);
        }
        
        console.log('🌱 Chi Flow RAG: Initial knowledge patterns established');
    }
    
    async documentIssue(issueData) {
        const {
            error,
            context,
            stackTrace,
            environment,
            timestamp = new Date().toISOString(),
            severity = 'medium'
        } = issueData;
        
        // Generate issue fingerprint for pattern matching
        const fingerprint = this.generateIssueFingerprint(error, context);
        
        const issue = {
            fingerprint,
            error: error.toString(),
            context,
            stackTrace,
            environment,
            timestamp,
            severity,
            pattern: this.extractErrorPattern(error),
            category: this.categorizeIssue(error, context),
            resolution: null,
            learned: false
        };
        
        this.knowledgeBase.issues.set(fingerprint, issue);
        this.learningQueue.push({ type: 'issue', data: issue });
        
        console.log(`📝 Documented chi flow resistance: ${fingerprint}`);
        this.emit('issue_documented', issue);
        
        return fingerprint;
    }
    
    async documentSolution(solutionData) {
        const {
            issueFingerprint,
            solution,
            commands,
            effectiveness = 1.0,
            timeToResolve,
            context,
            timestamp = new Date().toISOString()
        } = solutionData;
        
        const solutionRecord = {
            issueFingerprint,
            solution,
            commands: Array.isArray(commands) ? commands : [commands],
            effectiveness,
            timeToResolve,
            context,
            timestamp,
            usageCount: 1,
            successRate: effectiveness
        };
        
        const solutionId = `${issueFingerprint}_${Date.now()}`;
        this.knowledgeBase.solutions.set(solutionId, solutionRecord);
        
        // Link solution to issue
        if (this.knowledgeBase.issues.has(issueFingerprint)) {
            const issue = this.knowledgeBase.issues.get(issueFingerprint);
            issue.resolution = solutionId;
            issue.learned = true;
        }
        
        this.learningQueue.push({ type: 'solution', data: solutionRecord });
        
        console.log(`✨ Chi flow healing documented: ${solutionId}`);
        this.emit('solution_documented', solutionRecord);
        
        return solutionId;
    }
    
    async findSimilarIssues(error, context) {
        const queryPattern = this.extractErrorPattern(error);
        const similarIssues = [];
        
        for (const [fingerprint, issue] of this.knowledgeBase.issues) {
            const similarity = this.calculateSimilarity(queryPattern, issue.pattern, context, issue.context);
            
            if (similarity > 0.7) { // 70% similarity threshold
                similarIssues.push({
                    ...issue,
                    similarity,
                    hasResolution: issue.resolution !== null
                });
            }
        }
        
        // Sort by similarity and recency
        return similarIssues.sort((a, b) => {
            const scoreA = a.similarity + (a.hasResolution ? 0.2 : 0) + this.getRecencyScore(a.timestamp);
            const scoreB = b.similarity + (b.hasResolution ? 0.2 : 0) + this.getRecencyScore(b.timestamp);
            return scoreB - scoreA;
        });
    }
    
    async getSuggestedSolutions(issueFingerprint) {
        const issue = this.knowledgeBase.issues.get(issueFingerprint);
        if (!issue) return [];
        
        // Find solutions for this specific issue
        const directSolutions = Array.from(this.knowledgeBase.solutions.values())
            .filter(sol => sol.issueFingerprint === issueFingerprint);
        
        // Find solutions for similar issues
        const similarIssues = await this.findSimilarIssues(issue.error, issue.context);
        const similarSolutions = [];
        
        for (const similarIssue of similarIssues.slice(0, 3)) { // Top 3 similar
            const solutions = Array.from(this.knowledgeBase.solutions.values())
                .filter(sol => sol.issueFingerprint === similarIssue.fingerprint);
            similarSolutions.push(...solutions);
        }
        
        // Combine and rank solutions
        const allSolutions = [...directSolutions, ...similarSolutions];
        return allSolutions.sort((a, b) => {
            const scoreA = a.effectiveness * a.successRate + (a.usageCount * 0.1);
            const scoreB = b.effectiveness * b.successRate + (b.usageCount * 0.1);
            return scoreB - scoreA;
        });
    }
    
    async learnFromResolution(issueFingerprint, solutionId, wasSuccessful, actualTimeToResolve) {
        const solution = this.knowledgeBase.solutions.get(solutionId);
        if (!solution) return;
        
        // Update solution effectiveness
        solution.usageCount += 1;
        const successCount = Math.round(solution.successRate * (solution.usageCount - 1)) + (wasSuccessful ? 1 : 0);
        solution.successRate = successCount / solution.usageCount;
        
        if (wasSuccessful) {
            solution.effectiveness = Math.min(1.0, solution.effectiveness + 0.05);
        } else {
            solution.effectiveness = Math.max(0.1, solution.effectiveness - 0.1);
        }
        
        // Learn timing patterns
        if (actualTimeToResolve) {
            solution.averageTimeToResolve = solution.averageTimeToResolve 
                ? (solution.averageTimeToResolve + actualTimeToResolve) / 2
                : actualTimeToResolve;
        }
        
        this.learningQueue.push({ 
            type: 'feedback', 
            data: { solutionId, wasSuccessful, actualTimeToResolve } 
        });
        
        console.log(`🧠 Chi flow wisdom updated: ${solutionId} (success: ${wasSuccessful})`);
        this.emit('wisdom_gained', { solutionId, wasSuccessful });
    }
    
    async identifyFlowPattern(services, metrics) {
        const patternSignature = this.generatePatternSignature(services, metrics);
        
        // Check for known patterns
        for (const [patternId, pattern] of this.knowledgeBase.patterns) {
            if (this.matchesPattern(patternSignature, pattern)) {
                console.log(`🔮 Recognized chi flow pattern: ${patternId}`);
                return pattern;
            }
        }
        
        // Learn new pattern if services are consistently failing
        if (this.isNewPattern(patternSignature)) {
            const newPattern = await this.createNewPattern(patternSignature, services, metrics);
            console.log(`🌟 New chi flow pattern learned: ${newPattern.id}`);
            return newPattern;
        }
        
        return null;
    }
    
    async getHealingGuidance(error, context) {
        // Document the issue immediately
        const issueFingerprint = await this.documentIssue({ error, context });
        
        // Find similar issues and solutions
        const similarIssues = await this.findSimilarIssues(error, context);
        const suggestedSolutions = await this.getSuggestedSolutions(issueFingerprint);
        
        const guidance = {
            issueFingerprint,
            immediateActions: [],
            longTermActions: [],
            preventionMeasures: [],
            confidence: 0,
            expectedTimeToResolve: null
        };
        
        if (suggestedSolutions.length > 0) {
            const bestSolution = suggestedSolutions[0];
            guidance.immediateActions = bestSolution.commands;
            guidance.confidence = bestSolution.effectiveness * bestSolution.successRate;
            guidance.expectedTimeToResolve = bestSolution.averageTimeToResolve || '5-10 minutes';
        }
        
        // Add pattern-based guidance
        const pattern = await this.identifyFlowPattern([context], { error: error.toString() });
        if (pattern) {
            guidance.longTermActions = pattern.prevention || [];
        }
        
        console.log(`🎯 Chi flow healing guidance generated (confidence: ${(guidance.confidence * 100).toFixed(1)}%)`);
        return guidance;
    }
    
    generateIssueFingerprint(error, context) {
        const errorText = error.toString().toLowerCase();
        const contextText = JSON.stringify(context).toLowerCase();
        
        // Simple hash for fingerprinting
        let hash = 0;
        const text = errorText + contextText;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return `issue_${Math.abs(hash).toString(36)}`;
    }
    
    extractErrorPattern(error) {
        const errorText = error.toString();
        
        // Extract key patterns from error messages
        const patterns = [
            /EADDRINUSE.*:(\d+)/i,
            /Cannot find module '([^']+)'/i,
            /(\w+Error): (.+)/i,
            /at (.+):(\d+):(\d+)/i,
            /(timeout|refused|failed)/i
        ];
        
        for (const pattern of patterns) {
            const match = errorText.match(pattern);
            if (match) {
                return match[0];
            }
        }
        
        // Fallback to first 100 characters
        return errorText.substring(0, 100);
    }
    
    categorizeIssue(error, context) {
        const errorText = error.toString().toLowerCase();
        
        if (errorText.includes('port') || errorText.includes('eaddrinuse')) return 'infrastructure';
        if (errorText.includes('module') || errorText.includes('require')) return 'dependencies';
        if (errorText.includes('route') || errorText.includes('express')) return 'routing';
        if (errorText.includes('memory') || errorText.includes('heap')) return 'resources';
        if (errorText.includes('timeout') || errorText.includes('connection')) return 'networking';
        if (errorText.includes('permission') || errorText.includes('access')) return 'security';
        
        return 'general';
    }
    
    calculateSimilarity(pattern1, pattern2, context1, context2) {
        // Simple similarity calculation
        const patternSim = this.stringSimilarity(pattern1, pattern2);
        const contextSim = this.objectSimilarity(context1, context2);
        
        return (patternSim * 0.7) + (contextSim * 0.3);
    }
    
    stringSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }
    
    objectSimilarity(obj1, obj2) {
        if (!obj1 || !obj2) return 0;
        
        const str1 = JSON.stringify(obj1).toLowerCase();
        const str2 = JSON.stringify(obj2).toLowerCase();
        
        return this.stringSimilarity(str1, str2);
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    getRecencyScore(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const daysDiff = (now - time) / (1000 * 60 * 60 * 24);
        
        // More recent issues get higher scores
        return Math.max(0, 1 - (daysDiff / 30)); // Decay over 30 days
    }
    
    generatePatternSignature(services, metrics) {
        const signature = {
            failingServices: services.filter(s => s.status === 'failed').map(s => s.name),
            errorTypes: Object.keys(metrics).filter(k => k.includes('error')),
            timestamp: new Date().toISOString(),
            environmentFactors: {
                time: new Date().getHours(),
                dayOfWeek: new Date().getDay()
            }
        };
        
        return signature;
    }
    
    matchesPattern(signature, pattern) {
        // Simple pattern matching - could be enhanced with ML
        if (!pattern.indicators) return false;
        
        const matches = pattern.indicators.filter(indicator => {
            return signature.failingServices.some(service => 
                service.toLowerCase().includes(indicator.toLowerCase())
            ) || signature.errorTypes.some(error => 
                error.toLowerCase().includes(indicator.toLowerCase())
            );
        });
        
        return matches.length >= Math.ceil(pattern.indicators.length * 0.6); // 60% match
    }
    
    isNewPattern(signature) {
        // Check if this signature represents a new pattern
        return signature.failingServices.length >= 2 || signature.errorTypes.length >= 2;
    }
    
    async createNewPattern(signature, services, metrics) {
        const patternId = `pattern_${Date.now()}`;
        const pattern = {
            id: patternId,
            indicators: [...signature.failingServices, ...signature.errorTypes],
            commonCauses: ['unknown_cause'],
            resolutionFlow: ['investigate_root_cause', 'restart_affected_services'],
            prevention: ['enhanced_monitoring'],
            confidence: 0.5,
            occurrences: 1,
            lastSeen: signature.timestamp
        };
        
        this.knowledgeBase.patterns.set(patternId, pattern);
        this.learningQueue.push({ type: 'pattern', data: pattern });
        
        return pattern;
    }
    
    startContinuousLearning() {
        // Process learning queue continuously without blocking
        setInterval(async () => {
            if (this.learningQueue.length > 0 && !this.isLearning) {
                this.isLearning = true;
                await this.processLearningQueue();
                this.isLearning = false;
            }
        }, 5000); // Process every 5 seconds
        
        // Periodic knowledge base persistence
        setInterval(async () => {
            await this.persistKnowledge();
        }, 60000); // Save every minute
        
        // Weekly pattern analysis
        setInterval(async () => {
            await this.analyzePatterns();
        }, 7 * 24 * 60 * 60 * 1000); // Weekly
    }
    
    async processLearningQueue() {
        const batchSize = 10;
        const batch = this.learningQueue.splice(0, batchSize);
        
        for (const item of batch) {
            try {
                await this.processLearningItem(item);
            } catch (error) {
                console.log(`🌊 Learning flow encountered resistance: ${error.message}`);
            }
        }
        
        if (batch.length > 0) {
            console.log(`🧠 Processed ${batch.length} learning items - wisdom flows continuously`);
        }
    }
    
    async processLearningItem(item) {
        switch (item.type) {
            case 'issue':
                await this.enhanceIssueKnowledge(item.data);
                break;
            case 'solution':
                await this.enhanceSolutionKnowledge(item.data);
                break;
            case 'pattern':
                await this.enhancePatternKnowledge(item.data);
                break;
            case 'feedback':
                await this.incorporateFeedback(item.data);
                break;
        }
    }
    
    async enhanceIssueKnowledge(issue) {
        // Extract additional patterns and metadata
        const enhanced = {
            ...issue,
            keywords: this.extractKeywords(issue.error + ' ' + JSON.stringify(issue.context)),
            relatedIssues: await this.findRelatedIssues(issue),
            severity: this.calculateSeverity(issue),
            impact: this.assessImpact(issue)
        };
        
        this.knowledgeBase.issues.set(issue.fingerprint, enhanced);
    }
    
    async enhanceSolutionKnowledge(solution) {
        // Analyze solution effectiveness patterns
        const enhanced = {
            ...solution,
            applicabilityScore: this.calculateApplicability(solution),
            complexityLevel: this.assessComplexity(solution.commands),
            riskLevel: this.assessRisk(solution.commands)
        };
        
        this.knowledgeBase.solutions.set(solution.issueFingerprint + '_' + Date.now(), enhanced);
    }
    
    async enhancePatternKnowledge(pattern) {
        // Improve pattern recognition
        pattern.confidence = Math.min(1.0, pattern.confidence + 0.1);
        pattern.occurrences = (pattern.occurrences || 0) + 1;
        
        this.knowledgeBase.patterns.set(pattern.id, pattern);
    }
    
    async incorporateFeedback(feedback) {
        // Update knowledge based on real-world feedback
        const solution = Array.from(this.knowledgeBase.solutions.values())
            .find(s => s.issueFingerprint + '_' + s.timestamp === feedback.solutionId);
        
        if (solution) {
            solution.realWorldEffectiveness = feedback.wasSuccessful ? 
                Math.min(1.0, (solution.realWorldEffectiveness || 0.5) + 0.1) :
                Math.max(0.1, (solution.realWorldEffectiveness || 0.5) - 0.1);
        }
    }
    
    extractKeywords(text) {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were'].includes(word));
        
        const frequency = {};
        words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
        
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }
    
    async findRelatedIssues(issue) {
        const related = [];
        for (const [fingerprint, otherIssue] of this.knowledgeBase.issues) {
            if (fingerprint !== issue.fingerprint) {
                const similarity = this.calculateSimilarity(
                    issue.pattern, otherIssue.pattern,
                    issue.context, otherIssue.context
                );
                if (similarity > 0.5) {
                    related.push({ fingerprint, similarity });
                }
            }
        }
        return related.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    }
    
    calculateSeverity(issue) {
        const errorText = issue.error.toLowerCase();
        
        if (errorText.includes('critical') || errorText.includes('fatal') || errorText.includes('crash')) {
            return 'critical';
        }
        if (errorText.includes('error') || errorText.includes('fail')) {
            return 'high';
        }
        if (errorText.includes('warn') || errorText.includes('timeout')) {
            return 'medium';
        }
        return 'low';
    }
    
    assessImpact(issue) {
        const impacts = [];
        
        if (issue.context.service) impacts.push(`service_${issue.context.service}`);
        if (issue.context.port) impacts.push('service_availability');
        if (issue.error.includes('memory')) impacts.push('system_resources');
        if (issue.error.includes('network')) impacts.push('connectivity');
        
        return impacts;
    }
    
    calculateApplicability(solution) {
        let score = 0.5; // Base score
        
        if (solution.usageCount > 5) score += 0.2;
        if (solution.successRate > 0.8) score += 0.2;
        if (solution.commands.length <= 3) score += 0.1; // Simpler is better
        
        return Math.min(1.0, score);
    }
    
    assessComplexity(commands) {
        const totalLength = commands.join(' ').length;
        const commandCount = commands.length;
        
        if (commandCount <= 2 && totalLength <= 100) return 'low';
        if (commandCount <= 5 && totalLength <= 300) return 'medium';
        return 'high';
    }
    
    assessRisk(commands) {
        const riskyKeywords = ['kill', 'delete', 'remove', 'force', 'format', 'drop'];
        const commandText = commands.join(' ').toLowerCase();
        
        const riskyMatches = riskyKeywords.filter(keyword => commandText.includes(keyword));
        
        if (riskyMatches.length === 0) return 'low';
        if (riskyMatches.length <= 2) return 'medium';
        return 'high';
    }
    
    async persistKnowledge() {
        for (const [category, knowledgeMap] of Object.entries(this.knowledgeBase)) {
            if (knowledgeMap instanceof Map && knowledgeMap.size > 0) {
                await this.saveKnowledgeCategory(category);
            }
        }
    }
    
    async saveKnowledgeCategory(category) {
        try {
            const filePath = path.join(this.knowledgeBasePath, `${category}.json`);
            const data = Object.fromEntries(this.knowledgeBase[category]);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.log(`🌊 Knowledge persistence encountered resistance for ${category}: ${error.message}`);
        }
    }
    
    async analyzePatterns() {
        console.log('🔮 Weekly chi flow pattern analysis beginning...');
        
        // Analyze issue frequency patterns
        const issueFrequency = {};
        for (const issue of this.knowledgeBase.issues.values()) {
            issueFrequency[issue.category] = (issueFrequency[issue.category] || 0) + 1;
        }
        
        // Analyze solution effectiveness trends
        const solutionEffectiveness = {};
        for (const solution of this.knowledgeBase.solutions.values()) {
            const category = solution.context?.category || 'general';
            if (!solutionEffectiveness[category]) {
                solutionEffectiveness[category] = { total: 0, success: 0 };
            }
            solutionEffectiveness[category].total += 1;
            solutionEffectiveness[category].success += solution.successRate;
        }
        
        // Generate insights
        const insights = {
            mostCommonIssues: Object.entries(issueFrequency)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            bestPerformingSolutions: Object.entries(solutionEffectiveness)
                .map(([cat, data]) => [cat, data.success / data.total])
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3),
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Chi Flow Pattern Analysis Complete:', insights);
        this.emit('pattern_analysis_complete', insights);
        
        return insights;
    }
    
    async exportKnowledge() {
        const export_data = {
            metadata: {
                exported: new Date().toISOString(),
                version: '1.0',
                totalIssues: this.knowledgeBase.issues.size,
                totalSolutions: this.knowledgeBase.solutions.size,
                totalPatterns: this.knowledgeBase.patterns.size
            },
            knowledge: {}
        };
        
        for (const [category, knowledgeMap] of Object.entries(this.knowledgeBase)) {
            export_data.knowledge[category] = Object.fromEntries(knowledgeMap);
        }
        
        return export_data;
    }
    
    async getKnowledgeStats() {
        const stats = {
            totalKnowledge: {
                issues: this.knowledgeBase.issues.size,
                solutions: this.knowledgeBase.solutions.size,
                patterns: this.knowledgeBase.patterns.size
            },
            recentActivity: {
                issuesLastWeek: 0,
                solutionsLastWeek: 0,
                patternsLastWeek: 0
            },
            effectiveness: {
                averageSolutionSuccess: 0,
                bestSolution: null,
                worstSolution: null
            },
            learningQueue: this.learningQueue.length,
            isActiveLearning: this.isLearning
        };
        
        // Calculate recent activity
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        for (const issue of this.knowledgeBase.issues.values()) {
            if (new Date(issue.timestamp) > weekAgo) {
                stats.recentActivity.issuesLastWeek++;
            }
        }
        
        // Calculate solution effectiveness
        let totalEffectiveness = 0;
        let bestSolution = null;
        let worstSolution = null;
        
        for (const solution of this.knowledgeBase.solutions.values()) {
            const effectiveness = solution.successRate || 0;
            totalEffectiveness += effectiveness;
            
            if (!bestSolution || effectiveness > bestSolution.effectiveness) {
                bestSolution = { id: solution.issueFingerprint, effectiveness };
            }
            if (!worstSolution || effectiveness < worstSolution.effectiveness) {
                worstSolution = { id: solution.issueFingerprint, effectiveness };
            }
        }
        
        stats.effectiveness.averageSolutionSuccess = 
            this.knowledgeBase.solutions.size > 0 ? 
            totalEffectiveness / this.knowledgeBase.solutions.size : 0;
        stats.effectiveness.bestSolution = bestSolution;
        stats.effectiveness.worstSolution = worstSolution;
        
        return stats;
    }
}

module.exports = ChiFlowRAGSystem;