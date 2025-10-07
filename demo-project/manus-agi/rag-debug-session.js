#!/usr/bin/env node

/**
 * 🔍 RAG-Powered Debug Session for OriMind Ecosystem
 * Advanced debugging with institutional learning and intelligent problem resolution
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

class RAGDebugSession {
    constructor() {
        this.debugResults = {
            timestamp: new Date().toISOString(),
            session_id: `debug_${Date.now()}`,
            ecosystem_health: {},
            service_analysis: {},
            network_diagnostics: {},
            performance_metrics: {},
            rag_insights: {},
            improvement_recommendations: [],
            critical_issues: [],
            resolved_issues: [],
            optimization_opportunities: []
        };
        
        this.expectedServices = [
            { name: 'Chi Flow Main App', port: 3002, endpoint: '/api/health', file: 'chi-flow-main-app.js' },
            { name: 'Sherlock Omega IDE', port: 3000, endpoint: '/api/health', file: 'sherlock-omega/index.js' },
            { name: 'ReliaKit Dashboard', port: 5000, endpoint: '/health', file: 'reliakit-dashboard/index.js' },
            { name: 'MCP Builder', port: 4000, endpoint: '/api/status', file: 'rag-enhanced-mcp-builder.js' },
            { name: 'Cinematic RAG MCP', port: 4000, endpoint: '/api/health', file: 'cinematic-rag-mcp-builder.js' },
            { name: 'Cinematic Chi Flow', port: 5000, endpoint: '/api/chi-status', file: 'cinematic-chi-flow-platform.js' },
            { name: 'Cinematic Sherlock', port: 6000, endpoint: '/api/health', file: 'cinematic-sherlock-omega-ide.js' },
            { name: 'Cinematic ReliaKit', port: 7000, endpoint: '/api/health', file: 'cinematic-reliakit-dashboard.js' },
            { name: 'Cinematic Ecosystem', port: 8000, endpoint: '/api/ecosystem-status', file: 'cinematic-ecosystem-dashboard.js' }
        ];

        this.ragKnowledgeBase = {
            common_errors: {
                'EADDRINUSE': {
                    solution: 'Port already in use - kill existing process or use alternative port',
                    commands: ['taskkill /F /IM node.exe', 'netstat -an | findstr :PORT'],
                    prevention: 'Implement graceful shutdown handlers'
                },
                'Cannot find module': {
                    solution: 'Missing dependency - install required modules',
                    commands: ['npm install', 'npm ci', 'npm audit fix'],
                    prevention: 'Maintain proper package.json dependencies'
                },
                'fetch is not defined': {
                    solution: 'Use built-in fetch (Node 18+) or install node-fetch',
                    commands: ['node --version', 'Replace require("node-fetch") with built-in fetch'],
                    prevention: 'Use modern Node.js features consistently'
                },
                'ECONNREFUSED': {
                    solution: 'Service not running or unreachable',
                    commands: ['Check service status', 'Verify port availability', 'Test network connectivity'],
                    prevention: 'Implement health checks and service discovery'
                }
            },
            performance_patterns: {
                'high_memory_usage': 'Implement streaming, increase Node memory limit, optimize data structures',
                'slow_response_times': 'Add caching, optimize database queries, implement connection pooling',
                'high_cpu_usage': 'Optimize algorithms, implement worker threads, use caching',
                'frequent_restarts': 'Fix memory leaks, improve error handling, implement graceful shutdown'
            },
            architectural_insights: {
                'chi_flow_principles': [
                    'Non-blocking operations only',
                    'Stream-based data processing',
                    'Background task execution',
                    'Graceful error redirection',
                    'Continuous energy monitoring'
                ],
                'ecosystem_design': [
                    'Microservice architecture with independent ports',
                    'Real-time WebSocket communication',
                    'RESTful API for service coordination',
                    'Cinematic interfaces for enhanced UX',
                    'RAG-powered institutional learning'
                ]
            }
        };
    }

    async runComprehensiveDebug() {
        console.log('🔍 RAG-Powered Debug Session Started');
        console.log('=====================================');
        
        await this.analyzeSystemHealth();
        await this.diagnosticNetworkConnectivity();
        await this.analyzeServiceStates();
        await this.performPerformanceAnalysis();
        await this.runRAGAnalysis();
        await this.generateImprovementRecommendations();
        
        this.generateDebugReport();
        return this.debugResults;
    }

    async analyzeSystemHealth() {
        console.log('\\n🏥 System Health Analysis...');
        
        try {
            // Check Node.js version
            const nodeVersion = await this.executeCommand('node --version');
            this.debugResults.ecosystem_health.node_version = nodeVersion.trim();
            
            // Check npm version
            const npmVersion = await this.executeCommand('npm --version');
            this.debugResults.ecosystem_health.npm_version = npmVersion.trim();
            
            // Check system resources
            const memoryUsage = process.memoryUsage();
            this.debugResults.ecosystem_health.memory_usage = {
                rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
                heap_used: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                heap_total: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
            };
            
            // Check disk space
            this.debugResults.ecosystem_health.uptime = `${(process.uptime() / 60).toFixed(2)} minutes`;
            this.debugResults.ecosystem_health.platform = process.platform;
            this.debugResults.ecosystem_health.architecture = process.arch;
            
            console.log(`   ✅ Node.js: ${nodeVersion.trim()}`);
            console.log(`   ✅ Platform: ${process.platform} ${process.arch}`);
            console.log(`   ✅ Memory: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB heap used`);
            
        } catch (error) {
            this.debugResults.critical_issues.push({
                category: 'system_health',
                issue: 'System health check failed',
                error: error.message,
                severity: 'high'
            });
        }
    }

    async diagnosticNetworkConnectivity() {
        console.log('\\n🌐 Network Connectivity Diagnostics...');
        
        const networkTests = [];
        
        for (const service of this.expectedServices) {
            try {
                const isPortOpen = await this.testPort(service.port);
                const healthCheck = await this.testHealthEndpoint(service.port, service.endpoint);
                
                const result = {
                    service: service.name,
                    port: service.port,
                    port_open: isPortOpen,
                    health_endpoint: healthCheck.healthy,
                    response_time: healthCheck.responseTime,
                    status_code: healthCheck.statusCode,
                    error: healthCheck.error
                };
                
                networkTests.push(result);
                
                const status = isPortOpen && healthCheck.healthy ? '✅' : '❌';
                console.log(`   ${status} ${service.name} (${service.port}): ${isPortOpen ? 'Port Open' : 'Port Closed'} | ${healthCheck.healthy ? 'Healthy' : 'Unhealthy'}`);
                
            } catch (error) {
                networkTests.push({
                    service: service.name,
                    port: service.port,
                    error: error.message,
                    port_open: false,
                    health_endpoint: false
                });
                console.log(`   ❌ ${service.name} (${service.port}): ${error.message}`);
            }
        }
        
        this.debugResults.network_diagnostics = {
            total_services: this.expectedServices.length,
            services_responding: networkTests.filter(t => t.health_endpoint).length,
            ports_open: networkTests.filter(t => t.port_open).length,
            test_results: networkTests
        };
    }

    async analyzeServiceStates() {
        console.log('\\n🔧 Service State Analysis...');
        
        for (const service of this.expectedServices) {
            try {
                const fileExists = fs.existsSync(service.file);
                const analysis = {
                    file_exists: fileExists,
                    file_path: service.file,
                    port: service.port,
                    endpoint: service.endpoint
                };
                
                if (fileExists) {
                    const stats = fs.statSync(service.file);
                    analysis.file_size = `${(stats.size / 1024).toFixed(2)} KB`;
                    analysis.last_modified = stats.mtime.toISOString();
                    
                    // Analyze file content for common issues
                    const content = fs.readFileSync(service.file, 'utf8');
                    analysis.content_analysis = {
                        has_express: content.includes('express'),
                        has_websocket: content.includes('WebSocket') || content.includes('ws'),
                        has_error_handling: content.includes('try') && content.includes('catch'),
                        has_health_endpoint: content.includes('/health') || content.includes('/api/health'),
                        line_count: content.split('\\n').length,
                        potential_issues: this.analyzeCodeForIssues(content)
                    };
                }
                
                this.debugResults.service_analysis[service.name] = analysis;
                
                const status = fileExists ? '✅' : '❌';
                console.log(`   ${status} ${service.name}: ${fileExists ? 'File exists' : 'File missing'}`);
                if (fileExists && analysis.content_analysis.potential_issues.length > 0) {
                    console.log(`      ⚠️  Issues: ${analysis.content_analysis.potential_issues.join(', ')}`);
                }
                
            } catch (error) {
                this.debugResults.service_analysis[service.name] = {
                    error: error.message,
                    file_exists: false
                };
                console.log(`   ❌ ${service.name}: Analysis failed - ${error.message}`);
            }
        }
    }

    analyzeCodeForIssues(content) {
        const issues = [];
        
        if (content.includes('require(\'node-fetch\')')) {
            issues.push('Uses node-fetch instead of built-in fetch');
        }
        
        if (content.includes('process.exit(1)') && !content.includes('graceful')) {
            issues.push('Hard process exit without graceful shutdown');
        }
        
        if (!content.includes('process.on(\'SIGINT\'')) {
            issues.push('Missing SIGINT handler for graceful shutdown');
        }
        
        if (content.includes('setTimeout') && !content.includes('clearTimeout')) {
            issues.push('Potential memory leak from uncleaned timeouts');
        }
        
        if (content.includes('setInterval') && !content.includes('clearInterval')) {
            issues.push('Potential memory leak from uncleaned intervals');
        }
        
        return issues;
    }

    async performPerformanceAnalysis() {
        console.log('\\n⚡ Performance Analysis...');
        
        const metrics = {
            cpu_usage: process.cpuUsage(),
            memory_usage: process.memoryUsage(),
            uptime: process.uptime(),
            active_handles: process._getActiveHandles().length,
            active_requests: process._getActiveRequests().length
        };
        
        // Test response times for active services
        const responseTimeTests = [];
        for (const service of this.expectedServices) {
            try {
                const startTime = Date.now();
                const result = await this.testHealthEndpoint(service.port, service.endpoint);
                const responseTime = Date.now() - startTime;
                
                if (result.healthy) {
                    responseTimeTests.push({
                        service: service.name,
                        response_time: responseTime,
                        status: responseTime < 1000 ? 'excellent' : responseTime < 3000 ? 'good' : 'slow'
                    });
                    
                    const status = responseTime < 1000 ? '🚀' : responseTime < 3000 ? '✅' : '⚠️';
                    console.log(`   ${status} ${service.name}: ${responseTime}ms`);
                }
            } catch (error) {
                // Service not available
            }
        }
        
        this.debugResults.performance_metrics = {
            ...metrics,
            response_time_tests: responseTimeTests,
            avg_response_time: responseTimeTests.length > 0 ? 
                responseTimeTests.reduce((sum, test) => sum + test.response_time, 0) / responseTimeTests.length : 0
        };
        
        console.log(`   📊 Average Response Time: ${this.debugResults.performance_metrics.avg_response_time.toFixed(0)}ms`);
        console.log(`   🔧 Active Handles: ${metrics.active_handles}`);
        console.log(`   📡 Active Requests: ${metrics.active_requests}`);
    }

    async runRAGAnalysis() {
        console.log('\\n🧠 RAG-Powered Analysis...');
        
        const insights = {
            error_patterns: {},
            architectural_assessment: {},
            optimization_insights: {},
            learning_recommendations: []
        };
        
        // Analyze error patterns from debug results
        const allIssues = [
            ...this.debugResults.critical_issues,
            ...Object.values(this.debugResults.service_analysis)
                .filter(s => s.content_analysis?.potential_issues)
                .flatMap(s => s.content_analysis.potential_issues.map(issue => ({issue, category: 'code_quality'})))
        ];
        
        for (const issue of allIssues) {
            const errorType = this.categorizeError(issue.issue || issue);
            if (!insights.error_patterns[errorType]) {
                insights.error_patterns[errorType] = {
                    count: 0,
                    instances: [],
                    rag_solution: this.ragKnowledgeBase.common_errors[errorType] || null
                };
            }
            insights.error_patterns[errorType].count++;
            insights.error_patterns[errorType].instances.push(issue);
        }
        
        // Architectural assessment
        const servicesRunning = this.debugResults.network_diagnostics.services_responding;
        const totalServices = this.debugResults.network_diagnostics.total_services;
        const healthPercentage = (servicesRunning / totalServices) * 100;
        
        insights.architectural_assessment = {
            ecosystem_health_percentage: healthPercentage,
            services_operational: servicesRunning,
            total_services: totalServices,
            chi_flow_compliance: this.assessChiFlowCompliance(),
            microservice_independence: this.assessMicroserviceIndependence(),
            real_time_capabilities: this.assessRealTimeCapabilities()
        };
        
        // Generate learning recommendations
        insights.learning_recommendations = this.generateLearningRecommendations(insights);
        
        this.debugResults.rag_insights = insights;
        
        console.log(`   🎯 Ecosystem Health: ${healthPercentage.toFixed(1)}%`);
        console.log(`   🌊 Chi Flow Compliance: ${insights.architectural_assessment.chi_flow_compliance}%`);
        console.log(`   🔬 Error Patterns Identified: ${Object.keys(insights.error_patterns).length}`);
        console.log(`   💡 Learning Recommendations: ${insights.learning_recommendations.length}`);
    }

    categorizeError(errorText) {
        const errorString = errorText.toString().toLowerCase();
        
        if (errorString.includes('port') && errorString.includes('use')) return 'EADDRINUSE';
        if (errorString.includes('module') && errorString.includes('find')) return 'Cannot find module';
        if (errorString.includes('fetch') && errorString.includes('defined')) return 'fetch is not defined';
        if (errorString.includes('connection') && errorString.includes('refused')) return 'ECONNREFUSED';
        if (errorString.includes('timeout')) return 'timeout';
        if (errorString.includes('permission')) return 'permission_denied';
        
        return 'unknown_error';
    }

    assessChiFlowCompliance() {
        const services = Object.values(this.debugResults.service_analysis);
        const compliantServices = services.filter(service => {
            if (!service.content_analysis) return false;
            const analysis = service.content_analysis;
            return analysis.has_error_handling && 
                   analysis.has_health_endpoint && 
                   !analysis.potential_issues.includes('Hard process exit without graceful shutdown');
        });
        
        return services.length > 0 ? (compliantServices.length / services.length) * 100 : 0;
    }

    assessMicroserviceIndependence() {
        const networkTests = this.debugResults.network_diagnostics.test_results;
        const independentServices = networkTests.filter(test => test.port_open && test.health_endpoint);
        return networkTests.length > 0 ? (independentServices.length / networkTests.length) * 100 : 0;
    }

    assessRealTimeCapabilities() {
        const services = Object.values(this.debugResults.service_analysis);
        const realTimeServices = services.filter(service => 
            service.content_analysis?.has_websocket || false
        );
        return services.length > 0 ? (realTimeServices.length / services.length) * 100 : 0;
    }

    generateLearningRecommendations(insights) {
        const recommendations = [];
        
        // Error-based recommendations
        for (const [errorType, data] of Object.entries(insights.error_patterns)) {
            if (data.rag_solution && data.count > 0) {
                recommendations.push({
                    type: 'error_resolution',
                    priority: data.count > 2 ? 'high' : 'medium',
                    title: `Resolve ${errorType} errors`,
                    description: data.rag_solution.solution,
                    commands: data.rag_solution.commands,
                    prevention: data.rag_solution.prevention,
                    affected_instances: data.count
                });
            }
        }
        
        // Performance recommendations
        if (this.debugResults.performance_metrics.avg_response_time > 2000) {
            recommendations.push({
                type: 'performance',
                priority: 'medium',
                title: 'Optimize response times',
                description: 'Average response time is above optimal threshold',
                commands: ['Implement caching', 'Optimize database queries', 'Add connection pooling'],
                prevention: 'Regular performance monitoring'
            });
        }
        
        // Architectural recommendations
        if (insights.architectural_assessment.chi_flow_compliance < 80) {
            recommendations.push({
                type: 'architecture',
                priority: 'high',
                title: 'Improve Chi Flow compliance',
                description: 'Services need better error handling and graceful shutdown',
                commands: ['Add SIGINT handlers', 'Implement proper error boundaries', 'Add health endpoints'],
                prevention: 'Follow Chi Flow architectural principles'
            });
        }
        
        return recommendations;
    }

    async generateImprovementRecommendations() {
        console.log('\\n💡 Generating Improvement Recommendations...');
        
        const recommendations = [];
        
        // Analyze the debug results and generate specific recommendations
        const healthPercentage = this.debugResults.rag_insights.architectural_assessment.ecosystem_health_percentage;
        
        if (healthPercentage < 50) {
            recommendations.push({
                priority: 'critical',
                category: 'system_stability',
                title: 'Critical: Multiple services down',
                description: 'More than half of the ecosystem services are not responding',
                actions: [
                    'Run npm install in all service directories',
                    'Check for port conflicts with netstat -an',
                    'Verify all service files exist and are not corrupted',
                    'Start services individually to identify specific issues'
                ],
                estimated_impact: 'high'
            });
        }
        
        // Check for common dependency issues
        const nodeVersion = this.debugResults.ecosystem_health.node_version;
        if (nodeVersion && !nodeVersion.includes('18') && !nodeVersion.includes('19') && !nodeVersion.includes('20')) {
            recommendations.push({
                priority: 'high',
                category: 'dependencies',
                title: 'Upgrade Node.js version',
                description: 'Current Node.js version may not support built-in fetch and modern features',
                actions: [
                    'Install Node.js 18 or later',
                    'Update package.json engines field',
                    'Test all services after upgrade'
                ],
                estimated_impact: 'medium'
            });
        }
        
        // Performance optimization recommendations
        const avgResponseTime = this.debugResults.performance_metrics.avg_response_time;
        if (avgResponseTime > 1000) {
            recommendations.push({
                priority: 'medium',
                category: 'performance',
                title: 'Optimize service response times',
                description: `Average response time (${avgResponseTime}ms) exceeds optimal threshold`,
                actions: [
                    'Implement response caching',
                    'Optimize database queries',
                    'Add request compression',
                    'Consider load balancing for high-traffic endpoints'
                ],
                estimated_impact: 'medium'
            });
        }
        
        // Cinematic interface recommendations
        const cinematicServices = this.expectedServices.filter(s => s.name.includes('Cinematic'));
        const runningCinematic = this.debugResults.network_diagnostics.test_results
            .filter(t => cinematicServices.some(cs => cs.port === t.port) && t.health_endpoint).length;
        
        if (runningCinematic < cinematicServices.length) {
            recommendations.push({
                priority: 'medium',
                category: 'user_experience',
                title: 'Activate cinematic interfaces',
                description: 'Cinematic interfaces provide enhanced visual experience',
                actions: [
                    'Start cinematic interface services on dedicated ports',
                    'Verify WebSocket connections for real-time updates',
                    'Test particle effects and animations',
                    'Ensure browser compatibility for advanced CSS features'
                ],
                estimated_impact: 'high'
            });
        }
        
        this.debugResults.improvement_recommendations = recommendations;
        
        console.log(`   📋 Generated ${recommendations.length} improvement recommendations`);
        recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
        });
    }

    generateDebugReport() {
        console.log('\\n📊 Generating Comprehensive Debug Report...');
        
        const report = {
            ...this.debugResults,
            summary: {
                total_services_expected: this.expectedServices.length,
                services_responding: this.debugResults.network_diagnostics.services_responding,
                health_percentage: this.debugResults.rag_insights.architectural_assessment.ecosystem_health_percentage,
                critical_issues_count: this.debugResults.critical_issues.length,
                recommendations_count: this.debugResults.improvement_recommendations.length,
                rag_patterns_identified: Object.keys(this.debugResults.rag_insights.error_patterns).length
            },
            next_steps: [
                'Review and implement high-priority recommendations',
                'Start missing or failed services',
                'Run health checks after implementing fixes',
                'Monitor performance metrics for improvements',
                'Update RAG knowledge base with new patterns'
            ]
        };
        
        // Save detailed report to file
        const reportPath = `debug-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\\n✅ Debug Report Generated: ${reportPath}`);
        console.log('\\n🎯 Quick Summary:');
        console.log(`   📊 Health: ${report.summary.health_percentage.toFixed(1)}%`);
        console.log(`   🚀 Services: ${report.summary.services_responding}/${report.summary.total_services_expected} responding`);
        console.log(`   ⚠️  Issues: ${report.summary.critical_issues_count} critical`);
        console.log(`   💡 Recommendations: ${report.summary.recommendations_count} actionable`);
        
        return report;
    }

    async testPort(port) {
        return new Promise((resolve) => {
            const socket = require('net').createConnection({ port, host: 'localhost' });
            socket.on('connect', () => {
                socket.end();
                resolve(true);
            });
            socket.on('error', () => {
                resolve(false);
            });
            socket.setTimeout(3000, () => {
                socket.destroy();
                resolve(false);
            });
        });
    }

    async testHealthEndpoint(port, endpoint) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const req = http.request({
                hostname: 'localhost',
                port: port,
                path: endpoint,
                method: 'GET',
                timeout: 5000
            }, (res) => {
                const responseTime = Date.now() - startTime;
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        healthy: res.statusCode >= 200 && res.statusCode < 300,
                        statusCode: res.statusCode,
                        responseTime: responseTime,
                        data: data
                    });
                });
            });

            req.on('error', (error) => {
                resolve({
                    healthy: false,
                    error: error.message,
                    responseTime: Date.now() - startTime
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    healthy: false,
                    error: 'Request timeout',
                    responseTime: Date.now() - startTime
                });
            });

            req.end();
        });
    }

    async executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { encoding: 'utf8', timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Command failed: ${error.message}`));
                } else {
                    resolve(stdout || stderr);
                }
            });
        });
    }
}

// Execute RAG Debug Session
if (require.main === module) {
    const debugSession = new RAGDebugSession();
    debugSession.runComprehensiveDebug()
        .then((results) => {
            console.log('\\n🎉 RAG Debug Session Complete!');
            console.log('Check the generated debug report for detailed analysis and recommendations.');
        })
        .catch((error) => {
            console.error('\\n❌ Debug session failed:', error.message);
            process.exit(1);
        });
}

module.exports = RAGDebugSession;