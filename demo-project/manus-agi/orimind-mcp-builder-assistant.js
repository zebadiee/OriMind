#!/usr/bin/env node

/**
 * 🤖 OriMind Universal MCP Builder Assistant
 * The ultimate AI-powered assistant for building Model Context Protocol servers
 * Leverages the complete OriMind ecosystem for intelligent MCP development
 */

const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

class OriMindMCPBuilderAssistant {
    constructor() {
        this.app = express();
        this.port = 4000;
        this.wsPort = 4001;
        
        // AI Models for different MCP building tasks
        this.aiModels = {
            architect: 'claude-3.5-sonnet',      // System architecture design
            coder: 'deepseek-v3',                // Code implementation
            debugger: 'gpt-4-turbo',             // Error analysis and fixing
            optimizer: 'gemini-2.0-flash',      // Performance optimization
            tester: 'llama-3.1-405b',           // Test generation
            documenter: 'qwen-2.5-72b',         // Documentation creation
            validator: 'claude-3-opus'          // Code validation and review
        };
        
        // MCP Templates and Patterns
        this.mcpTemplates = {
            'file-system': {
                description: 'File system operations MCP',
                tools: ['read_file', 'write_file', 'list_directory', 'delete_file'],
                complexity: 'basic'
            },
            'web-scraper': {
                description: 'Web scraping and data extraction MCP',
                tools: ['fetch_url', 'extract_data', 'parse_html', 'download_resource'],
                complexity: 'intermediate'
            },
            'database': {
                description: 'Database operations MCP',
                tools: ['query_database', 'insert_data', 'update_record', 'delete_record'],
                complexity: 'intermediate'
            },
            'api-client': {
                description: 'REST API client MCP',
                tools: ['api_request', 'authenticate', 'handle_response', 'rate_limit'],
                complexity: 'intermediate'
            },
            'ai-model': {
                description: 'AI model integration MCP',
                tools: ['generate_text', 'analyze_image', 'process_audio', 'embed_text'],
                complexity: 'advanced'
            },
            'workflow-automation': {
                description: 'Workflow and task automation MCP',
                tools: ['create_workflow', 'execute_task', 'schedule_job', 'monitor_status'],
                complexity: 'advanced'
            },
            'data-processing': {
                description: 'Data transformation and processing MCP',
                tools: ['transform_data', 'validate_schema', 'aggregate_data', 'export_results'],
                complexity: 'advanced'
            },
            'security-scanner': {
                description: 'Security analysis and scanning MCP',
                tools: ['scan_vulnerabilities', 'analyze_code', 'check_compliance', 'generate_report'],
                complexity: 'expert'
            }
        };
        
        // Active MCP projects
        this.activeProjects = new Map();
        
        // Wisdom database from our RAG system
        this.wisdomDB = {
            patterns: [],
            solutions: [],
            best_practices: [],
            common_errors: []
        };
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.loadWisdomDatabase();
        
        console.log('🤖 OriMind Universal MCP Builder Assistant: Initializing...');
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.static(path.join(__dirname, 'mcp-builder-frontend')));
        
        // CORS for cross-origin requests
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'healthy',
                service: 'OriMind MCP Builder Assistant',
                version: '1.0.0',
                models: Object.keys(this.aiModels).length,
                templates: Object.keys(this.mcpTemplates).length,
                activeProjects: this.activeProjects.size
            });
        });

        // Get available MCP templates
        this.app.get('/api/templates', (req, res) => {
            res.json({
                templates: this.mcpTemplates,
                total: Object.keys(this.mcpTemplates).length
            });
        });

        // Create new MCP project
        this.app.post('/api/create-mcp', async (req, res) => {
            try {
                const result = await this.createMCPProject(req.body);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Analyze user requirements and suggest MCP architecture
        this.app.post('/api/analyze-requirements', async (req, res) => {
            try {
                const analysis = await this.analyzeRequirements(req.body);
                res.json(analysis);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Generate MCP code
        this.app.post('/api/generate-code', async (req, res) => {
            try {
                const code = await this.generateMCPCode(req.body);
                res.json(code);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Debug MCP issues
        this.app.post('/api/debug', async (req, res) => {
            try {
                const solution = await this.debugMCP(req.body);
                res.json(solution);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Optimize MCP performance
        this.app.post('/api/optimize', async (req, res) => {
            try {
                const optimization = await this.optimizeMCP(req.body);
                res.json(optimization);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Generate tests for MCP
        this.app.post('/api/generate-tests', async (req, res) => {
            try {
                const tests = await this.generateTests(req.body);
                res.json(tests);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Generate documentation
        this.app.post('/api/generate-docs', async (req, res) => {
            try {
                const docs = await this.generateDocumentation(req.body);
                res.json(docs);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Validate MCP implementation
        this.app.post('/api/validate', async (req, res) => {
            try {
                const validation = await this.validateMCP(req.body);
                res.json(validation);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get project status
        this.app.get('/api/projects/:projectId', (req, res) => {
            const project = this.activeProjects.get(req.params.projectId);
            if (project) {
                res.json(project);
            } else {
                res.status(404).json({ error: 'Project not found' });
            }
        });

        // List all active projects
        this.app.get('/api/projects', (req, res) => {
            const projects = Array.from(this.activeProjects.entries()).map(([id, project]) => ({
                id,
                ...project
            }));
            res.json({ projects, total: projects.length });
        });

        // Deploy MCP
        this.app.post('/api/deploy/:projectId', async (req, res) => {
            try {
                const result = await this.deployMCP(req.params.projectId, req.body);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: this.wsPort });
        
        this.wss.on('connection', (ws) => {
            console.log('🔌 MCP Builder client connected');
            
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleWebSocketMessage(ws, data);
                } catch (error) {
                    ws.send(JSON.stringify({ error: error.message }));
                }
            });
            
            ws.on('close', () => {
                console.log('🔌 MCP Builder client disconnected');
            });
        });
    }

    async handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'chat':
                const response = await this.handleChat(data.message, data.context);
                ws.send(JSON.stringify({ type: 'chat_response', data: response }));
                break;
                
            case 'code_assistance':
                const assistance = await this.provideCodeAssistance(data.code, data.issue);
                ws.send(JSON.stringify({ type: 'code_assistance', data: assistance }));
                break;
                
            case 'real_time_validation':
                const validation = await this.validateCodeRealTime(data.code);
                ws.send(JSON.stringify({ type: 'validation', data: validation }));
                break;
                
            case 'progress_update':
                this.updateProjectProgress(data.projectId, data.progress);
                ws.send(JSON.stringify({ type: 'progress_updated', projectId: data.projectId }));
                break;
        }
    }

    async createMCPProject(requirements) {
        const projectId = `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log(`🚀 Creating MCP project: ${projectId}`);
        
        // Analyze requirements using our architect AI
        const analysis = await this.callAI('architect', {
            task: 'analyze_mcp_requirements',
            requirements: requirements.description,
            constraints: requirements.constraints || {},
            target_platform: requirements.platform || 'universal'
        });

        // Select appropriate template
        const template = this.selectBestTemplate(requirements, analysis);
        
        // Create project structure
        const projectPath = path.join(__dirname, 'generated-mcps', projectId);
        fs.mkdirSync(projectPath, { recursive: true });
        
        const project = {
            id: projectId,
            name: requirements.name || 'Generated MCP',
            description: requirements.description,
            template: template,
            path: projectPath,
            status: 'initializing',
            created: new Date().toISOString(),
            progress: {
                analysis: 100,
                architecture: 0,
                implementation: 0,
                testing: 0,
                documentation: 0,
                deployment: 0
            },
            files: [],
            analysis: analysis
        };
        
        this.activeProjects.set(projectId, project);
        
        // Start the architecture phase
        setTimeout(() => this.generateArchitecture(projectId), 1000);
        
        return {
            projectId,
            project,
            message: '🎯 MCP project created successfully! Architecture design in progress...'
        };
    }

    async analyzeRequirements(requirements) {
        console.log('🔍 Analyzing MCP requirements...');
        
        const analysis = await this.callAI('architect', {
            task: 'deep_requirements_analysis',
            description: requirements.description,
            use_cases: requirements.use_cases || [],
            technical_constraints: requirements.constraints || {},
            target_users: requirements.users || 'developers'
        });

        // Check against our wisdom database
        const wisdom = this.findRelevantWisdom(requirements.description);
        
        // Suggest improvements based on patterns
        const suggestions = await this.callAI('architect', {
            task: 'suggest_improvements',
            original_requirements: requirements,
            analysis: analysis,
            patterns: wisdom.patterns,
            best_practices: wisdom.best_practices
        });

        return {
            analysis,
            suggestions,
            recommended_templates: this.recommendTemplates(analysis),
            complexity_score: this.calculateComplexity(analysis),
            estimated_effort: this.estimateEffort(analysis),
            wisdom: wisdom
        };
    }

    async generateMCPCode(specification) {
        console.log('💻 Generating MCP code...');
        
        const projectId = specification.projectId;
        const project = this.activeProjects.get(projectId);
        
        if (!project) {
            throw new Error('Project not found');
        }

        // Generate code using our specialized coder AI
        const code = await this.callAI('coder', {
            task: 'generate_mcp_implementation',
            architecture: project.analysis,
            template: project.template,
            requirements: specification.requirements,
            style: specification.style || 'modern',
            language: specification.language || 'javascript'
        });

        // Generate supporting files
        const packageJson = await this.generatePackageJson(project);
        const readme = await this.generateReadme(project);
        const gitignore = await this.generateGitignore();
        
        // Save files
        const files = {
            'index.js': code.main,
            'package.json': packageJson,
            'README.md': readme,
            '.gitignore': gitignore,
            'src/tools.js': code.tools || '',
            'src/types.js': code.types || '',
            'tests/index.test.js': code.tests || ''
        };

        for (const [filename, content] of Object.entries(files)) {
            const filePath = path.join(project.path, filename);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, content);
        }

        // Update project
        project.files = Object.keys(files);
        project.progress.implementation = 100;
        project.status = 'code_generated';

        return {
            files,
            projectPath: project.path,
            message: '💻 MCP code generated successfully!',
            nextSteps: ['Run tests', 'Generate documentation', 'Deploy MCP']
        };
    }

    async debugMCP(debugRequest) {
        console.log('🐛 Debugging MCP issue...');
        
        const analysis = await this.callAI('debugger', {
            task: 'analyze_mcp_error',
            error: debugRequest.error,
            code: debugRequest.code,
            context: debugRequest.context,
            logs: debugRequest.logs || []
        });

        // Check our wisdom database for similar issues
        const similarIssues = this.findSimilarIssues(debugRequest.error);
        
        const solution = await this.callAI('debugger', {
            task: 'provide_solution',
            analysis: analysis,
            similar_issues: similarIssues,
            code: debugRequest.code
        });

        // Add to wisdom database
        this.addToWisdomDatabase('common_errors', {
            error: debugRequest.error,
            solution: solution,
            timestamp: new Date().toISOString()
        });

        return {
            analysis,
            solution,
            similar_issues: similarIssues,
            confidence: solution.confidence || 0.8,
            steps: solution.steps || []
        };
    }

    async optimizeMCP(optimizationRequest) {
        console.log('⚡ Optimizing MCP performance...');
        
        const analysis = await this.callAI('optimizer', {
            task: 'analyze_performance',
            code: optimizationRequest.code,
            metrics: optimizationRequest.metrics || {},
            target_performance: optimizationRequest.targets || {}
        });

        const optimizations = await this.callAI('optimizer', {
            task: 'suggest_optimizations',
            analysis: analysis,
            code: optimizationRequest.code,
            constraints: optimizationRequest.constraints || {}
        });

        return {
            analysis,
            optimizations,
            estimated_improvement: optimizations.improvement || '20-40%',
            priority_areas: optimizations.priorities || [],
            implementation_difficulty: optimizations.difficulty || 'medium'
        };
    }

    async generateTests(testRequest) {
        console.log('🧪 Generating MCP tests...');
        
        const tests = await this.callAI('tester', {
            task: 'generate_comprehensive_tests',
            code: testRequest.code,
            tools: testRequest.tools || [],
            coverage_target: testRequest.coverage || 90,
            test_types: testRequest.types || ['unit', 'integration', 'e2e']
        });

        return {
            tests,
            coverage_estimate: tests.coverage || 85,
            test_files: tests.files || [],
            setup_instructions: tests.setup || [],
            ci_config: tests.ci_config || null
        };
    }

    async generateDocumentation(docRequest) {
        console.log('📚 Generating MCP documentation...');
        
        const documentation = await this.callAI('documenter', {
            task: 'create_comprehensive_docs',
            code: docRequest.code,
            project_info: docRequest.project,
            audience: docRequest.audience || 'developers',
            format: docRequest.format || 'markdown'
        });

        return {
            documentation,
            files: documentation.files || {},
            examples: documentation.examples || [],
            api_reference: documentation.api_reference || null
        };
    }

    async validateMCP(validationRequest) {
        console.log('✅ Validating MCP implementation...');
        
        const validation = await this.callAI('validator', {
            task: 'comprehensive_validation',
            code: validationRequest.code,
            mcp_spec: validationRequest.spec || 'latest',
            best_practices: this.wisdomDB.best_practices
        });

        return {
            validation,
            score: validation.score || 0,
            issues: validation.issues || [],
            suggestions: validation.suggestions || [],
            compliance: validation.compliance || {}
        };
    }

    async deployMCP(projectId, deploymentConfig) {
        console.log(`🚀 Deploying MCP project: ${projectId}`);
        
        const project = this.activeProjects.get(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        // Use our universal deployment system
        const deployment = await this.callAI('architect', {
            task: 'create_deployment_plan',
            project: project,
            config: deploymentConfig,
            platform: deploymentConfig.platform || 'universal'
        });

        // Execute deployment
        try {
            const result = await this.executeDeployment(project, deployment);
            
            project.status = 'deployed';
            project.deployment = result;
            project.progress.deployment = 100;
            
            return {
                success: true,
                deployment: result,
                message: '🎉 MCP deployed successfully!',
                urls: result.urls || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '❌ Deployment failed'
            };
        }
    }

    async callAI(modelType, request) {
        // This would integrate with our ReliaKit Dashboard for AI model arbitration
        const model = this.aiModels[modelType];
        
        // Simulate AI response (in real implementation, this would call our multi-model system)
        console.log(`🤖 Calling ${model} for ${request.task}...`);
        
        // Mock intelligent responses based on the task
        return this.generateMockAIResponse(modelType, request);
    }

    generateMockAIResponse(modelType, request) {
        switch (modelType) {
            case 'architect':
                return {
                    architecture: {
                        type: 'mcp-server',
                        tools: ['analyze_code', 'generate_docs', 'run_tests'],
                        complexity: 'intermediate',
                        estimated_lines: 500
                    },
                    recommendations: ['Use TypeScript for better type safety', 'Implement proper error handling']
                };
                
            case 'coder':
                return {
                    main: this.generateMCPTemplate(),
                    tools: '// Generated tool implementations',
                    types: '// Generated type definitions',
                    tests: '// Generated test cases'
                };
                
            case 'debugger':
                return {
                    root_cause: 'Missing error handling in tool execution',
                    solution: 'Add try-catch blocks and proper error responses',
                    confidence: 0.9,
                    steps: ['Add error handling', 'Test error scenarios', 'Update documentation']
                };
                
            default:
                return { generated: true, model: modelType, task: request.task };
        }
    }

    generateMCPTemplate() {
        return `#!/usr/bin/env node

/**
 * Generated MCP Server
 * Created by OriMind Universal MCP Builder Assistant
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class GeneratedMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'generated-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'example_tool',
            description: 'An example tool generated by OriMind',
            inputSchema: {
              type: 'object',
              properties: {
                input: {
                  type: 'string',
                  description: 'Input parameter',
                },
              },
              required: ['input'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'example_tool':
            return {
              content: [
                {
                  type: 'text',
                  text: \`Tool executed with input: \${args.input}\`,
                },
              ],
            };

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              \`Unknown tool: \${name}\`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          \`Tool execution failed: \${error.message}\`
        );
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Generated MCP server running on stdio');
  }
}

const server = new GeneratedMCPServer();
server.run().catch(console.error);
`;
    }

    selectBestTemplate(requirements, analysis) {
        // Simple template selection logic
        const description = requirements.description.toLowerCase();
        
        if (description.includes('file') || description.includes('filesystem')) {
            return 'file-system';
        } else if (description.includes('web') || description.includes('scrape')) {
            return 'web-scraper';
        } else if (description.includes('database') || description.includes('sql')) {
            return 'database';
        } else if (description.includes('api') || description.includes('rest')) {
            return 'api-client';
        } else if (description.includes('ai') || description.includes('model')) {
            return 'ai-model';
        } else {
            return 'workflow-automation';
        }
    }

    loadWisdomDatabase() {
        try {
            if (fs.existsSync('mcp-wisdom.json')) {
                this.wisdomDB = JSON.parse(fs.readFileSync('mcp-wisdom.json', 'utf8'));
            }
        } catch (error) {
            console.log('🧠 Starting with fresh wisdom database');
        }
    }

    saveWisdomDatabase() {
        fs.writeFileSync('mcp-wisdom.json', JSON.stringify(this.wisdomDB, null, 2));
    }

    findRelevantWisdom(description) {
        return {
            patterns: this.wisdomDB.patterns.filter(p => 
                description.toLowerCase().includes(p.keyword?.toLowerCase())
            ),
            best_practices: this.wisdomDB.best_practices,
            solutions: this.wisdomDB.solutions.slice(-5) // Recent solutions
        };
    }

    addToWisdomDatabase(category, item) {
        if (!this.wisdomDB[category]) {
            this.wisdomDB[category] = [];
        }
        
        this.wisdomDB[category].push(item);
        
        // Keep only recent items to prevent infinite growth
        if (this.wisdomDB[category].length > 1000) {
            this.wisdomDB[category] = this.wisdomDB[category].slice(-500);
        }
        
        this.saveWisdomDatabase();
    }

    async start() {
        // Ensure directories exist
        fs.mkdirSync('generated-mcps', { recursive: true });
        fs.mkdirSync('mcp-builder-frontend', { recursive: true });
        
        // Create frontend if it doesn't exist
        await this.createBuilderFrontend();
        
        this.app.listen(this.port, () => {
            console.log('🌟 OriMind Universal MCP Builder Assistant Started!');
            console.log('===============================================');
            console.log(`🌐 Web Interface: http://localhost:${this.port}`);
            console.log(`🔌 WebSocket: ws://localhost:${this.wsPort}`);
            console.log(`🤖 AI Models: ${Object.keys(this.aiModels).length} specialized models`);
            console.log(`📋 Templates: ${Object.keys(this.mcpTemplates).length} MCP templates`);
            console.log('');
            console.log('🎯 Ready to build amazing MCPs!');
            console.log('💡 Use the web interface or API to get started');
        });
    }

    async createBuilderFrontend() {
        const frontendPath = path.join(__dirname, 'mcp-builder-frontend');
        
        const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OriMind Universal MCP Builder</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 3rem; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .builder-section {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }
        .btn {
            background: linear-gradient(45deg, #ff6b6b, #ffa500);
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }
        input, textarea, select {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 OriMind Universal MCP Builder</h1>
            <p>The ultimate AI-powered assistant for building Model Context Protocol servers</p>
        </div>
        <div class="builder-section">
            <h2> Create New MCP</h2>
            <form id="mcpForm">
                <div>
                    <label>MCP Name:</label>
                    <input type="text" id="mcpName" placeholder="My Awesome MCP" required>
                </div>
                <div>
                    <label>Description:</label>
                    <textarea id="mcpDescription" rows="4" placeholder="Describe what your MCP should do..." required></textarea>
                </div>
                <button type="submit" class="btn">🎯 Create MCP</button>
            </form>
        </div>
    </div>
    <script>
        document.getElementById('mcpForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('mcpName').value,
                description: document.getElementById('mcpDescription').value
            };
            
            try {
                const response = await fetch('/api/create-mcp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                alert(response.ok ? result.message : 'Error: ' + result.error);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    </script>
</body>
</html>`;

        if (!fs.existsSync(path.join(frontendPath, 'index.html'))) {
            fs.writeFileSync(path.join(frontendPath, 'index.html'), indexHtml);
        }
    }
}

// Start the MCP Builder Assistant
if (require.main === module) {
    const assistant = new OriMindMCPBuilderAssistant();
    assistant.start().catch(console.error);
}

module.exports = OriMindMCPBuilderAssistant;