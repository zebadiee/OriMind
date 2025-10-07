#!/usr/bin/env node

/**
 * 🌍 OriMind Universal Platform Detector
 * Cross-platform compatibility for Windows, macOS, Linux, PowerPC, ARM, and more
 * Automatically detects platform and architecture for optimal deployment
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class UniversalPlatformDetector {
    constructor() {
        this.platform = this.detectPlatform();
        this.architecture = this.detectArchitecture();
        this.packageManager = this.detectPackageManager();
        this.shellType = this.detectShell();
        this.capabilities = this.detectCapabilities();
        
        this.displayPlatformInfo();
    }

    detectPlatform() {
        const platform = os.platform();
        const release = os.release();
        
        const platformMap = {
            'win32': {
                name: 'Windows',
                family: 'windows',
                scriptExt: '.bat',
                execExt: '.exe',
                pathSep: ';',
                newline: '\r\n'
            },
            'darwin': {
                name: 'macOS',
                family: 'unix',
                scriptExt: '.sh',
                execExt: '',
                pathSep: ':',
                newline: '\n'
            },
            'linux': {
                name: 'Linux',
                family: 'unix', 
                scriptExt: '.sh',
                execExt: '',
                pathSep: ':',
                newline: '\n'
            },
            'freebsd': {
                name: 'FreeBSD',
                family: 'unix',
                scriptExt: '.sh',
                execExt: '',
                pathSep: ':',
                newline: '\n'
            },
            'openbsd': {
                name: 'OpenBSD',
                family: 'unix',
                scriptExt: '.sh',
                execExt: '',
                pathSep: ':',
                newline: '\n'
            },
            'aix': {
                name: 'AIX',
                family: 'unix',
                scriptExt: '.sh',
                execExt: '',
                pathSep: ':',
                newline: '\n'
            },
            'sunos': {
                name: 'Solaris',
                family: 'unix',
                scriptExt: '.sh',
                execExt: '',
                pathSep: ':',
                newline: '\n'
            }
        };

        const detected = platformMap[platform] || {
            name: 'Unknown',
            family: 'unknown',
            scriptExt: '.sh',
            execExt: '',
            pathSep: ':',
            newline: '\n'
        };

        return {
            ...detected,
            type: platform,
            release,
            version: this.detectOSVersion()
        };
    }

    detectArchitecture() {
        const arch = os.arch();
        const cpus = os.cpus();
        
        const archMap = {
            'x64': {
                name: 'x86_64',
                bits: 64,
                endian: 'little',
                family: 'x86',
                performance: 'high'
            },
            'x32': {
                name: 'x86_32',
                bits: 32,
                endian: 'little',
                family: 'x86',
                performance: 'medium'
            },
            'arm64': {
                name: 'ARM64',
                bits: 64,
                endian: 'little',
                family: 'arm',
                performance: 'high'
            },
            'arm': {
                name: 'ARM32',
                bits: 32,
                endian: 'little',
                family: 'arm',
                performance: 'medium'
            },
            'ppc64': {
                name: 'PowerPC 64',
                bits: 64,
                endian: 'big',
                family: 'powerpc',
                performance: 'high'
            },
            'ppc': {
                name: 'PowerPC 32',
                bits: 32,
                endian: 'big',
                family: 'powerpc',
                performance: 'medium'
            },
            's390x': {
                name: 'IBM Z',
                bits: 64,
                endian: 'big',
                family: 's390',
                performance: 'enterprise'
            },
            'mips64': {
                name: 'MIPS 64',
                bits: 64,
                endian: 'big',
                family: 'mips',
                performance: 'medium'
            }
        };

        const detected = archMap[arch] || {
            name: 'Unknown',
            bits: 64,
            endian: 'little',
            family: 'unknown',
            performance: 'unknown'
        };

        return {
            ...detected,
            type: arch,
            cores: cpus.length,
            cpu_info: cpus[0] || {},
            total_memory: os.totalmem(),
            free_memory: os.freemem()
        };
    }

    detectPackageManager() {
        const managers = {
            'npm': () => this.checkCommand('npm'),
            'yarn': () => this.checkCommand('yarn'),
            'pnpm': () => this.checkCommand('pnpm'),
            'bun': () => this.checkCommand('bun'),
            'brew': () => this.checkCommand('brew'),
            'apt': () => this.checkCommand('apt'),
            'yum': () => this.checkCommand('yum'),
            'dnf': () => this.checkCommand('dnf'),
            'pacman': () => this.checkCommand('pacman'),
            'zypper': () => this.checkCommand('zypper'),
            'pkg': () => this.checkCommand('pkg'),
            'portage': () => this.checkCommand('emerge'),
            'chocolatey': () => this.checkCommand('choco'),
            'winget': () => this.checkCommand('winget'),
            'scoop': () => this.checkCommand('scoop')
        };

        const available = {};
        const preferred = [];

        for (const [name, checker] of Object.entries(managers)) {
            if (checker()) {
                available[name] = true;
                if (['npm', 'yarn', 'pnpm', 'bun'].includes(name)) {
                    preferred.unshift(name);
                } else {
                    preferred.push(name);
                }
            }
        }

        return {
            available,
            preferred: preferred[0] || 'npm',
            all_preferred: preferred,
            node_managers: preferred.filter(p => ['npm', 'yarn', 'pnpm', 'bun'].includes(p))
        };
    }

    detectShell() {
        const shell = process.env.SHELL || process.env.ComSpec || '/bin/sh';
        const shellName = path.basename(shell).toLowerCase();
        
        const shellMap = {
            'bash': { name: 'Bash', features: ['pipes', 'redirects', 'scripts', 'functions'] },
            'zsh': { name: 'Zsh', features: ['pipes', 'redirects', 'scripts', 'functions', 'completion'] },
            'fish': { name: 'Fish', features: ['pipes', 'redirects', 'scripts', 'autosuggestions'] },
            'cmd': { name: 'Command Prompt', features: ['basic'] },
            'powershell': { name: 'PowerShell', features: ['pipes', 'objects', 'scripts', 'modules'] },
            'pwsh': { name: 'PowerShell Core', features: ['pipes', 'objects', 'scripts', 'modules', 'cross-platform'] },
            'sh': { name: 'Bourne Shell', features: ['pipes', 'redirects', 'scripts'] },
            'csh': { name: 'C Shell', features: ['pipes', 'redirects', 'history'] },
            'tcsh': { name: 'TCSH', features: ['pipes', 'redirects', 'history', 'completion'] }
        };

        const detected = shellMap[shellName] || { name: 'Unknown', features: ['basic'] };

        return {
            ...detected,
            path: shell,
            type: shellName
        };
    }

    detectCapabilities() {
        const capabilities = {
            node: this.checkCommand('node'),
            npm: this.checkCommand('npm'),
            git: this.checkCommand('git'),
            docker: this.checkCommand('docker'),
            python: this.checkCommand('python') || this.checkCommand('python3'),
            curl: this.checkCommand('curl'),
            wget: this.checkCommand('wget'),
            systemctl: this.checkCommand('systemctl'),
            launchctl: this.checkCommand('launchctl'),
            wsl: this.detectWSL(),
            container: this.detectContainer(),
            virtualization: this.detectVirtualization()
        };

        // Add version information for key tools
        if (capabilities.node) {
            try {
                capabilities.node_version = execSync('node --version', { encoding: 'utf8' }).trim();
            } catch (e) {
                capabilities.node_version = 'unknown';
            }
        }

        if (capabilities.npm) {
            try {
                capabilities.npm_version = execSync('npm --version', { encoding: 'utf8' }).trim();
            } catch (e) {
                capabilities.npm_version = 'unknown';
            }
        }

        return capabilities;
    }

    detectOSVersion() {
        try {
            if (this.platform.family === 'windows') {
                return execSync('wmic os get Caption /value', { encoding: 'utf8' })
                    .split('\n')
                    .find(line => line.includes('Caption='))
                    ?.split('=')[1]?.trim() || 'Unknown Windows';
            } else if (fs.existsSync('/etc/os-release')) {
                const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
                const prettyName = osRelease.match(/PRETTY_NAME="(.+)"/);
                return prettyName ? prettyName[1] : 'Unknown Linux';
            } else if (this.platform.type === 'darwin') {
                return execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
            }
        } catch (e) {
            return 'Unknown';
        }
        return 'Unknown';
    }

    checkCommand(command) {
        try {
            execSync(`${command} --version`, { stdio: 'ignore' });
            return true;
        } catch (e) {
            try {
                execSync(`which ${command}`, { stdio: 'ignore' });
                return true;
            } catch (e2) {
                try {
                    execSync(`where ${command}`, { stdio: 'ignore' });
                    return true;
                } catch (e3) {
                    return false;
                }
            }
        }
    }

    detectWSL() {
        try {
            return fs.existsSync('/proc/version') && 
                   fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
        } catch (e) {
            return false;
        }
    }

    detectContainer() {
        try {
            return fs.existsSync('/.dockerenv') || 
                   (fs.existsSync('/proc/1/cgroup') && 
                    fs.readFileSync('/proc/1/cgroup', 'utf8').includes('docker'));
        } catch (e) {
            return false;
        }
    }

    detectVirtualization() {
        try {
            if (this.platform.family === 'windows') {
                const result = execSync('wmic computersystem get model', { encoding: 'utf8' });
                return result.includes('Virtual') || result.includes('VMware') || result.includes('VirtualBox');
            } else {
                const result = execSync('dmidecode -s system-product-name 2>/dev/null || echo "unknown"', { encoding: 'utf8' });
                return result.includes('Virtual') || result.includes('VMware') || result.includes('VirtualBox') || result.includes('KVM');
            }
        } catch (e) {
            return false;
        }
    }

    displayPlatformInfo() {
        console.log('\n🌍 OriMind Universal Platform Detection');
        console.log('=========================================');
        console.log(`🖥️  Platform: ${this.platform.name} (${this.platform.type})`);
        console.log(`🏗️  Architecture: ${this.architecture.name} (${this.architecture.cores} cores)`);
        console.log(`🔧 Package Manager: ${this.packageManager.preferred}`);
        console.log(`🐚 Shell: ${this.shellType.name}`);
        console.log(`📦 Node: ${this.capabilities.node_version || 'Not found'}`);
        console.log(`💾 Memory: ${Math.round(this.architecture.total_memory / 1024 / 1024 / 1024)}GB total`);
        
        if (this.capabilities.wsl) console.log('🐧 WSL Detected');
        if (this.capabilities.container) console.log('🐳 Container Environment');
        if (this.capabilities.virtualization) console.log('💻 Virtualized Environment');
        
        console.log('\n✅ Compatibility: Universal OriMind Ready!');
    }

    generateStartupScript() {
        const isWindows = this.platform.family === 'windows';
        const scriptExt = this.platform.scriptExt;
        const nodeManager = this.packageManager.node_managers[0] || 'npm';
        
        const script = isWindows ? this.generateWindowsScript(nodeManager) : this.generateUnixScript(nodeManager);
        
        return {
            content: script,
            filename: `start-orimind-universal${scriptExt}`,
            executable: !isWindows
        };
    }

    generateWindowsScript(nodeManager) {
        return `@echo off
REM 🌍 OriMind Universal Startup Script for Windows
REM Automatically detected: ${this.platform.name} ${this.architecture.name}

echo 🚀 Starting OriMind Universal Ecosystem on Windows...
echo Platform: ${this.platform.name} ${this.architecture.name}
echo Package Manager: ${nodeManager}

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies with ${nodeManager}...
    ${nodeManager} install
)

REM Start services in background
echo 🌊 Starting Chi Flow Platform...
start /B node guarded-chi-flow-platform.js

echo 🔍 Starting Sherlock Omega IDE...
start /B node sherlock-omega/index.js

echo 🤖 Starting ReliaKit AI Dashboard...
start /B node reliakit-dashboard/index.js

echo 📡 Starting MCP Recipe Server...
start /B ${nodeManager} run start --prefix mcp-recipe-server

echo ✅ OriMind Universal Ecosystem started successfully!
echo 🌐 Access points:
echo   - Chi Flow Platform: http://localhost:3002
echo   - Sherlock IDE: http://localhost:3000  
echo   - ReliaKit Dashboard: http://localhost:5000
echo.
echo Press any key to stop all services...
pause >nul

echo 🛑 Stopping OriMind services...
taskkill /F /IM node.exe /T >nul 2>&1
echo ✅ All services stopped.
`;
    }

    generateUnixScript(nodeManager) {
        return `#!/bin/bash
# 🌍 OriMind Universal Startup Script for Unix-like systems
# Automatically detected: ${this.platform.name} ${this.architecture.name}

set -e

echo "🚀 Starting OriMind Universal Ecosystem on ${this.platform.name}..."
echo "Platform: ${this.platform.name} ${this.architecture.name}"
echo "Package Manager: ${nodeManager}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies with ${nodeManager}..."
    ${nodeManager} install
fi

# Function to start service in background
start_service() {
    local name="$1"
    local command="$2"
    local port="$3"
    
    echo "🌊 Starting $name..."
    eval "$command" &
    local pid=$!
    echo "$pid" >> .orimind-pids
    
    # Wait a moment and check if service is responding
    sleep 2
    if kill -0 "$pid" 2>/dev/null; then
        echo "✅ $name started successfully (PID: $pid)"
        if [ -n "$port" ]; then
            echo "   Accessible at: http://localhost:$port"
        fi
    else
        echo "❌ Failed to start $name"
    fi
}

# Clean up any existing PID file
rm -f .orimind-pids

# Start services
start_service "Chi Flow Platform" "node guarded-chi-flow-platform.js" "3002"
start_service "Sherlock Omega IDE" "node sherlock-omega/index.js" "3000"
start_service "ReliaKit AI Dashboard" "node reliakit-dashboard/index.js" "5000"
start_service "MCP Recipe Server" "cd mcp-recipe-server && ${nodeManager} start" ""

echo ""
echo "✅ OriMind Universal Ecosystem started successfully!"
echo "🌐 Access points:"
echo "   - Chi Flow Platform: http://localhost:3002"
echo "   - Sherlock IDE: http://localhost:3000"
echo "   - ReliaKit Dashboard: http://localhost:5000"
echo ""
echo "💡 To stop all services, run: ./stop-orimind-universal.sh"
echo "📊 To view logs, run: ./logs-orimind-universal.sh"

# Create stop script
cat > stop-orimind-universal.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping OriMind Universal Ecosystem..."

if [ -f ".orimind-pids" ]; then
    while read pid; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping process $pid..."
            kill "$pid"
        fi
    done < .orimind-pids
    rm -f .orimind-pids
fi

# Fallback: kill any remaining node processes
pkill -f "guarded-chi-flow-platform\\|sherlock-omega\\|reliakit-dashboard" 2>/dev/null || true

echo "✅ All OriMind services stopped."
EOF

chmod +x stop-orimind-universal.sh

# Create logs script
cat > logs-orimind-universal.sh << 'EOF'
#!/bin/bash
echo "📊 OriMind Universal Ecosystem Status:"
echo "======================================"

if [ -f ".orimind-pids" ]; then
    echo "🔍 Running processes:"
    while read pid; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "  ✅ PID $pid: $(ps -p $pid -o comm= 2>/dev/null || echo 'Unknown')"
        else
            echo "  ❌ PID $pid: Not running"
        fi
    done < .orimind-pids
else
    echo "❌ No PID file found. Services may not be running."
fi

echo ""
echo "🌐 Port status:"
for port in 3000 3002 5000; do
    if command -v netstat &> /dev/null; then
        if netstat -ln 2>/dev/null | grep -q ":$port "; then
            echo "  ✅ Port $port: Active"
        else
            echo "  ❌ Port $port: Inactive"
        fi
    elif command -v ss &> /dev/null; then
        if ss -ln 2>/dev/null | grep -q ":$port "; then
            echo "  ✅ Port $port: Active"
        else
            echo "  ❌ Port $port: Inactive"
        fi
    else
        echo "  ❓ Port $port: Cannot check (netstat/ss not available)"
    fi
done
EOF

chmod +x logs-orimind-universal.sh
`;
    }

    generatePackageJson() {
        return {
            "name": "orimind-universal",
            "version": "1.0.0",
            "description": "OriMind Universal AI Orchestration Ecosystem - Cross-platform compatibility for all architectures",
            "main": "universal-platform-detector.js",
            "scripts": {
                "start": "node universal-platform-detector.js && npm run start:all",
                "start:all": this.platform.family === 'windows' ? 
                    "start-orimind-universal.bat" : 
                    "./start-orimind-universal.sh",
                "stop": this.platform.family === 'windows' ?
                    "taskkill /F /IM node.exe" :
                    "./stop-orimind-universal.sh",
                "status": this.platform.family === 'windows' ?
                    "netstat -an | findstr :3000 && netstat -an | findstr :3002 && netstat -an | findstr :5000" :
                    "./logs-orimind-universal.sh",
                "install:all": "npm install && cd sherlock-omega && npm install && cd ../reliakit-dashboard && npm install && cd ../mcp-recipe-server && npm install",
                "test:platform": "node universal-platform-detector.js",
                "doctor": "node universal-platform-detector.js && npm run status"
            },
            "keywords": [
                "ai",
                "orchestration", 
                "cross-platform",
                "universal",
                "multi-model",
                "rag",
                "chi-flow",
                "windows",
                "macos", 
                "linux",
                "powerpc",
                "arm",
                "x86"
            ],
            "engines": {
                "node": ">=14.0.0"
            },
            "os": [
                "win32",
                "darwin", 
                "linux",
                "freebsd",
                "openbsd",
                "aix",
                "sunos"
            ],
            "cpu": [
                "x64",
                "arm64", 
                "arm",
                "ppc64",
                "ppc",
                "s390x",
                "mips64"
            ],
            "repository": {
                "type": "git",
                "url": "https://github.com/zebadiee/OriMind"
            },
            "author": "OriMind Team",
            "license": "MIT",
            "dependencies": {
                "express": "^4.18.2",
                "ws": "^8.14.2",
                "cors": "^2.8.5",
                "node-fetch": "^3.3.0"
            },
            "optionalDependencies": {
                "fsevents": "^2.3.2"
            }
        };
    }

    saveUniversalConfiguration() {
        const config = {
            platform: this.platform,
            architecture: this.architecture,
            packageManager: this.packageManager,
            shell: this.shellType,
            capabilities: this.capabilities,
            timestamp: new Date().toISOString(),
            version: "1.0.0"
        };

        fs.writeFileSync('universal-config.json', JSON.stringify(config, null, 2));
        console.log('\n💾 Universal configuration saved to universal-config.json');
        
        return config;
    }
}

// Main execution
if (require.main === module) {
    const detector = new UniversalPlatformDetector();
    
    // Generate startup script
    const script = detector.generateStartupScript();
    fs.writeFileSync(script.filename, script.content);
    if (script.executable) {
        try {
            fs.chmodSync(script.filename, '755');
        } catch (e) {
            console.log('⚠️  Could not set executable permissions. You may need to run: chmod +x ' + script.filename);
        }
    }
    console.log(`\n📜 Universal startup script created: ${script.filename}`);
    
    // Generate package.json with universal support
    const packageJson = detector.generatePackageJson();
    fs.writeFileSync('package-universal.json', JSON.stringify(packageJson, null, 2));
    console.log('📦 Universal package.json created: package-universal.json');
    
    // Save configuration
    detector.saveUniversalConfiguration();
    
    console.log('\n🎉 OriMind Universal Platform Setup Complete!');
    console.log(`\n🚀 To start on ${detector.platform.name}:`);
    if (detector.platform.family === 'windows') {
        console.log('   .\\start-orimind-universal.bat');
    } else {
        console.log('   ./start-orimind-universal.sh');
    }
}

module.exports = UniversalPlatformDetector;