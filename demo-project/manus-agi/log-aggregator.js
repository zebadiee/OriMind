#!/usr/bin/env node

/**
 * 📊 OriMind Universal Log Aggregator
 * Collects and analyzes logs from all services
 */

const fs = require('fs');
const path = require('path');

class OriMindLogAggregator {
    constructor() {
        this.logDir = 'logs';
        this.services = Object.keys({"Chi Flow Platform":{"file":"guarded-chi-flow-platform.js","port":3002,"required":true},"Sherlock Omega IDE":{"path":"sherlock-omega","file":"index.js","port":3000,"required":true},"ReliaKit Dashboard":{"path":"reliakit-dashboard","file":"index.js","port":5000,"required":true}});
    }

    async aggregateLogs() {
        console.log('📊 Aggregating OriMind logs...');
        
        if (!fs.existsSync(this.logDir)) {
            console.log('No logs directory found');
            return;
        }

        const aggregatedLog = [];
        
        for (const serviceName of this.services) {
            const logFile = path.join(this.logDir, `${serviceName.toLowerCase().replace(/\s+/g, '-')}.log`);
            
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                const lines = content.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    const match = line.match(/\[(.*?)\] \[(.*?)\] (.*)/);
                    if (match) {
                        aggregatedLog.push({
                            timestamp: new Date(match[1]),
                            service: serviceName,
                            level: match[2],
                            message: match[3]
                        });
                    }
                }
            }
        }

        // Sort by timestamp
        aggregatedLog.sort((a, b) => a.timestamp - b.timestamp);
        
        // Generate report
        this.generateReport(aggregatedLog);
    }

    generateReport(logs) {
        console.log('\n📈 OriMind Log Summary:');
        console.log('========================');
        
        const serviceCounts = {};
        const errorCounts = {};
        
        for (const log of logs) {
            serviceCounts[log.service] = (serviceCounts[log.service] || 0) + 1;
            
            if (log.level === 'STDERR' || log.message.includes('error') || log.message.includes('Error')) {
                errorCounts[log.service] = (errorCounts[log.service] || 0) + 1;
            }
        }

        console.log('\n📊 Log counts by service:');
        for (const [service, count] of Object.entries(serviceCounts)) {
            console.log(`  ${service}: ${count} entries`);
        }

        console.log('\n❌ Error counts by service:');
        for (const [service, count] of Object.entries(errorCounts)) {
            console.log(`  ${service}: ${count} errors`);
        }

        // Show recent errors
        const recentErrors = logs
            .filter(log => log.level === 'STDERR' || log.message.includes('error'))
            .slice(-10);

        if (recentErrors.length > 0) {
            console.log('\n🚨 Recent errors:');
            for (const error of recentErrors) {
                console.log(`  [${error.timestamp.toISOString()}] ${error.service}: ${error.message.substring(0, 100)}...`);
            }
        }
    }
}

if (require.main === module) {
    const aggregator = new OriMindLogAggregator();
    aggregator.aggregateLogs();
}

module.exports = OriMindLogAggregator;