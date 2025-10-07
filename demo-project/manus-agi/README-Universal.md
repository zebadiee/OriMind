# 🌍 OriMind Universal - Cross-Platform AI Orchestration

**The world's most universal AI orchestration ecosystem - runs on every platform and architecture**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Universal](https://img.shields.io/badge/Platform-Universal-brightgreen.svg)](#supported-platforms)
[![Architecture: Multi](https://img.shields.io/badge/Architecture-Multi-blue.svg)](#supported-architectures)

## 🎯 Universal Compatibility

OriMind Universal is designed to run on **every modern computing platform and architecture**:

### 🖥️ Supported Platforms
- 🪟 **Windows** (10, 11, Server 2016+)
- 🍎 **macOS** (Intel & Apple Silicon)
- 🐧 **Linux** (All major distributions)
- 🔱 **FreeBSD** (12.0+)
- ⚡ **PowerPC** (Linux/AIX)
- 🐳 **Docker** (Multi-arch containers)
- 🕸️ **WebAssembly** (Browser-based)

### 🏗️ Supported Architectures
- **x86_64** (Intel/AMD 64-bit)
- **ARM64** (Apple Silicon, ARM64v8)
- **ARM32** (Raspberry Pi, ARM32v7)
- **PowerPC 64** (IBM Power, big-endian)
- **PowerPC 64LE** (IBM Power, little-endian)
- **IBM Z** (s390x mainframes)
- **RISC-V 64** (Emerging RISC-V)
- **MIPS64** (MIPS architectures)

## 🚀 Quick Start

### One-Command Universal Installation

```bash
# Auto-detect platform and install
./detect-and-install.sh
```

Or use Node.js directly:
```bash
node install-universal.js
```

### Platform-Specific Installation

#### Windows
```cmd
# Automated installation
.\deploy\windows\install-windows.bat

# Manual start
.\start-orimind-universal.bat
```

#### macOS
```bash
# Automated installation  
./deploy/macos/install-macos.sh

# Manual start
./start-orimind-universal.sh
```

#### Linux
```bash
# Automated installation
./deploy/linux/install-linux.sh

# Create AppImage (optional)
./deploy/linux/create-appimage.sh
```

#### Docker
```bash
# Run with Docker Compose
cd deploy/docker
docker-compose up -d

# Build multi-architecture images
./build-multiarch.sh
```

#### PowerPC
```bash
# PowerPC-optimized installation
./deploy/powerpc/install-powerpc.sh

# Start with PowerPC optimizations
./start-orimind-powerpc.sh
```

## 🌟 Core Features

### 🤖 Multi-Model AI Orchestration
- **11 cutting-edge AI models** from 7 major providers
- **Token-aware intelligent arbitration** with cost optimization
- **Specialty routing** (coding, analysis, creative, etc.)
- **Context window scaling** up to 2M tokens

### 🧠 RAG-Powered Institutional Learning
- **Automatic knowledge capture** from every interaction
- **Self-healing capabilities** with 75% confidence threshold
- **Pattern recognition** and solution recommendation
- **Continuous learning** and adaptation

### 🌊 Chi Flow Architecture
- **Non-blocking operations** with streaming responses
- **Energy redirection** for optimal performance
- **Pure consciousness** event handling
- **Graceful failure recovery**

### 🔒 Guardian Monitoring System
- **Continuous service monitoring** and health checks
- **Automatic recovery** for failed services
- **Real-time performance metrics**
- **Intelligent alerting**

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   OriMind Universal                        │
├─────────────────────────────────────────────────────────────┤
│  🌊 Chi Flow Platform (Port 3002)                         │
│  ├── 👁️ Guardian Monitoring                               │
│  ├── 🧠 RAG Knowledge System                              │
│  ├── 🤖 Smart Resolver                                    │
│  └── ⚡ Energy Flow Management                            │
├─────────────────────────────────────────────────────────────┤
│  🔍 Sherlock Omega IDE (Port 3000)                        │
│  ├── 🎯 Real-time Code Analysis                           │
│  ├── 🤝 Collaborative Development                         │
│  ├── 💡 AI-Powered Insights                               │
│  └── 🔧 Intelligent Debugging                             │
├─────────────────────────────────────────────────────────────┤
│  🤖 ReliaKit Dashboard (Port 5000)                        │
│  ├── 🎛️ Model Arbitration Console                          │
│  ├── 📊 Token Analysis & Optimization                     │
│  ├── 💰 Cost Management                                   │
│  └── ⚡ Performance Monitoring                            │
├─────────────────────────────────────────────────────────────┤
│  📡 MCP Recipe Server                                      │
│  ├── 🍳 Recipe Management                                  │
│  ├── 🔧 Model Context Protocol                            │
│  └── 📚 GitHub Integration                                │
└─────────────────────────────────────────────────────────────┘
```

## 🎛️ Management Commands

### Universal Process Manager
```bash
# Start all services
node process-manager.js start

# Stop all services  
node process-manager.js stop

# Check service status
node process-manager.js status
```

### Health Monitoring
```bash
# Monitor service health
node health-checker.js

# View aggregated logs
node log-aggregator.js
```

### Platform Detection
```bash
# Detect current platform
node universal-platform-detector.js

# Generate platform config
node universal-platform-detector.js > platform-info.txt
```

## 🔧 Configuration

### Environment Variables
```bash
# Node.js optimization
export NODE_OPTIONS="--max-old-space-size=4096"

# Platform-specific settings
export ORIMIND_PLATFORM="auto-detect"
export ORIMIND_ARCH="auto-detect"

# Service configuration
export CHI_FLOW_PORT=3002
export SHERLOCK_PORT=3000
export RELIAKIT_PORT=5000
```

### Universal Configuration
The system automatically generates `universal-config.json` with:
- Platform detection results
- Architecture information
- Available package managers
- System capabilities
- Performance optimizations

## 📚 API Endpoints

### Chi Flow Platform
```
GET  /api/health              - Health check
GET  /api/projects            - Project management
POST /api/execute             - Code execution
POST /api/communicate         - AI communication
WS   /                        - WebSocket connection
GET  /api/guardian/status     - Guardian monitoring
GET  /api/guardian/wisdom     - Knowledge insights
```

### ReliaKit Dashboard
```
GET  /api/models              - Available AI models
GET  /api/arbitrate           - Model selection
POST /api/analyze-tokens      - Token analysis
GET  /api/cost-optimization   - Cost management
GET  /api/performance         - Performance metrics
```

### Sherlock Omega IDE
```
POST /api/analyze             - Code analysis
POST /api/suggest             - Code suggestions
GET  /api/intelligence        - AI insights
WS   /collaborate             - Real-time collaboration
```

## 🚢 Deployment Options

### 1. Native Installation
Perfect for development and single-machine deployments.

### 2. Docker Containers
```bash
# Production deployment
docker run -d -p 3000-3002:3000-3002 orimind/universal:latest

# With custom configuration
docker run -d -v $(pwd)/config:/app/config orimind/universal:latest
```

### 3. System Services

#### Linux (systemd)
```bash
# Install as system service
sudo systemctl enable orimind
sudo systemctl start orimind
```

#### macOS (launchd)
```bash
# Install launch agent
launchctl load ~/Library/LaunchAgents/com.orimind.universal.plist
```

#### Windows (Service)
```cmd
# Install Windows service
.\deploy\windows\create-windows-service.bat
sc start OriMind
```

### 4. WebAssembly
```html
<!-- Browser deployment -->
<script type="module" src="deploy/wasm/orimind-wasm.js"></script>
```

## 🔍 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :3002
netstat -tulpn | grep :5000

# Kill conflicting processes
sudo pkill -f "node.*3000"
```

#### Permission Issues
```bash
# Fix file permissions (Unix)
chmod +x *.sh
chmod +x deploy/*/*.sh

# Windows: Run as Administrator
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# PowerPC optimization
export NODE_OPTIONS="--max-old-space-size=2048"
export UV_THREADPOOL_SIZE=4
```

### Platform-Specific Notes

#### PowerPC Systems
- Reduced memory allocation for stability
- Limited thread pool size
- May require building Node.js from source

#### ARM32 (Raspberry Pi)
- Lower memory limits recommended
- Swap file may be required
- Consider using Docker for easier deployment

#### IBM Z (s390x)
- Enterprise-grade stability
- High memory and CPU allocation
- Optimized for mainframe workloads

## 📈 Performance Optimization

### Resource Requirements

| Platform | Min RAM | Recommended RAM | Min Cores |
|----------|---------|-----------------|-----------|
| x86_64   | 2GB     | 8GB            | 2         |
| ARM64    | 2GB     | 4GB            | 2         |
| ARM32    | 1GB     | 2GB            | 1         |
| PowerPC  | 2GB     | 4GB            | 2         |
| IBM Z    | 4GB     | 16GB           | 4         |

### Optimization Tips
1. **Use native packages** when available
2. **Enable compression** for network traffic
3. **Configure swap** on memory-constrained systems
4. **Use SSD storage** for better I/O performance
5. **Tune garbage collection** for your workload

## 🤝 Contributing

We welcome contributions for all platforms and architectures!

### Development Setup
```bash
# Clone repository
git clone https://github.com/orimind/universal
cd universal

# Install dependencies
npm install

# Run tests
npm test

# Build for all platforms
node cross-platform-deployer.js
```

### Adding New Platforms
1. Add platform detection in `universal-platform-detector.js`
2. Create deployment scripts in `deploy/[platform]/`
3. Update documentation
4. Test on target platform
5. Submit pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Node.js** - Universal JavaScript runtime
- **Docker** - Containerization platform
- **WebAssembly** - Universal binary format
- **All contributors** who made this truly universal

## 🔗 Links

- 🌐 **Website**: https://orimind.ai
- 📚 **Documentation**: https://docs.orimind.ai
- 🐙 **GitHub**: https://github.com/orimind/universal
- 💬 **Discord**: https://discord.gg/orimind
- 🐦 **Twitter**: https://twitter.com/orimind_ai

---

**🌍 OriMind Universal - Truly universal AI orchestration for every platform and architecture**

*Made with ⚡ energy and 🌊 chi flow principles*