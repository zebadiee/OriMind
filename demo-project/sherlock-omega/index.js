const express = require('express');const express = require('express');

const WebSocket = require('ws');const WebSocket = require('ws');

const cors = require('cors');const cors = require('cors');

const helmet = require('helmet');const helmet = require('helmet');

const compression = require('compression');const compression = require('compression');

const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;const app = express();

const MODE = process.env.NODE_ENV || 'production';const PORT = process.env.PORT || 3000;

const MODE = process.env.NODE_ENV || 'production';

// Security and performance middleware

app.use(helmet());// Security and performance middleware

app.use(compression());app.use(helmet());

app.use(cors({app.use(compression());

  origin: MODE === 'production' ? 'https://orimind.com' : '*',app.use(cors({

  credentials: true  origin: MODE === 'production' ? 'https://orimind.com' : '*',

}));  credentials: true

app.use(express.json({ limit: '10mb' }));}));

app.use(express.urlencoded({ extended: true }));app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true }));

// Health check endpoint

app.get('/api/health', (req, res) => {// Health check endpoint

  res.json({app.get('/api/health', (req, res) => {

    service: 'Sherlock Omega IDE',  res.json({

    status: 'healthy',    service: 'Sherlock Omega IDE',

    version: '1.0.0',    status: 'healthy',

    mode: MODE,    version: '1.0.0',

    uptime: process.uptime(),    mode: MODE,

    memory: process.memoryUsage(),    uptime: process.uptime(),

    timestamp: new Date().toISOString()    memory: process.memoryUsage(),

  });    timestamp: new Date().toISOString()

});  });

});

// Authentication endpoint

app.post('/api/auth', (req, res) => {// Authentication endpoint

  const { username, password } = req.body;app.post('/api/auth', (req, res) => {

    // Simple auth for demo

  if (username && password) {  const { username, password } = req.body;

    res.json({  

      success: true,  if (username && password) {

      token: 'sherlock-' + Date.now(),    res.json({

      user: { username, role: 'developer' }      success: true,

    });      token: 'sherlock-' + Date.now(),

  } else {      user: { username, role: 'developer' }

    res.status(401).json({ success: false, message: 'Invalid credentials' });    });

  }  } else {

});    res.status(401).json({ success: false, message: 'Invalid credentials' });

  }

// Project management endpoints});

app.get('/api/projects', (req, res) => {

  res.json({// Project management endpoints

    projects: [app.get('/api/projects', (req, res) => {

      { id: 1, name: 'OriMind Core', status: 'active', language: 'JavaScript' },  res.json({

      { id: 2, name: 'MCP Integration', status: 'active', language: 'TypeScript' },    projects: [

      { id: 3, name: 'ReliaKit Dashboard', status: 'development', language: 'Python' }      { id: 1, name: 'OriMind Core', status: 'active', language: 'JavaScript' },

    ]      { id: 2, name: 'MCP Integration', status: 'active', language: 'TypeScript' },

  });      { id: 3, name: 'ReliaKit Dashboard', status: 'development', language: 'Python' }

});    ]

  });

// MCP integration endpoint});

app.post('/api/mcp/analyze', (req, res) => {

  const { repository, action } = req.body;// MCP integration endpoint

  app.post('/api/mcp/analyze', (req, res) => {

  setTimeout(() => {  const { repository, action } = req.body;

    res.json({  

      success: true,  // Simulate MCP communication

      analysis: {  setTimeout(() => {

        repository,    res.json({

        action,      success: true,

        results: 'Repository analysis completed successfully',      analysis: {

        timestamp: new Date().toISOString(),        repository,

        mcpServer: 'stdio://mcp-recipe-server'        action,

      }        results: 'Repository analysis completed successfully',

    });        timestamp: new Date().toISOString(),

  }, 1000);        mcpServer: 'stdio://mcp-recipe-server'

});      }

    });

// Start server  }, 1000);

const server = app.listen(PORT, () => {});

  console.log(`🔍 Sherlock Omega IDE running on port ${PORT} (mode: ${MODE})`);

  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);// WebSocket server for real-time features

});const server = app.listen(PORT, () => {

  console.log(\🔍 Sherlock Omega IDE running on port \3000 (mode: \production)\);

// WebSocket server  console.log(\🌐 Health check: http://localhost:\3000/api/health\);

const wss = new WebSocket.Server({ server });  console.log(\🔗 MCP Server: stdio://mcp-recipe-server\);

});

wss.on('connection', (ws) => {

  console.log('👤 New IDE client connected');const wss = new WebSocket.Server({ server });

  

  ws.send(JSON.stringify({wss.on('connection', (ws) => {

    type: 'welcome',  console.log('👤 New IDE client connected');

    message: 'Connected to Sherlock Omega IDE',  

    timestamp: new Date().toISOString()  ws.send(JSON.stringify({

  }));    type: 'welcome',

      message: 'Connected to Sherlock Omega IDE',

  ws.on('message', (message) => {    timestamp: new Date().toISOString()

    try {  }));

      const data = JSON.parse(message);  

      ws.send(JSON.stringify({  ws.on('message', (message) => {

        type: 'response',    try {

        original: data,      const data = JSON.parse(message);

        response: 'Command processed by Sherlock IDE',      console.log('📨 Received:', data.type);

        timestamp: new Date().toISOString()      

      }));      // Echo back for demo

    } catch (error) {      ws.send(JSON.stringify({

      console.error('WebSocket error:', error);        type: 'response',

    }        original: data,

  });        response: 'Command processed by Sherlock IDE',

});        timestamp: new Date().toISOString()

      }));

// Graceful shutdown    } catch (error) {

process.on('SIGTERM', () => {      console.error('WebSocket error:', error);

  console.log('🔍 Sherlock IDE shutting down...');    }

  server.close(() => process.exit(0));  });

});  

  ws.on('close', () => {

process.on('SIGINT', () => {    console.log('👤 IDE client disconnected');

  console.log('🔍 Sherlock IDE shutting down...');  });

  server.close(() => process.exit(0));});

});
// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔍 Sherlock IDE shutting down gracefully...');
  server.close(() => {
    console.log('🔍 Sherlock IDE stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔍 Sherlock IDE shutting down gracefully...');
  server.close(() => {
    console.log('🔍 Sherlock IDE stopped');
    process.exit(0);
  });
});
