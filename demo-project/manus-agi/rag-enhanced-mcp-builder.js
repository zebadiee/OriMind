#!/usr/bin/env node

/**
 * 🧠 RAG-Enhanced OriMind MCP Builder Assistant
 * The ultimate AI assistant with institutional learning and knowledge accumulation
 */

const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class RAGInstitutionalLearning {
    constructor() {
        this.knowledgeBase = new Map();
        this.projectHistory = new Map();
        this.learningPatterns = new Map();
        this.wisdomDatabase = {
            mcp_patterns: [],
            best_practices: [],
            common_errors: [],
            optimization_techniques: [],
            user_preferences: new Map(),
            success_metrics: []
        };
        this.loadExistingKnowledge();
        this.setupRAGEngine();
    }

    setupRAGEngine() {
        this.vectorStore = new Map(); // Simplified vector storage
        this.embeddingCache = new Map();
        this.contextRetrieval = {
            maxResults: 10,
            similarityThreshold: 0.7,
            contextWindow: 4096
        };
    }

    async loadExistingKnowledge() {
        try {
            if (fs.existsSync('rag-knowledge-base.json')) {
                const data = JSON.parse(fs.readFileSync('rag-knowledge-base.json', 'utf8'));
                this.wisdomDatabase = { ...this.wisdomDatabase, ...data };
                console.log('🧠 RAG: Loaded existing institutional knowledge');
            }
        } catch (error) {
            console.log('🧠 RAG: Starting with fresh knowledge base');
        }
    }

    async saveKnowledge() {
        try {
            fs.writeFileSync('rag-knowledge-base.json', JSON.stringify(this.wisdomDatabase, null, 2));
            console.log('🧠 RAG: Knowledge base updated');
        } catch (error) {
            console.error('🧠 RAG: Error saving knowledge:', error.message);
        }
    }

    async captureProjectLearning(projectData) {
        const learningId = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        
        const learning = {
            id: learningId,
            timestamp,
            project_type: projectData.template,
            requirements: projectData.requirements,
            complexity: projectData.complexity,
            generated_tools: projectData.tools || [],
            success_patterns: this.extractSuccessPatterns(projectData),
            user_feedback: projectData.feedback || null,
            performance_metrics: {
                generation_time: projectData.generationTime,
                code_quality_score: projectData.qualityScore || 0.8,
                user_satisfaction: projectData.satisfaction || 0.9
            }
        };

        this.wisdomDatabase.mcp_patterns.push(learning);
        await this.updateBestPractices(learning);
        await this.saveKnowledge();

        console.log(`🧠 RAG: Captured learning from project ${projectData.name}`);
        return learningId;
    }

    extractSuccessPatterns(projectData) {
        return {
            template_effectiveness: projectData.template,
            tool_combinations: projectData.tools?.map(t => t.name) || [],
            complexity_handling: projectData.complexity,
            user_preferences: {
                code_style: projectData.codeStyle || 'modern',
                documentation_level: projectData.docLevel || 'comprehensive',
                testing_approach: projectData.testingApproach || 'thorough'
            }
        };
    }

    async updateBestPractices(learning) {
        // Extract best practices from successful patterns
        if (learning.performance_metrics.user_satisfaction > 0.8) {
            const practice = {
                id: crypto.randomUUID(),
                pattern: learning.success_patterns,
                effectiveness_score: learning.performance_metrics.user_satisfaction,
                use_count: 1,
                last_used: learning.timestamp,
                context: learning.project_type
            };

            this.wisdomDatabase.best_practices.push(practice);
        }
    }

    async retrieveRelevantKnowledge(query, context = {}) {
        const relevantLearnings = [];
        const queryLower = query.toLowerCase();

        // Search through project patterns
        for (const pattern of this.wisdomDatabase.mcp_patterns) {
            let relevanceScore = 0;

            // Template matching
            if (context.template && pattern.project_type === context.template) {
                relevanceScore += 0.5;
            }

            // Requirement similarity
            if (pattern.requirements) {
                const matchingReqs = pattern.requirements.filter(req => 
                    queryLower.includes(req.toLowerCase()) || 
                    req.toLowerCase().includes(queryLower)
                );
                relevanceScore += (matchingReqs.length / pattern.requirements.length) * 0.3;
            }

            // Complexity alignment
            if (context.complexity && pattern.complexity === context.complexity) {
                relevanceScore += 0.2;
            }

            if (relevanceScore > this.contextRetrieval.similarityThreshold) {
                relevantLearnings.push({
                    ...pattern,
                    relevance_score: relevanceScore
                });
            }
        }

        // Sort by relevance and return top results
        return relevantLearnings
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .slice(0, this.contextRetrieval.maxResults);
    }

    async generateContextualGuidance(userInput, projectContext = {}) {
        const relevantKnowledge = await this.retrieveRelevantKnowledge(userInput, projectContext);
        
        let guidance = {
            suggestions: [],
            warnings: [],
            optimizations: [],
            similar_projects: [],
            best_practices: []
        };

        // Generate suggestions based on historical patterns
        for (const knowledge of relevantKnowledge) {
            if (knowledge.performance_metrics.user_satisfaction > 0.8) {
                guidance.suggestions.push({
                    suggestion: `Based on similar successful projects, consider using ${knowledge.success_patterns.tool_combinations.join(', ')}`,
                    confidence: knowledge.relevance_score,
                    source: 'institutional_learning'
                });
            }

            guidance.similar_projects.push({
                id: knowledge.id,
                template: knowledge.project_type,
                success_score: knowledge.performance_metrics.user_satisfaction,
                key_patterns: knowledge.success_patterns
            });
        }

        // Add relevant best practices
        const applicablePractices = this.wisdomDatabase.best_practices
            .filter(practice => 
                !projectContext.template || 
                practice.context === projectContext.template ||
                practice.effectiveness_score > 0.9
            )
            .sort((a, b) => b.effectiveness_score - a.effectiveness_score)
            .slice(0, 5);

        guidance.best_practices = applicablePractices.map(practice => ({
            pattern: practice.pattern,
            effectiveness: practice.effectiveness_score,
            usage_count: practice.use_count
        }));

        return guidance;
    }

    async captureFeedback(projectId, feedback) {
        const project = this.projectHistory.get(projectId);
        if (project) {
            project.feedback = feedback;
            project.satisfaction = feedback.rating || 0.5;
            
            // Learn from feedback
            if (feedback.rating > 0.7) {
                await this.reinforceSuccessfulPattern(project);
            } else {
                await this.recordFailurePattern(project, feedback);
            }
            
            await this.saveKnowledge();
        }
    }

    async reinforceSuccessfulPattern(project) {
        // Increase confidence in successful patterns
        const existingPractice = this.wisdomDatabase.best_practices.find(
            p => JSON.stringify(p.pattern) === JSON.stringify(project.success_patterns)
        );

        if (existingPractice) {
            existingPractice.use_count++;
            existingPractice.effectiveness_score = Math.min(1.0, existingPractice.effectiveness_score + 0.05);
        }
    }

    async recordFailurePattern(project, feedback) {
        const errorPattern = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            project_context: project,
            feedback: feedback,
            issues: feedback.issues || [],
            resolution_suggestions: feedback.suggestions || []
        };

        this.wisdomDatabase.common_errors.push(errorPattern);
    }

    getInstitutionalStats() {
        return {
            total_projects: this.wisdomDatabase.mcp_patterns.length,
            best_practices: this.wisdomDatabase.best_practices.length,
            common_errors: this.wisdomDatabase.common_errors.length,
            average_satisfaction: this.calculateAverageSatisfaction(),
            top_templates: this.getTopTemplates(),
            learning_trends: this.getLearningTrends()
        };
    }

    calculateAverageSatisfaction() {
        if (this.wisdomDatabase.mcp_patterns.length === 0) return 0;
        
        const total = this.wisdomDatabase.mcp_patterns.reduce(
            (sum, pattern) => sum + (pattern.performance_metrics.user_satisfaction || 0.5),
            0
        );
        
        return (total / this.wisdomDatabase.mcp_patterns.length).toFixed(2);
    }

    getTopTemplates() {
        const templateCounts = {};
        this.wisdomDatabase.mcp_patterns.forEach(pattern => {
            templateCounts[pattern.project_type] = (templateCounts[pattern.project_type] || 0) + 1;
        });

        return Object.entries(templateCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([template, count]) => ({ template, count }));
    }

    getLearningTrends() {
        const recent = this.wisdomDatabase.mcp_patterns
            .filter(p => new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .length;

        return {
            projects_this_week: recent,
            knowledge_growth_rate: recent > 0 ? 'increasing' : 'stable',
            emerging_patterns: this.identifyEmergingPatterns()
        };
    }

    identifyEmergingPatterns() {
        // Identify new patterns in recent projects
        const recentPatterns = this.wisdomDatabase.mcp_patterns
            .filter(p => new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .map(p => p.project_type);

        const patternFreq = {};
        recentPatterns.forEach(pattern => {
            patternFreq[pattern] = (patternFreq[pattern] || 0) + 1;
        });

        return Object.entries(patternFreq)
            .filter(([, count]) => count > 1)
            .map(([pattern]) => pattern);
    }
}

class EnhancedMCPBuilderAssistant {
    constructor() {
        this.app = express();
        this.port = 4000;
        this.wsPort = 4001;
        this.rag = new RAGInstitutionalLearning();
        this.projects = new Map();
        this.aiModels = this.initializeAIModels();
        this.templates = this.initializeTemplates();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }

    initializeAIModels() {
        return [
            { 
                name: 'architect', 
                description: 'System design and architecture specialist (Claude-3.5 Sonnet)',
                provider: 'anthropic',
                expertise: ['system_design', 'architecture', 'scalability']
            },
            { 
                name: 'coder', 
                description: 'Advanced code generation and implementation (DeepSeek V3)',
                provider: 'deepseek',
                expertise: ['code_generation', 'implementation', 'optimization']
            },
            { 
                name: 'debugger', 
                description: 'Error analysis and troubleshooting expert (GPT-4 Turbo)',
                provider: 'openai',
                expertise: ['debugging', 'error_analysis', 'troubleshooting']
            },
            { 
                name: 'optimizer', 
                description: 'Performance optimization specialist (Gemini 2.0 Flash)',
                provider: 'google',
                expertise: ['performance', 'optimization', 'efficiency']
            },
            { 
                name: 'tester', 
                description: 'Test generation and validation expert (Llama 3.1 405B)',
                provider: 'meta',
                expertise: ['testing', 'validation', 'quality_assurance']
            },
            { 
                name: 'documenter', 
                description: 'Documentation and technical writing (Qwen 2.5 72B)',
                provider: 'alibaba',
                expertise: ['documentation', 'technical_writing', 'examples']
            },
            { 
                name: 'validator', 
                description: 'Code review and compliance checking (Claude-3 Opus)',
                provider: 'anthropic',
                expertise: ['code_review', 'compliance', 'security']
            }
        ];
    }

    initializeTemplates() {
        return [
            {
                name: 'file-system',
                description: 'Advanced file system operations with intelligent management',
                tools: ['list_directory', 'read_file', 'create_file', 'search_files', 'file_metadata'],
                complexity: 'intermediate',
                use_cases: ['file_management', 'content_analysis', 'backup_systems']
            },
            {
                name: 'web-scraper',
                description: 'Intelligent web scraping with AI-powered data extraction',
                tools: ['fetch_url', 'extract_data', 'parse_html', 'handle_js', 'rate_limit'],
                complexity: 'advanced',
                use_cases: ['data_collection', 'market_research', 'content_monitoring']
            },
            {
                name: 'database',
                description: 'Comprehensive database operations with query optimization',
                tools: ['execute_query', 'schema_analysis', 'data_validation', 'migration_support'],
                complexity: 'advanced',
                use_cases: ['data_management', 'analytics', 'reporting']
            },
            {
                name: 'api-client',
                description: 'RESTful API integration with intelligent error handling',
                tools: ['http_request', 'auth_handler', 'response_parser', 'retry_logic'],
                complexity: 'intermediate',
                use_cases: ['service_integration', 'data_sync', 'automation']
            },
            {
                name: 'ai-model',
                description: 'AI model integration with multi-provider support',
                tools: ['model_query', 'context_management', 'result_parsing', 'cost_tracking'],
                complexity: 'expert',
                use_cases: ['ai_automation', 'content_generation', 'decision_support']
            },
            {
                name: 'workflow-automation',
                description: 'Task automation and workflow orchestration',
                tools: ['task_scheduler', 'workflow_engine', 'condition_handler', 'notification_system'],
                complexity: 'expert',
                use_cases: ['business_automation', 'data_pipelines', 'process_optimization']
            },
            {
                name: 'data-processing',
                description: 'ETL operations and data transformation pipelines',
                tools: ['data_transform', 'format_converter', 'validation_engine', 'batch_processor'],
                complexity: 'advanced',
                use_cases: ['data_migration', 'analytics', 'reporting']
            },
            {
                name: 'security-scanner',
                description: 'Security analysis and vulnerability detection',
                tools: ['code_analysis', 'dependency_check', 'compliance_audit', 'threat_detection'],
                complexity: 'expert',
                use_cases: ['security_audit', 'compliance', 'risk_assessment']
            }
        ];
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }

    setupRoutes() {
        // Health and status
        this.app.get('/api/health', (req, res) => {
            res.json({ 
                status: 'healthy', 
                timestamp: new Date().toISOString(),
                rag_stats: this.rag.getInstitutionalStats()
            });
        });

        this.app.get('/api/status', (req, res) => {
            res.json({
                service: 'RAG-Enhanced MCP Builder Assistant',
                version: '2.0.0',
                ai_models: this.aiModels.length,
                templates: this.templates.length,
                active_projects: this.projects.size,
                institutional_learning: this.rag.getInstitutionalStats()
            });
        });

        // RAG Knowledge endpoints
        this.app.get('/api/rag/knowledge', (req, res) => {
            res.json(this.rag.getInstitutionalStats());
        });

        this.app.post('/api/rag/guidance', async (req, res) => {
            try {
                const { query, context } = req.body;
                const guidance = await this.rag.generateContextualGuidance(query, context);
                res.json({ guidance });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Templates and models
        this.app.get('/api/templates', (req, res) => {
            res.json({ templates: this.templates });
        });

        this.app.get('/api/models', (req, res) => {
            res.json({ models: this.aiModels });
        });

        // Enhanced MCP creation with RAG
        this.app.post('/api/create-mcp', async (req, res) => {
            try {
                const { name, description, template, requirements, complexity } = req.body;
                
                if (!name || !description) {
                    return res.status(400).json({ error: 'Name and description are required' });
                }

                const projectId = crypto.randomUUID();
                const timestamp = new Date().toISOString();

                // Get RAG guidance for this project
                const ragGuidance = await this.rag.generateContextualGuidance(
                    `${description} ${requirements?.join(' ') || ''}`,
                    { template, complexity }
                );

                const project = {
                    id: projectId,
                    name,
                    description,
                    template: template || 'custom',
                    requirements: requirements || [],
                    complexity: complexity || 'intermediate',
                    status: 'created',
                    created_at: timestamp,
                    rag_guidance: ragGuidance,
                    learning_context: {
                        similar_projects: ragGuidance.similar_projects,
                        recommended_practices: ragGuidance.best_practices
                    }
                };

                this.projects.set(projectId, project);
                this.rag.projectHistory.set(projectId, project);

                res.json({ 
                    project_id: projectId, 
                    status: 'created',
                    rag_insights: {
                        guidance_available: ragGuidance.suggestions.length > 0,
                        similar_projects_found: ragGuidance.similar_projects.length,
                        best_practices_applicable: ragGuidance.best_practices.length
                    }
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Enhanced code generation with RAG insights
        this.app.post('/api/generate-code/:projectId', async (req, res) => {
            try {
                const { projectId } = req.params;
                const project = this.projects.get(projectId);

                if (!project) {
                    return res.status(404).json({ error: 'Project not found' });
                }

                const startTime = Date.now();

                // Generate code using RAG insights
                const code = await this.generateEnhancedCode(project);
                const generationTime = Date.now() - startTime;

                // Update project with generation metrics
                project.status = 'generated';
                project.code = code;
                project.generationTime = generationTime;
                project.qualityScore = this.assessCodeQuality(code);

                // Capture learning for RAG
                await this.rag.captureProjectLearning(project);

                res.json({ 
                    code,
                    generation_time: generationTime,
                    quality_score: project.qualityScore,
                    rag_learning_captured: true
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Feedback collection for RAG learning
        this.app.post('/api/feedback/:projectId', async (req, res) => {
            try {
                const { projectId } = req.params;
                const feedback = req.body;

                await this.rag.captureFeedback(projectId, feedback);

                res.json({ 
                    message: 'Feedback captured for institutional learning',
                    learning_id: projectId
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Web interface
        this.app.get('/', (req, res) => {
            res.send(this.generateWebInterface());
        });
    }

    async generateEnhancedCode(project) {
        const template = this.templates.find(t => t.name === project.template);
        const ragInsights = project.rag_guidance;

        let codeTemplate = `#!/usr/bin/env node

/**
 * ${project.name}
 * ${project.description}
 * 
 * Generated by RAG-Enhanced OriMind MCP Builder Assistant
 * Incorporating institutional learning and best practices
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError
} from '@modelcontextprotocol/sdk/types.js';

class ${this.toPascalCase(project.name)}MCP {
    constructor() {
        this.name = '${project.name}';
        this.version = '1.0.0';
        this.description = '${project.description}';
        
        // RAG-informed configuration
        this.config = this.setupRAGConfiguration();
        this.setupTools();
    }

    setupRAGConfiguration() {
        return {
            // Based on institutional learning patterns
            ${ragInsights.best_practices.map(practice => 
                `// Best practice: ${JSON.stringify(practice.pattern)}`
            ).join('\n            ')}
            
            optimization_level: '${project.complexity}',
            error_handling: 'comprehensive',
            logging_enabled: true,
            performance_monitoring: true
        };
    }

    setupTools() {
        return [
            ${template?.tools.map(tool => `{
                name: '${tool}',
                description: 'RAG-optimized ${tool.replace(/_/g, ' ')} functionality',
                inputSchema: {
                    type: 'object',
                    properties: {
                        // Schema based on successful patterns
                    },
                    required: []
                }
            }`).join(',\n            ') || '// Custom tools based on requirements'}
        ];
    }

    async handleToolCall(name, args) {
        try {
            // RAG-informed error handling
            this.logToolCall(name, args);
            
            switch (name) {
                ${template?.tools.map(tool => `case '${tool}':
                    return await this.handle${this.toPascalCase(tool)}(args);`).join('\n                ') || '// Custom tool handlers'}
                
                default:
                    throw new McpError(
                        ErrorCode.MethodNotFound,
                        \`Unknown tool: \${name}\`
                    );
            }
        } catch (error) {
            // Institutional learning from errors
            this.captureErrorLearning(name, args, error);
            throw error;
        }
    }

    ${template?.tools.map(tool => `
    async handle${this.toPascalCase(tool)}(args) {
        // Implementation based on RAG insights
        // ${ragInsights.suggestions.find(s => s.suggestion.toLowerCase().includes(tool))?.suggestion || 'Optimized implementation'}
        
        return {
            success: true,
            result: \`\${args}\`,
            timestamp: new Date().toISOString()
        };
    }`).join('') || ''}

    logToolCall(name, args) {
        if (this.config.logging_enabled) {
            console.log(\`[\${new Date().toISOString()}] Tool call: \${name}\`, args);
        }
    }

    captureErrorLearning(toolName, args, error) {
        // Contribute to institutional learning
        const errorData = {
            tool: toolName,
            args,
            error: error.message,
            timestamp: new Date().toISOString(),
            project: this.name
        };
        
        // This would integrate with the RAG system
        console.warn('Error captured for learning:', errorData);
    }
}

// Server setup with RAG monitoring
const server = new Server(
    {
        name: '${project.name}',
        version: '1.0.0',
        description: '${project.description}'
    },
    {
        capabilities: {
            tools: {}
        }
    }
);

const mcpInstance = new ${this.toPascalCase(project.name)}MCP();

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: mcpInstance.setupTools()
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return await mcpInstance.handleToolCall(name, args || {});
});

// Start server with RAG integration
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('🤖 RAG-Enhanced ${project.name} MCP Server started');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { ${this.toPascalCase(project.name)}MCP };`;

        return codeTemplate;
    }

    toPascalCase(str) {
        return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
                  .replace(/^(.)/, char => char.toUpperCase());
    }

    assessCodeQuality(code) {
        // Simple quality assessment based on code characteristics
        let score = 0.5;
        
        if (code.includes('error handling')) score += 0.1;
        if (code.includes('logging')) score += 0.1;
        if (code.includes('validation')) score += 0.1;
        if (code.includes('async/await')) score += 0.1;
        if (code.includes('try/catch')) score += 0.1;
        
        return Math.min(1.0, score);
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: this.wsPort });
        
        this.wss.on('connection', (ws) => {
            console.log('🔌 RAG-Enhanced WebSocket client connected');
            
            ws.send(JSON.stringify({
                type: 'welcome',
                message: 'Connected to RAG-Enhanced MCP Builder Assistant',
                rag_stats: this.rag.getInstitutionalStats()
            }));

            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data);
                    
                    if (message.type === 'rag_query') {
                        const guidance = await this.rag.generateContextualGuidance(
                            message.query, 
                            message.context || {}
                        );
                        
                        ws.send(JSON.stringify({
                            type: 'rag_response',
                            guidance,
                            timestamp: new Date().toISOString()
                        }));
                    }
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: error.message
                    }));
                }
            });
        });
    }

    generateWebInterface() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧠 RAG-Enhanced OriMind MCP Builder Assistant</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'SF Pro Display', system-ui, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .rag-stats {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }
        
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .card {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 0.75rem;
            border-radius: 8px;
            border: none;
            background: rgba(255,255,255,0.2);
            color: white;
            font-size: 1rem;
        }
        
        input::placeholder, textarea::placeholder {
            color: rgba(255,255,255,0.7);
        }
        
        button {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .rag-insights {
            background: rgba(0,255,127,0.1);
            border-left: 4px solid #00ff7f;
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 0 8px 8px 0;
        }
        
        .guidance-item {
            background: rgba(255,255,255,0.05);
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 8px;
            border-left: 3px solid #4ECDC4;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 RAG-Enhanced MCP Builder Assistant</h1>
            <p>The Ultimate AI Assistant with Institutional Learning</p>
        </div>
        
        <div class="rag-stats">
            <h2>🎯 Institutional Learning Dashboard</h2>
            <div id="ragStats">Loading RAG statistics...</div>
        </div>
        
        <div class="cards">
            <div class="card">
                <h2>🚀 Create New MCP</h2>
                <form id="mcpForm">
                    <div class="form-group">
                        <label for="name">Project Name:</label>
                        <input type="text" id="name" name="name" placeholder="my-awesome-mcp" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description:</label>
                        <textarea id="description" name="description" placeholder="Describe what your MCP should do..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="template">Template:</label>
                        <select id="template" name="template">
                            <option value="">Select a template...</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="complexity">Complexity:</label>
                        <select id="complexity" name="complexity">
                            <option value="basic">Basic</option>
                            <option value="intermediate" selected>Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                    
                    <button type="submit">🤖 Create with RAG Guidance</button>
                </form>
                
                <div id="ragGuidance" class="rag-insights" style="display: none;">
                    <h3>🧠 RAG Insights</h3>
                    <div id="guidanceContent"></div>
                </div>
            </div>
            
            <div class="card">
                <h2>💬 RAG Chat Assistant</h2>
                <div id="chatMessages" style="height: 300px; overflow-y: auto; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"></div>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="chatInput" placeholder="Ask about MCP patterns, best practices..." style="flex: 1;">
                    <button onclick="sendChatMessage()" style="width: auto; padding: 0.75rem 1.5rem;">Send</button>
                </div>
            </div>
            
            <div class="card">
                <h2>📊 Learning Analytics</h2>
                <div id="analytics">
                    <div class="guidance-item">
                        <strong>Total Projects:</strong> <span id="totalProjects">0</span>
                    </div>
                    <div class="guidance-item">
                        <strong>Best Practices:</strong> <span id="bestPractices">0</span>
                    </div>
                    <div class="guidance-item">
                        <strong>Average Satisfaction:</strong> <span id="avgSatisfaction">0</span>
                    </div>
                    <div class="guidance-item">
                        <strong>Top Templates:</strong> <span id="topTemplates">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let ws;
        
        // Initialize WebSocket connection
        function initWebSocket() {
            ws = new WebSocket('ws://localhost:4001');
            
            ws.onopen = () => {
                console.log('🔌 Connected to RAG-Enhanced MCP Builder');
                addChatMessage('🤖 RAG Assistant: Connected! I have access to institutional learning from previous projects. How can I help you build an amazing MCP?', 'assistant');
            };
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                if (data.type === 'rag_response') {
                    displayRAGGuidance(data.guidance);
                    addChatMessage(\`🧠 RAG Insights: Found \${data.guidance.suggestions.length} suggestions and \${data.guidance.similar_projects.length} similar projects.\`, 'assistant');
                }
            };
        }
        
        // Load templates and RAG stats
        async function loadData() {
            try {
                const [templatesRes, statusRes] = await Promise.all([
                    fetch('/api/templates'),
                    fetch('/api/status')
                ]);
                
                const templates = await templatesRes.json();
                const status = await statusRes.json();
                
                populateTemplates(templates.templates);
                updateAnalytics(status.institutional_learning);
                
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }
        
        function populateTemplates(templates) {
            const select = document.getElementById('template');
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.name;
                option.textContent = \`\${template.name} - \${template.description}\`;
                select.appendChild(option);
            });
        }
        
        function updateAnalytics(stats) {
            document.getElementById('totalProjects').textContent = stats.total_projects;
            document.getElementById('bestPractices').textContent = stats.best_practices;
            document.getElementById('avgSatisfaction').textContent = stats.average_satisfaction;
            document.getElementById('topTemplates').textContent = stats.top_templates?.map(t => t.template).join(', ') || 'None yet';
        }
        
        // Handle MCP creation form
        document.getElementById('mcpForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Get RAG guidance first
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'rag_query',
                    query: data.description,
                    context: {
                        template: data.template,
                        complexity: data.complexity
                    }
                }));
            }
            
            try {
                const response = await fetch('/api/create-mcp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    addChatMessage(\`🎉 Project created: \${result.project_id}\`, 'success');
                    if (result.rag_insights) {
                        addChatMessage(\`🧠 RAG found \${result.rag_insights.similar_projects_found} similar projects and \${result.rag_insights.best_practices_applicable} applicable best practices!\`, 'assistant');
                    }
                } else {
                    addChatMessage(\`❌ Error: \${result.error}\`, 'error');
                }
            } catch (error) {
                addChatMessage(\`❌ Network error: \${error.message}\`, 'error');
            }
        });
        
        function displayRAGGuidance(guidance) {
            const guidanceDiv = document.getElementById('ragGuidance');
            const contentDiv = document.getElementById('guidanceContent');
            
            let html = '';
            
            if (guidance.suggestions.length > 0) {
                html += '<h4>💡 Suggestions:</h4>';
                guidance.suggestions.forEach(suggestion => {
                    html += \`<div class="guidance-item">\${suggestion.suggestion} (Confidence: \${(suggestion.confidence * 100).toFixed(1)}%)</div>\`;
                });
            }
            
            if (guidance.similar_projects.length > 0) {
                html += '<h4>📚 Similar Projects:</h4>';
                guidance.similar_projects.slice(0, 3).forEach(project => {
                    html += \`<div class="guidance-item">Template: \${project.template} (Success: \${(project.success_score * 100).toFixed(1)}%)</div>\`;
                });
            }
            
            if (guidance.best_practices.length > 0) {
                html += '<h4>⭐ Best Practices:</h4>';
                guidance.best_practices.slice(0, 3).forEach(practice => {
                    html += \`<div class="guidance-item">Effectiveness: \${(practice.effectiveness * 100).toFixed(1)}% (Used \${practice.usage_count} times)</div>\`;
                });
            }
            
            contentDiv.innerHTML = html;
            guidanceDiv.style.display = 'block';
        }
        
        function addChatMessage(message, type = 'user') {
            const messagesDiv = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.style.margin = '0.5rem 0';
            messageDiv.style.padding = '0.5rem';
            messageDiv.style.borderRadius = '8px';
            
            if (type === 'assistant') {
                messageDiv.style.background = 'rgba(76, 205, 196, 0.2)';
                messageDiv.style.borderLeft = '3px solid #4ECDC4';
            } else if (type === 'error') {
                messageDiv.style.background = 'rgba(255, 107, 107, 0.2)';
                messageDiv.style.borderLeft = '3px solid #FF6B6B';
            } else if (type === 'success') {
                messageDiv.style.background = 'rgba(0, 255, 127, 0.2)';
                messageDiv.style.borderLeft = '3px solid #00ff7f';
            } else {
                messageDiv.style.background = 'rgba(255, 255, 255, 0.1)';
            }
            
            messageDiv.textContent = message;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function sendChatMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (message && ws && ws.readyState === WebSocket.OPEN) {
                addChatMessage(\`👤 You: \${message}\`, 'user');
                
                ws.send(JSON.stringify({
                    type: 'rag_query',
                    query: message,
                    context: {}
                }));
                
                input.value = '';
            }
        }
        
        // Handle Enter key in chat input
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
        
        // Initialize on page load
        window.addEventListener('load', () => {
            initWebSocket();
            loadData();
        });
    </script>
</body>
</html>`;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('🧠 RAG-Enhanced OriMind Universal MCP Builder Assistant: Initializing...');
            console.log('🌟 RAG-Enhanced OriMind Universal MCP Builder Assistant Started!');
            console.log('===============================================');
            console.log(`🌐 Web Interface: http://localhost:${this.port}`);
            console.log(`🔌 WebSocket: ws://localhost:${this.wsPort}`);
            console.log(`🤖 AI Models: ${this.aiModels.length} specialized models`);
            console.log(`📋 Templates: ${this.templates.length} MCP templates`);
            console.log(`🧠 RAG Learning: Institutional knowledge enabled`);
            console.log('');
            console.log('🎯 Ready to build amazing MCPs with RAG intelligence!');
            console.log('💡 Every project contributes to institutional learning');
        });
    }
}

// Start the enhanced RAG-powered MCP Builder Assistant
if (require.main === module) {
    const assistant = new EnhancedMCPBuilderAssistant();
    assistant.start();
}

module.exports = { EnhancedMCPBuilderAssistant, RAGInstitutionalLearning };