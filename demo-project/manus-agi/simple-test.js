#!/usr/bin/env node

/**
 * 🧪 OriMind MCP Builder Assistant Simple Test
 * Basic validation of our AI-powered MCP builder
 */

const http = require('http');

class SimpleMCPTest {
    constructor() {
        this.baseUrl = 'http://localhost:4000';
        this.results = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        console.log(`${emoji} [${timestamp}] ${message}`);
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}${endpoint}`;
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'OriMind-MCP-Builder-Test'
                }
            };

            const req = http.request(url, options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        const response = body ? JSON.parse(body) : {};
                        resolve({ status: res.statusCode, data: response });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: body });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({ status: 0, error: error.message });
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async testService() {
        console.log('🧪 Testing OriMind MCP Builder Assistant');
        console.log('========================================');
        console.log('');

        // Test 1: Health check
        this.log('Testing health endpoint...');
        try {
            const health = await this.makeRequest('/api/health');
            if (health.status === 200) {
                this.log('Health check passed!', 'success');
                this.results.push('✅ Health check');
            } else {
                this.log(`Health check failed: ${health.status}`, 'error');
                this.results.push('❌ Health check');
            }
        } catch (error) {
            this.log(`Health check error: ${error.message}`, 'error');
            this.results.push('❌ Health check');
        }

        // Test 2: Status endpoint
        this.log('Testing status endpoint...');
        try {
            const status = await this.makeRequest('/api/status');
            if (status.status === 200) {
                this.log('Status check passed!', 'success');
                this.results.push('✅ Status endpoint');
            } else {
                this.log(`Status check failed: ${status.status}`, 'error');
                this.results.push('❌ Status endpoint');
            }
        } catch (error) {
            this.log(`Status error: ${error.message}`, 'error');
            this.results.push('❌ Status endpoint');
        }

        // Test 3: Templates endpoint
        this.log('Testing templates endpoint...');
        try {
            const templates = await this.makeRequest('/api/templates');
            if (templates.status === 200 && templates.data.templates) {
                this.log(`Templates loaded: ${templates.data.templates.length} available`, 'success');
                this.results.push('✅ Templates endpoint');
            } else {
                this.log(`Templates failed: ${templates.status}`, 'error');
                this.results.push('❌ Templates endpoint');
            }
        } catch (error) {
            this.log(`Templates error: ${error.message}`, 'error');
            this.results.push('❌ Templates endpoint');
        }

        // Test 4: Models endpoint
        this.log('Testing AI models endpoint...');
        try {
            const models = await this.makeRequest('/api/models');
            if (models.status === 200 && models.data.models) {
                this.log(`AI models available: ${models.data.models.length}`, 'success');
                this.results.push('✅ AI models endpoint');
            } else {
                this.log(`Models failed: ${models.status}`, 'error');
                this.results.push('❌ AI models endpoint');
            }
        } catch (error) {
            this.log(`Models error: ${error.message}`, 'error');
            this.results.push('❌ AI models endpoint');
        }

        // Test 5: Web interface
        this.log('Testing web interface...');
        try {
            const web = await this.makeRequest('/');
            if (web.status === 200 && web.data.includes('MCP Builder')) {
                this.log('Web interface loaded successfully!', 'success');
                this.results.push('✅ Web interface');
            } else {
                this.log(`Web interface failed: ${web.status}`, 'error');
                this.results.push('❌ Web interface');
            }
        } catch (error) {
            this.log(`Web interface error: ${error.message}`, 'error');
            this.results.push('❌ Web interface');
        }

        // Test 6: MCP Creation
        this.log('Testing MCP creation...');
        try {
            const mcpData = {
                name: 'test-file-manager',
                description: 'A test file manager MCP for validation',
                template: 'file-system',
                requirements: ['List files', 'Read content'],
                complexity: 'basic'
            };

            const creation = await this.makeRequest('/api/create-mcp', 'POST', mcpData);
            if (creation.status === 200 && creation.data.project_id) {
                this.log(`MCP creation successful: ${creation.data.project_id}`, 'success');
                this.results.push('✅ MCP creation');
            } else {
                this.log(`MCP creation failed: ${creation.status}`, 'error');
                this.results.push('❌ MCP creation');
            }
        } catch (error) {
            this.log(`MCP creation error: ${error.message}`, 'error');
            this.results.push('❌ MCP creation');
        }

        console.log('');
        console.log('🎯 Test Results Summary:');
        console.log('========================');
        this.results.forEach(result => console.log(`   ${result}`));
        
        const passed = this.results.filter(r => r.startsWith('✅')).length;
        const total = this.results.length;
        const percentage = Math.round((passed / total) * 100);

        console.log('');
        console.log(`📊 Success Rate: ${passed}/${total} (${percentage}%)`);
        
        if (percentage >= 80) {
            console.log('🎉 MCP Builder Assistant is working well!');
        } else {
            console.log('⚠️  Some issues detected. Please review.');
        }

        return percentage >= 80;
    }

    async demonstrateCapabilities() {
        console.log('');
        console.log('🌟 MCP Builder Assistant Capabilities:');
        console.log('======================================');

        try {
            // Get templates
            const templates = await this.makeRequest('/api/templates');
            if (templates.status === 200) {
                console.log('📋 Available Templates:');
                templates.data.templates.forEach(template => {
                    console.log(`   • ${template.name}: ${template.description}`);
                });
            }

            console.log('');

            // Get AI models
            const models = await this.makeRequest('/api/models');
            if (models.status === 200) {
                console.log('🤖 AI Models:');
                models.data.models.forEach(model => {
                    console.log(`   • ${model.name}: ${model.description}`);
                });
            }

            console.log('');

            // Show example usage
            console.log('🚀 Quick Start:');
            console.log('   1. Visit: http://localhost:4000');
            console.log('   2. Choose a template or describe your requirements');
            console.log('   3. Let the AI assistant guide you through MCP creation');
            console.log('   4. Get production-ready code with tests and documentation');
            console.log('');

        } catch (error) {
            console.log(`Error demonstrating capabilities: ${error.message}`);
        }
    }
}

// Wait for service and run tests
setTimeout(async () => {
    const tester = new SimpleMCPTest();
    const success = await tester.testService();
    await tester.demonstrateCapabilities();
    
    if (success) {
        console.log('🎊 Ready to build amazing MCPs!');
    }
}, 2000);