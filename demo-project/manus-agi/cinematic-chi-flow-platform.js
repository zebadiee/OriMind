#!/usr/bin/env node

/**
 * 🌊 Cinematic Chi Flow Platform Interface
 * Flowing energy visualizations with Guardian monitoring and real-time data streams
 */

const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class CinematicChiFlowPlatform {
    constructor() {
        this.app = express();
        this.port = 5000;
        this.wsPort = 5001;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.initializeChiFlow();
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, 'chi-public')));
        
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }

    initializeChiFlow() {
        this.chiMetrics = {
            energy_flow_rate: Math.random() * 100 + 50,
            guardian_alerts: Math.floor(Math.random() * 5),
            active_streams: Math.floor(Math.random() * 20) + 10,
            healing_operations: Math.floor(Math.random() * 8) + 2,
            system_harmony: (Math.random() * 0.3 + 0.7).toFixed(3)
        };

        this.guardianStatus = [
            { name: 'Performance Guardian', status: 'active', threats_blocked: 47, efficiency: 0.96 },
            { name: 'Security Guardian', status: 'vigilant', threats_blocked: 23, efficiency: 0.98 },
            { name: 'Data Guardian', status: 'protecting', threats_blocked: 15, efficiency: 0.94 },
            { name: 'Memory Guardian', status: 'optimizing', threats_blocked: 31, efficiency: 0.97 }
        ];

        this.energyNodes = Array.from({ length: 12 }, (_, i) => ({
            id: `node_${i}`,
            energy_level: Math.random() * 100,
            connections: Math.floor(Math.random() * 8) + 2,
            stability: Math.random() * 0.4 + 0.6,
            type: ['primary', 'secondary', 'tertiary'][Math.floor(Math.random() * 3)]
        }));
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.send(this.generateCinematicChiInterface());
        });

        this.app.get('/api/chi-status', (req, res) => {
            res.json({
                chi_metrics: this.chiMetrics,
                guardian_status: this.guardianStatus,
                energy_nodes: this.energyNodes,
                flow_state: 'harmonic',
                timestamp: new Date().toISOString()
            });
        });

        this.app.post('/api/chi-heal', (req, res) => {
            const { target, intensity } = req.body;
            
            // Simulate healing operation
            setTimeout(() => {
                res.json({
                    healing_id: `heal_${Date.now()}`,
                    target: target,
                    intensity: intensity,
                    result: 'harmony_restored',
                    energy_restored: Math.floor(Math.random() * 30) + 20,
                    visual_effects: {
                        healing_pulse: true,
                        energy_surge: true,
                        guardian_activation: true
                    }
                });
            }, 1000);
        });
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: this.wsPort });
        
        this.wss.on('connection', (ws) => {
            console.log('🌊 Chi Flow client connected');
            
            // Send real-time chi flow updates
            const chiInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    // Update chi metrics
                    this.chiMetrics.energy_flow_rate += (Math.random() - 0.5) * 10;
                    this.chiMetrics.energy_flow_rate = Math.max(10, Math.min(150, this.chiMetrics.energy_flow_rate));
                    
                    // Update energy nodes
                    this.energyNodes.forEach(node => {
                        node.energy_level += (Math.random() - 0.5) * 20;
                        node.energy_level = Math.max(0, Math.min(100, node.energy_level));
                    });

                    ws.send(JSON.stringify({
                        type: 'chi_flow_update',
                        chi_metrics: this.chiMetrics,
                        energy_nodes: this.energyNodes,
                        flow_patterns: this.generateFlowPatterns(),
                        guardian_pulse: Math.random() > 0.7
                    }));
                }
            }, 1500);

            ws.on('close', () => {
                clearInterval(chiInterval);
            });

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.handleChiMessage(ws, message);
                } catch (error) {
                    console.error('Chi Flow WebSocket error:', error);
                }
            });
        });
    }

    generateFlowPatterns() {
        return {
            primary_flow: {
                direction: Math.random() * 360,
                intensity: Math.random() * 100,
                pattern: ['spiral', 'wave', 'vortex'][Math.floor(Math.random() * 3)]
            },
            secondary_flows: Array.from({ length: 3 }, () => ({
                direction: Math.random() * 360,
                intensity: Math.random() * 60,
                frequency: Math.random() * 10 + 5
            })),
            harmony_index: Math.random() * 0.3 + 0.7
        };
    }

    handleChiMessage(ws, message) {
        switch (message.type) {
            case 'energy_request':
                setTimeout(() => {
                    ws.send(JSON.stringify({
                        type: 'energy_response',
                        energy_granted: Math.random() * 50 + 25,
                        source_node: message.target_node,
                        flow_visualization: {
                            path: this.generateEnergyPath(),
                            duration: 2000,
                            color: '#00ff7f'
                        }
                    }));
                }, 500);
                break;
                
            case 'guardian_summon':
                setTimeout(() => {
                    ws.send(JSON.stringify({
                        type: 'guardian_response',
                        guardian_type: message.guardian_type,
                        status: 'activated',
                        protection_field: {
                            radius: 100,
                            strength: 0.95,
                            visual_effect: 'shield_barrier'
                        }
                    }));
                }, 800);
                break;
        }
    }

    generateEnergyPath() {
        const path = [];
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            path.push({
                x: Math.sin(i * Math.PI * 2 / steps) * 50 + 50,
                y: Math.cos(i * Math.PI * 2 / steps) * 50 + 50,
                intensity: Math.sin(i * Math.PI / steps)
            });
        }
        return path;
    }

    generateCinematicChiInterface() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌊 Cinematic Chi Flow Platform | OriMind</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Orbitron:wght@400;700;900&display=swap');
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --chi-primary: #00ff7f;
            --chi-secondary: #4ecdc4;
            --chi-tertiary: #3498db;
            --guardian-gold: #ffa500;
            --energy-purple: #9b59b6;
            --flow-cyan: #1abc9c;
            --deep-ocean: #0d1421;
            --midnight-blue: #1a252f;
            --ethereal-white: rgba(255, 255, 255, 0.9);
        }
        
        body {
            font-family: 'Exo 2', sans-serif;
            background: radial-gradient(ellipse at center, var(--midnight-blue) 0%, var(--deep-ocean) 100%);
            color: var(--ethereal-white);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }
        
        /* Flowing Energy Background */
        .energy-field {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .energy-stream {
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--chi-primary);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--chi-primary);
            animation: energyFlow 15s infinite linear;
        }
        
        @keyframes energyFlow {
            0% { 
                transform: translateX(-100vw) translateY(50vh) rotate(0deg); 
                opacity: 0; 
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                transform: translateX(200vw) translateY(-20vh) rotate(360deg); 
                opacity: 0; 
            }
        }
        
        /* Chi Flow Visualization Canvas */
        .chi-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
            opacity: 0.3;
        }
        
        /* Main Interface Container */
        .container {
            position: relative;
            z-index: 10;
            max-width: 1600px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        /* Cinematic Header */
        .header {
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
        }
        
        .header h1 {
            font-family: 'Orbitron', monospace;
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 900;
            background: linear-gradient(45deg, var(--chi-primary), var(--chi-secondary), var(--flow-cyan));
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: energyShimmer 4s ease-in-out infinite;
            text-shadow: 0 0 40px rgba(0, 255, 127, 0.6);
            margin-bottom: 1rem;
        }
        
        @keyframes energyShimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .header .tagline {
            font-size: 1.3rem;
            color: var(--chi-secondary);
            opacity: 0.9;
            animation: flowPulse 3s ease-in-out infinite;
        }
        
        @keyframes flowPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
        }
        
        /* Chi Metrics Dashboard */
        .chi-dashboard {
            background: linear-gradient(135deg, rgba(0, 255, 127, 0.1), rgba(78, 205, 196, 0.1));
            border: 2px solid rgba(0, 255, 127, 0.3);
            border-radius: 25px;
            padding: 2.5rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(15px);
            position: relative;
            overflow: hidden;
        }
        
        .chi-dashboard::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 127, 0.3), transparent);
            animation: energySweep 4s ease-in-out infinite;
        }
        
        @keyframes energySweep {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .dashboard-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            color: var(--chi-primary);
            margin-bottom: 2rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        
        .chi-metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .chi-metric {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .chi-metric:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--chi-primary);
            box-shadow: 0 15px 40px rgba(0, 255, 127, 0.4);
        }
        
        .chi-metric::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--chi-primary), var(--chi-secondary), var(--flow-cyan));
            animation: metricGlow 2s ease-in-out infinite;
        }
        
        @keyframes metricGlow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        
        .metric-value {
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--chi-primary);
            animation: valueShine 3s ease-out;
        }
        
        @keyframes valueShine {
            from { opacity: 0; transform: scale(0.3) rotate(-10deg); }
            to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        .metric-label {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Energy Flow Visualization */
        .energy-visualization {
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1));
            border: 2px solid rgba(52, 152, 219, 0.3);
            border-radius: 25px;
            padding: 2rem;
            margin-bottom: 2rem;
            position: relative;
            height: 400px;
            overflow: hidden;
        }
        
        .energy-nodes-container {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .energy-node {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid var(--chi-primary);
            background: radial-gradient(circle, var(--chi-primary), transparent);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: white;
            font-weight: bold;
        }
        
        .energy-node:hover {
            transform: scale(1.3);
            box-shadow: 0 0 30px var(--chi-primary);
            z-index: 10;
        }
        
        .energy-node.primary {
            border-color: var(--chi-primary);
            box-shadow: 0 0 20px var(--chi-primary);
        }
        
        .energy-node.secondary {
            border-color: var(--chi-secondary);
            background: radial-gradient(circle, var(--chi-secondary), transparent);
            box-shadow: 0 0 15px var(--chi-secondary);
        }
        
        .energy-node.tertiary {
            border-color: var(--flow-cyan);
            background: radial-gradient(circle, var(--flow-cyan), transparent);
            box-shadow: 0 0 10px var(--flow-cyan);
        }
        
        .energy-connection {
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, var(--chi-primary), var(--chi-secondary));
            opacity: 0.6;
            animation: connectionPulse 2s ease-in-out infinite;
            transform-origin: left center;
        }
        
        @keyframes connectionPulse {
            0%, 100% { opacity: 0.3; transform: scaleX(1); }
            50% { opacity: 0.8; transform: scaleX(1.1); }
        }
        
        /* Guardian Status Panel */
        .guardian-panel {
            background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 107, 107, 0.1));
            border: 2px solid rgba(255, 165, 0, 0.3);
            border-radius: 25px;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .guardian-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .guardian-card {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .guardian-card:hover {
            transform: translateY(-5px);
            border-color: var(--guardian-gold);
            box-shadow: 0 12px 35px rgba(255, 165, 0, 0.3);
        }
        
        .guardian-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .guardian-avatar {
            font-size: 2.5rem;
            animation: guardianRotate 6s linear infinite;
        }
        
        @keyframes guardianRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .guardian-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            color: var(--guardian-gold);
        }
        
        .guardian-status {
            font-size: 0.9rem;
            color: var(--chi-primary);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .guardian-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .guardian-stat {
            text-align: center;
        }
        
        .stat-value {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: var(--chi-secondary);
        }
        
        .stat-label {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* Control Panel */
        .control-panel {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(231, 76, 60, 0.1));
            border: 2px solid rgba(155, 89, 182, 0.3);
            border-radius: 25px;
            padding: 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        
        .control-button {
            background: linear-gradient(45deg, var(--energy-purple), var(--chi-secondary));
            border: none;
            border-radius: 20px;
            padding: 1.5rem;
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .control-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 15px 40px rgba(155, 89, 182, 0.5);
        }
        
        .control-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            transform: translate(-50%, -50%);
        }
        
        .control-button:active::before {
            width: 300px;
            height: 300px;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .header h1 { font-size: 2rem; }
            .chi-metrics-grid { grid-template-columns: repeat(2, 1fr); }
            .guardian-grid { grid-template-columns: 1fr; }
            .control-panel { grid-template-columns: 1fr; }
        }
        
        /* Animation Classes */
        .healing-pulse {
            animation: healingPulse 1s ease-in-out 3;
        }
        
        @keyframes healingPulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.3); }
        }
        
        .energy-surge {
            animation: energySurge 2s ease-out;
        }
        
        @keyframes energySurge {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 127, 0.7); }
            100% { box-shadow: 0 0 0 50px rgba(0, 255, 127, 0); }
        }
        
        .guardian-activation {
            animation: guardianActivation 1.5s ease-out;
        }
        
        @keyframes guardianActivation {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Flowing Energy Field -->
    <div class="energy-field" id="energyField"></div>
    
    <!-- Chi Flow Canvas -->
    <canvas class="chi-canvas" id="chiCanvas"></canvas>
    
    <div class="container">
        <!-- Cinematic Header -->
        <div class="header">
            <h1>🌊 Cinematic Chi Flow Platform</h1>
            <p class="tagline">Harmony Through Intelligent Energy Orchestration</p>
        </div>
        
        <!-- Chi Metrics Dashboard -->
        <div class="chi-dashboard">
            <h2 class="dashboard-title">
                ⚡ Chi Flow Metrics
                <div class="status-indicator"></div>
            </h2>
            <div class="chi-metrics-grid">
                <div class="chi-metric">
                    <div class="metric-value" id="energyFlowRate">0</div>
                    <div class="metric-label">Energy Flow Rate</div>
                </div>
                <div class="chi-metric">
                    <div class="metric-value" id="guardianAlerts">0</div>
                    <div class="metric-label">Guardian Alerts</div>
                </div>
                <div class="chi-metric">
                    <div class="metric-value" id="activeStreams">0</div>
                    <div class="metric-label">Active Streams</div>
                </div>
                <div class="chi-metric">
                    <div class="metric-value" id="healingOps">0</div>
                    <div class="metric-label">Healing Operations</div>
                </div>
                <div class="chi-metric">
                    <div class="metric-value" id="systemHarmony">0</div>
                    <div class="metric-label">System Harmony</div>
                </div>
            </div>
        </div>
        
        <!-- Energy Flow Visualization -->
        <div class="energy-visualization">
            <h2 class="dashboard-title">🔮 Energy Node Network</h2>
            <div class="energy-nodes-container" id="energyNodes">
                <!-- Energy nodes will be populated here -->
            </div>
        </div>
        
        <!-- Guardian Status Panel -->
        <div class="guardian-panel">
            <h2 class="dashboard-title">🛡️ Guardian Protection Matrix</h2>
            <div class="guardian-grid" id="guardianGrid">
                <!-- Guardian cards will be populated here -->
            </div>
        </div>
        
        <!-- Control Panel -->
        <div class="control-panel">
            <button class="control-button" onclick="initiateHealing()">
                🔥 Initiate System Healing
            </button>
            <button class="control-button" onclick="balanceEnergy()">
                ⚖️ Balance Energy Flow
            </button>
            <button class="control-button" onclick="summonGuardian()">
                🛡️ Summon Guardian
            </button>
            <button class="control-button" onclick="harmonizeSystem()">
                🎵 Harmonize System
            </button>
        </div>
    </div>

    <script>
        // Chi Flow System
        let ws;
        let chiCanvas, chiCtx;
        let energyParticles = [];
        let flowPatterns = {};
        
        // Initialize Chi Flow System
        function initChiFlow() {
            initEnergyField();
            initChiCanvas();
            initWebSocket();
            loadChiMetrics();
            createEnergyNodes();
            createGuardianCards();
        }
        
        // Energy Field Animation
        function initEnergyField() {
            const field = document.getElementById('energyField');
            const colors = ['#00ff7f', '#4ecdc4', '#3498db', '#1abc9c'];
            
            setInterval(() => {
                const stream = document.createElement('div');
                stream.className = 'energy-stream';
                stream.style.top = Math.random() * 100 + '%';
                stream.style.animationDelay = '0s';
                stream.style.animationDuration = (Math.random() * 10 + 10) + 's';
                stream.style.background = colors[Math.floor(Math.random() * colors.length)];
                stream.style.boxShadow = \`0 0 10px \${stream.style.background}\`;
                
                field.appendChild(stream);
                
                setTimeout(() => {
                    if (stream.parentNode) {
                        stream.parentNode.removeChild(stream);
                    }
                }, 20000);
            }, 500);
        }
        
        // Chi Flow Canvas Visualization
        function initChiCanvas() {
            chiCanvas = document.getElementById('chiCanvas');
            chiCtx = chiCanvas.getContext('2d');
            
            function resizeCanvas() {
                chiCanvas.width = window.innerWidth;
                chiCanvas.height = window.innerHeight;
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            // Initialize energy particles
            for (let i = 0; i < 30; i++) {
                energyParticles.push({
                    x: Math.random() * chiCanvas.width,
                    y: Math.random() * chiCanvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1,
                    color: ['#00ff7f', '#4ecdc4', '#3498db'][Math.floor(Math.random() * 3)],
                    pulse: Math.random() * Math.PI * 2
                });
            }
            
            animateChiFlow();
        }
        
        function animateChiFlow() {
            chiCtx.clearRect(0, 0, chiCanvas.width, chiCanvas.height);
            
            // Update and draw energy particles
            energyParticles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.pulse += 0.03;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = chiCanvas.width;
                if (particle.x > chiCanvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = chiCanvas.height;
                if (particle.y > chiCanvas.height) particle.y = 0;
                
                // Draw particle
                const alpha = (Math.sin(particle.pulse) + 1) * 0.3 + 0.2;
                chiCtx.beginPath();
                chiCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                chiCtx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                chiCtx.fill();
                
                // Add glow effect
                chiCtx.shadowBlur = 15;
                chiCtx.shadowColor = particle.color;
                chiCtx.fill();
                chiCtx.shadowBlur = 0;
            });
            
            // Draw energy connections
            for (let i = 0; i < energyParticles.length; i++) {
                for (let j = i + 1; j < energyParticles.length; j++) {
                    const dx = energyParticles[i].x - energyParticles[j].x;
                    const dy = energyParticles[i].y - energyParticles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const alpha = (150 - distance) / 150 * 0.2;
                        chiCtx.beginPath();
                        chiCtx.moveTo(energyParticles[i].x, energyParticles[i].y);
                        chiCtx.lineTo(energyParticles[j].x, energyParticles[j].y);
                        chiCtx.strokeStyle = \`rgba(0, 255, 127, \${alpha})\`;
                        chiCtx.lineWidth = 1;
                        chiCtx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animateChiFlow);
        }
        
        // WebSocket Connection
        function initWebSocket() {
            ws = new WebSocket('ws://localhost:5001');
            
            ws.onopen = () => {
                console.log('🌊 Connected to Chi Flow Platform');
            };
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleChiMessage(data);
            };
            
            ws.onerror = (error) => {
                console.log('Chi Flow WebSocket error:', error);
            };
        }
        
        function handleChiMessage(data) {
            switch (data.type) {
                case 'chi_flow_update':
                    updateChiMetrics(data.chi_metrics);
                    updateEnergyNodes(data.energy_nodes);
                    if (data.guardian_pulse) {
                        triggerGuardianPulse();
                    }
                    break;
                    
                case 'energy_response':
                    visualizeEnergyTransfer(data.flow_visualization);
                    break;
                    
                case 'guardian_response':
                    activateGuardianField(data.protection_field);
                    break;
            }
        }
        
        // Load and animate chi metrics
        function loadChiMetrics() {
            fetch('/api/chi-status')
                .then(response => response.json())
                .then(data => {
                    animateCounter('energyFlowRate', data.chi_metrics.energy_flow_rate);
                    animateCounter('guardianAlerts', data.chi_metrics.guardian_alerts);
                    animateCounter('activeStreams', data.chi_metrics.active_streams);
                    animateCounter('healingOps', data.chi_metrics.healing_operations);
                    animateCounter('systemHarmony', parseFloat(data.chi_metrics.system_harmony));
                });
        }
        
        function animateCounter(elementId, target) {
            const element = document.getElementById(elementId);
            const start = parseInt(element.textContent) || 0;
            const range = target - start;
            const duration = 2000;
            const startTime = Date.now();
            
            function update() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = start + range * easeOut;
                
                if (elementId === 'systemHarmony') {
                    element.textContent = current.toFixed(3);
                } else {
                    element.textContent = Math.round(current);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            update();
        }
        
        function updateChiMetrics(metrics) {
            animateCounter('energyFlowRate', metrics.energy_flow_rate);
            animateCounter('guardianAlerts', metrics.guardian_alerts);
            animateCounter('activeStreams', metrics.active_streams);
            animateCounter('healingOps', metrics.healing_operations);
            animateCounter('systemHarmony', parseFloat(metrics.system_harmony));
        }
        
        // Create Energy Nodes
        function createEnergyNodes() {
            const container = document.getElementById('energyNodes');
            const nodeCount = 12;
            
            for (let i = 0; i < nodeCount; i++) {
                const node = document.createElement('div');
                node.className = \`energy-node \${['primary', 'secondary', 'tertiary'][Math.floor(Math.random() * 3)]}\`;
                node.id = \`node_\${i}\`;
                node.textContent = i + 1;
                
                // Position nodes in a circular pattern
                const angle = (i / nodeCount) * Math.PI * 2;
                const radius = 150;
                const centerX = 50;
                const centerY = 50;
                const x = centerX + Math.cos(angle) * radius / 2;
                const y = centerY + Math.sin(angle) * radius / 2;
                
                node.style.left = x + '%';
                node.style.top = y + '%';
                
                node.addEventListener('click', () => requestEnergy(i));
                container.appendChild(node);
            }
            
            // Create connections between nodes
            createEnergyConnections();
        }
        
        function createEnergyConnections() {
            const container = document.getElementById('energyNodes');
            const nodes = container.querySelectorAll('.energy-node');
            
            for (let i = 0; i < nodes.length; i++) {
                const connections = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < connections; j++) {
                    const targetIndex = (i + Math.floor(Math.random() * 4) + 1) % nodes.length;
                    if (targetIndex !== i) {
                        createConnection(nodes[i], nodes[targetIndex]);
                    }
                }
            }
        }
        
        function createConnection(node1, node2) {
            const connection = document.createElement('div');
            connection.className = 'energy-connection';
            
            const rect1 = node1.getBoundingClientRect();
            const rect2 = node2.getBoundingClientRect();
            const containerRect = node1.parentElement.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width / 2 - containerRect.left;
            const y1 = rect1.top + rect1.height / 2 - containerRect.top;
            const x2 = rect2.left + rect2.width / 2 - containerRect.left;
            const y2 = rect2.top + rect2.height / 2 - containerRect.top;
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            connection.style.left = x1 + 'px';
            connection.style.top = y1 + 'px';
            connection.style.width = length + 'px';
            connection.style.transform = \`rotate(\${angle}deg)\`;
            
            node1.parentElement.appendChild(connection);
        }
        
        // Create Guardian Cards
        function createGuardianCards() {
            const grid = document.getElementById('guardianGrid');
            const guardians = [
                { name: 'Performance Guardian', avatar: '⚡', status: 'active', threats: 47, efficiency: 96 },
                { name: 'Security Guardian', avatar: '🛡️', status: 'vigilant', threats: 23, efficiency: 98 },
                { name: 'Data Guardian', avatar: '🗃️', status: 'protecting', threats: 15, efficiency: 94 },
                { name: 'Memory Guardian', avatar: '🧠', status: 'optimizing', threats: 31, efficiency: 97 }
            ];
            
            guardians.forEach(guardian => {
                const card = document.createElement('div');
                card.className = 'guardian-card';
                card.innerHTML = \`
                    <div class="guardian-header">
                        <div class="guardian-avatar">\${guardian.avatar}</div>
                        <div>
                            <div class="guardian-name">\${guardian.name}</div>
                            <div class="guardian-status">\${guardian.status}</div>
                        </div>
                    </div>
                    <div class="guardian-stats">
                        <div class="guardian-stat">
                            <div class="stat-value">\${guardian.threats}</div>
                            <div class="stat-label">Threats Blocked</div>
                        </div>
                        <div class="guardian-stat">
                            <div class="stat-value">\${guardian.efficiency}%</div>
                            <div class="stat-label">Efficiency</div>
                        </div>
                    </div>
                \`;
                grid.appendChild(card);
            });
        }
        
        // Control Functions
        function initiateHealing() {
            const target = 'system_core';
            const intensity = 'maximum';
            
            fetch('/api/chi-heal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target, intensity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.visual_effects) {
                    triggerHealingEffects(data.visual_effects);
                }
                showNotification(\`🔥 Healing completed: \${data.energy_restored} energy restored\`);
            });
        }
        
        function balanceEnergy() {
            const nodes = document.querySelectorAll('.energy-node');
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    node.classList.add('energy-surge');
                    setTimeout(() => {
                        node.classList.remove('energy-surge');
                    }, 2000);
                }, index * 200);
            });
            showNotification('⚖️ Energy flow balanced across all nodes');
        }
        
        function summonGuardian() {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'guardian_summon',
                    guardian_type: 'protection'
                }));
            }
            showNotification('🛡️ Guardian summoned for system protection');
        }
        
        function harmonizeSystem() {
            document.body.style.animation = 'none';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 100);
            
            const metrics = document.querySelectorAll('.chi-metric');
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.classList.add('healing-pulse');
                    setTimeout(() => {
                        metric.classList.remove('healing-pulse');
                    }, 3000);
                }, index * 300);
            });
            
            showNotification('🎵 System harmonization in progress...');
        }
        
        // Visual Effect Functions
        function triggerHealingEffects(effects) {
            if (effects.healing_pulse) {
                const dashboard = document.querySelector('.chi-dashboard');
                dashboard.classList.add('healing-pulse');
                setTimeout(() => {
                    dashboard.classList.remove('healing-pulse');
                }, 3000);
            }
            
            if (effects.guardian_activation) {
                const guardians = document.querySelectorAll('.guardian-avatar');
                guardians.forEach(guardian => {
                    guardian.classList.add('guardian-activation');
                    setTimeout(() => {
                        guardian.classList.remove('guardian-activation');
                    }, 1500);
                });
            }
        }
        
        function triggerGuardianPulse() {
            const guardianPanel = document.querySelector('.guardian-panel');
            guardianPanel.style.borderColor = '#ffa500';
            setTimeout(() => {
                guardianPanel.style.borderColor = 'rgba(255, 165, 0, 0.3)';
            }, 500);
        }
        
        function requestEnergy(nodeId) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'energy_request',
                    target_node: nodeId
                }));
            }
        }
        
        function visualizeEnergyTransfer(flowViz) {
            // Add energy transfer visualization
            const transferLine = document.createElement('div');
            transferLine.style.position = 'absolute';
            transferLine.style.height = '2px';
            transferLine.style.background = flowViz.color;
            transferLine.style.boxShadow = \`0 0 10px \${flowViz.color}\`;
            transferLine.style.animation = \`energyTransfer \${flowViz.duration}ms ease-out\`;
            
            document.getElementById('energyNodes').appendChild(transferLine);
            setTimeout(() => transferLine.remove(), flowViz.duration);
        }
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.background = 'rgba(0, 255, 127, 0.9)';
            notification.style.color = '#000';
            notification.style.padding = '1rem 2rem';
            notification.style.borderRadius = '10px';
            notification.style.fontFamily = 'Orbitron, monospace';
            notification.style.zIndex = '10000';
            notification.style.animation = 'slideIn 0.3s ease-out';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
        
        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', initChiFlow);
    </script>
</body>
</html>`;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('🌊 Cinematic Chi Flow Platform Started!');
            console.log('==========================================');
            console.log(`🎭 Chi Flow Interface: http://localhost:${this.port}`);
            console.log(`🔌 Real-time Energy: ws://localhost:${this.wsPort}`);
            console.log('⚡ Energy Fields: Active');
            console.log('🛡️ Guardian Matrix: Online');
            console.log('🌊 Chi Flow: Harmonized');
            console.log('');
            console.log('🎊 Ready for cinematic energy orchestration!');
        });
    }
}

// Start the Chi Flow experience
if (require.main === module) {
    const chiFlow = new CinematicChiFlowPlatform();
    chiFlow.start();
}


// Graceful shutdown handler
process.on('SIGINT', () => {
    console.log('\\n🌊 Graceful shutdown initiated...');
    if (typeof server !== 'undefined' && server.close) {
        server.close(() => {
            console.log('✨ Server closed gracefully');
            process.exit(0);
        });
    } else {
        console.log('✨ Process terminated gracefully');
        process.exit(0);
    }
});

process.on('SIGTERM', () => {
    console.log('\\n🛑 Termination signal received...');
    process.exit(0);
});
\nmodule.exports = CinematicChiFlowPlatform;