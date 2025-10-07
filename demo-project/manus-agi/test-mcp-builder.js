#!/usr/bin/env node

/**
 * 🧪 OriMind MCP Builder Assistant Test Suite
 * Comprehensive testing of our AI-powered MCP builder
 */

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class MCPBuilderTestSuite {
    constructor() {
        this.baseUrl = 'http://localhost:4000';
        this.wsUrl = 'ws://localhost:4001';
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
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

            req.on('error', reject);

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async testWebSocket() {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(this.wsUrl);
            let responded = false;

            ws.on('open', () => {
                this.log('WebSocket connection established');
                ws.send(JSON.stringify({
                    type: 'test_message',
                    content: 'Hello MCP Builder Assistant!'
                }));
            });

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    if (!responded) {
                        responded = true;
                        this.log('WebSocket response received');
                        ws.close();
                        resolve(true);
                    }
                } catch (e) {
                    this.log('WebSocket message parsing failed', 'error');
                    ws.close();
                    resolve(false);
                }
            });

            ws.on('error', (error) => {
                this.log(`WebSocket error: ${error.message}`, 'error');
                resolve(false);
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                if (!responded) {
                    this.log('WebSocket test timeout', 'error');
                    ws.close();
                    resolve(false);
                }
            }, 5000);
        });
    }

    async runTest(name, testFunction) {
        this.results.total++;
        this.log(`Running test: ${name}`);
        
        try {
            const result = await testFunction();
            if (result) {
                this.results.passed++;
                this.log(`Test passed: ${name}`, 'success');
                this.results.tests.push({ name, status: 'passed', result });
            } else {
                this.results.failed++;
                this.log(`Test failed: ${name}`, 'error');
                this.results.tests.push({ name, status: 'failed', result });
            }
        } catch (error) {
            this.results.failed++;
            this.log(`Test error: ${name} - ${error.message}`, 'error');
            this.results.tests.push({ name, status: 'error', error: error.message });
        }
    }

    async testHealthEndpoint() {
        const response = await this.makeRequest('/api/health');
        return response.status === 200 && response.data.status === 'healthy';
    }

    async testWebInterface() {
        const response = await this.makeRequest('/');
        return response.status === 200 && response.data.includes('MCP Builder Assistant');
    }

    async testAPIEndpoints() {
        const endpoints = [
            '/api/health',
            '/api/status',
            '/api/templates',
            '/api/models'
        ];

        for (const endpoint of endpoints) {
            const response = await this.makeRequest(endpoint);
            if (response.status !== 200) {
                return false;
            }
        }
        return true;
    }

    async testMCPCreation() {
        const mcpRequest = {
            name: 'test-file-manager',
            description: 'A test file manager MCP',
            template: 'file-system',
            requirements: [
                'List directory contents',
                'Read file contents',
                'Create new files'
            ],
            complexity: 'basic'
        };

        const response = await this.makeRequest('/api/create-mcp', 'POST', mcpRequest);
        return response.status === 200 && response.data.project_id;
    }

    async testCodeGeneration() {
        // First create a project
        const mcpRequest = {
            name: 'test-api-client',
            description: 'A test API client MCP',
            template: 'api-client',
            requirements: ['Make HTTP requests', 'Handle authentication'],
            complexity: 'intermediate'
        };

        const createResponse = await this.makeRequest('/api/create-mcp', 'POST', mcpRequest);
        if (createResponse.status !== 200) return false;

        const projectId = createResponse.data.project_id;
        
        // Generate code
        const generateResponse = await this.makeRequest(`/api/generate-code/${projectId}`, 'POST');
        return generateResponse.status === 200 && generateResponse.data.code;
    }

    async testAIModels() {
        const testPrompt = {
            model: 'architect',
            prompt: 'Design a simple file system MCP',
            context: 'Testing AI model functionality'
        };

        const response = await this.makeRequest('/api/ai-assist', 'POST', testPrompt);
        return response.status === 200 && response.data.response;
    }

    async testTemplateSystem() {
        const response = await this.makeRequest('/api/templates');
        if (response.status !== 200) return false;

        const templates = response.data.templates;
        const expectedTemplates = [
            'file-system',
            'web-scraper', 
            'database',
            'api-client',
            'ai-model',
            'workflow-automation',
            'data-processing',
            'security-scanner'
        ];

        return expectedTemplates.every(template => 
            templates.some(t => t.name === template)
        );
    }

    async testErrorHandling() {
        // Test invalid endpoint
        const invalidResponse = await this.makeRequest('/api/invalid-endpoint');
        if (invalidResponse.status !== 404) return false;

        // Test invalid MCP creation
        const invalidMCP = {
            name: '', // Invalid empty name
            description: 'Test',
            template: 'invalid-template'
        };

        const errorResponse = await this.makeRequest('/api/create-mcp', 'POST', invalidMCP);
        return errorResponse.status >= 400;
    }

    async testPerformance() {
        const startTime = Date.now();
        const promises = [];
        
        // Make 10 concurrent health check requests
        for (let i = 0; i < 10; i++) {
            promises.push(this.makeRequest('/api/health'));
        }

        await Promise.all(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        // Should handle 10 concurrent requests in under 5 seconds
        return totalTime < 5000;
    }

    async testEcosystemIntegration() {
        const statusResponse = await this.makeRequest('/api/ecosystem/status');
        if (statusResponse.status !== 200) return false;

        const status = statusResponse.data;
        return status.services && status.services.length > 0;
    }

    generateReport() {
        const report = {
            summary: {
                total: this.results.total,
                passed: this.results.passed,
                failed: this.results.failed,
                success_rate: ((this.results.passed / this.results.total) * 100).toFixed(2) + '%'
            },
            tests: this.results.tests,
            timestamp: new Date().toISOString(),
            environment: {
                node_version: process.version,
                platform: process.platform,
                arch: process.arch
            }
        };

        fs.writeFileSync('mcp-builder-test-report.json', JSON.stringify(report, null, 2));
        
        console.log('\n🧪 Test Suite Complete!');
        console.log('======================');
        console.log(`📊 Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Success Rate: ${report.summary.success_rate}`);
        console.log(`💾 Report saved to: mcp-builder-test-report.json`);

        if (this.results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.tests
                .filter(test => test.status !== 'passed')
                .forEach(test => {
                    console.log(`   • ${test.name}: ${test.status}`);
                });
        }

        return this.results.passed === this.results.total;
    }

    async run() {
        console.log('🧪 Starting OriMind MCP Builder Assistant Test Suite');
        console.log('===================================================');
        console.log('');

        // Core functionality tests
        await this.runTest('Health Endpoint', () => this.testHealthEndpoint());
        await this.runTest('Web Interface', () => this.testWebInterface());
        await this.runTest('API Endpoints', () => this.testAPIEndpoints());
        
        // Feature tests
        await this.runTest('Template System', () => this.testTemplateSystem());
        await this.runTest('MCP Creation', () => this.testMCPCreation());
        await this.runTest('Code Generation', () => this.testCodeGeneration());
        await this.runTest('AI Models', () => this.testAIModels());
        
        // Communication tests
        await this.runTest('WebSocket Communication', () => this.testWebSocket());
        
        // Reliability tests
        await this.runTest('Error Handling', () => this.testErrorHandling());
        await this.runTest('Performance', () => this.testPerformance());
        await this.runTest('Ecosystem Integration', () => this.testEcosystemIntegration());

        const success = this.generateReport();
        
        if (success) {
            console.log('\n🎉 All tests passed! MCP Builder Assistant is ready for production!');
        } else {
            console.log('\n⚠️  Some tests failed. Please review the issues before deployment.');
        }

        return success;
    }
}

// Utility function to wait for service startup
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test suite
if (require.main === module) {
    console.log('🕐 Waiting for services to start...');
    
    // Wait 5 seconds for services to fully initialize
    delay(5000).then(async () => {
        const testSuite = new MCPBuilderTestSuite();
        const success = await testSuite.run();
        process.exit(success ? 0 : 1);
    });
}

module.exports = MCPBuilderTestSuite;