#!/usr/bin/env node

/**
 * 🌍 OriMind Cross-Platform Deployment Tool
 * Universal deployment for Windows, macOS, Linux, PowerPC, ARM, and all architectures
 * Handles platform-specific optimizations and deployment strategies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class OriMindCrossPlatformDeployer {
    constructor() {
        this.platforms = {
            'windows': {
                extensions: ['.exe', '.bat', '.cmd'],
                packageManagers: ['choco', 'winget', 'scoop', 'npm', 'yarn', 'pnpm'],
                shell: 'powershell',
                pathSeparator: ';',
                lineEnding: '\r\n',
                serviceManager: 'windows-service'
            },
            'macos': {
                extensions: ['', '.sh', '.command'],
                packageManagers: ['brew', 'macports', 'npm', 'yarn', 'pnpm'],
                shell: 'zsh',
                pathSeparator: ':',
                lineEnding: '\n',
                serviceManager: 'launchd'
            },
            'linux': {
                extensions: ['', '.sh', '.AppImage'],
                packageManagers: ['apt', 'yum', 'dnf', 'pacman', 'zypper', 'portage', 'npm', 'yarn', 'pnpm'],
                shell: 'bash',
                pathSeparator: ':',
                lineEnding: '\n',
                serviceManager: 'systemd'
            },
            'freebsd': {
                extensions: ['', '.sh'],
                packageManagers: ['pkg', 'ports', 'npm', 'yarn', 'pnpm'],
                shell: 'sh',
                pathSeparator: ':',
                lineEnding: '\n',
                serviceManager: 'rc'
            },
            'powerpc': {
                extensions: ['', '.sh'],
                packageManagers: ['rpm', 'yum', 'apt', 'npm', 'yarn', 'pnpm'],
                shell: 'bash',
                pathSeparator: ':',
                lineEnding: '\n',
                serviceManager: 'systemd'
            }
        };
        
        this.architectures = {
            'x86_64': { bits: 64, endian: 'little', performance: 'high' },
            'x86': { bits: 32, endian: 'little', performance: 'medium' },
            'arm64': { bits: 64, endian: 'little', performance: 'high' },
            'arm': { bits: 32, endian: 'little', performance: 'medium' },
            'ppc64': { bits: 64, endian: 'big', performance: 'high' },
            'ppc': { bits: 32, endian: 'big', performance: 'medium' },
            's390x': { bits: 64, endian: 'big', performance: 'enterprise' },
            'mips64': { bits: 64, endian: 'big', performance: 'medium' },
            'riscv64': { bits: 64, endian: 'little', performance: 'emerging' }
        };
    }

    async deployUniversal() {
        console.log('🌍 OriMind Cross-Platform Universal Deployment');
        console.log('===============================================');
        
        // Create deployment packages for all major platforms
        await this.createWindowsDeployment();
        await this.createMacOSDeployment();
        await this.createLinuxDeployment();
        await this.createFreeBSDDeployment();
        await this.createPowerPCDeployment();
        await this.createDockerDeployment();
        await this.createWebAssemblyDeployment();
        
        // Create universal installer
        await this.createUniversalInstaller();
        
        console.log('\n🎉 Universal deployment packages created successfully!');
        this.showDeploymentSummary();
    }

    async createWindowsDeployment() {
        console.log('\n🪟 Creating Windows deployment...');
        
        const windowsDir = 'deploy/windows';
        this.ensureDirectory(windowsDir);
        
        // Windows installer script
        const windowsInstaller = `@echo off
REM 🌍 OriMind Universal Windows Installer
REM Supports Windows 10, 11, Server 2016+, and all architectures

echo 🚀 OriMind Universal Windows Installer
echo =====================================

REM Detect architecture
set ARCH=%PROCESSOR_ARCHITECTURE%
if "%ARCH%"=="AMD64" set ARCH_NAME=x86_64
if "%ARCH%"=="x86" set ARCH_NAME=x86
if "%ARCH%"=="ARM64" set ARCH_NAME=arm64
if "%ARCH%"=="" set ARCH_NAME=unknown

echo 🖥️  Architecture: %ARCH_NAME%

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Installing Node.js...
    if exist "%ProgramFiles%\\nodejs\\node.exe" (
        echo ✅ Node.js found in Program Files
    ) else (
        echo 📦 Please install Node.js from https://nodejs.org/
        echo    Or use winget: winget install OpenJS.NodeJS
        echo    Or use chocolatey: choco install nodejs
        pause
        exit /b 1
    )
)

REM Check package manager preference
where pnpm >nul 2>&1
if not errorlevel 1 (
    set PKG_MGR=pnpm
    goto :install_deps
)

where yarn >nul 2>&1
if not errorlevel 1 (
    set PKG_MGR=yarn
    goto :install_deps
)

set PKG_MGR=npm

:install_deps
echo 📦 Using package manager: %PKG_MGR%

REM Install dependencies
if not exist node_modules (
    echo Installing dependencies...
    %PKG_MGR% install
)

REM Create Windows service if administrator
net session >nul 2>&1
if not errorlevel 1 (
    echo 🔧 Administrator detected - creating Windows service...
    call create-windows-service.bat
) else (
    echo ⚠️  Run as administrator to install Windows service
)

REM Create desktop shortcut
echo 🖥️  Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\\Desktop\\OriMind.lnk'); $Shortcut.TargetPath = '%~dp0start-orimind-universal.bat'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Save()"

echo ✅ Windows installation complete!
echo 🚀 Run: start-orimind-universal.bat
pause
`;

        fs.writeFileSync(path.join(windowsDir, 'install-windows.bat'), windowsInstaller);
        
        // Windows service creator
        const serviceCreator = `@echo off
REM Create Windows service for OriMind

echo Creating OriMind Windows Service...

REM Create service wrapper
echo @echo off > orimind-service-wrapper.bat
echo cd /d "%~dp0" >> orimind-service-wrapper.bat
echo node process-manager.js start >> orimind-service-wrapper.bat

REM Install service using nssm (if available) or sc
where nssm >nul 2>&1
if not errorlevel 1 (
    echo Using NSSM to create service...
    nssm install OriMind "%~dp0orimind-service-wrapper.bat"
    nssm set OriMind Description "OriMind Universal AI Orchestration Ecosystem"
    nssm set OriMind Start SERVICE_AUTO_START
    echo ✅ Service created with NSSM
) else (
    echo Using SC to create service...
    sc create OriMind binPath= "%~dp0orimind-service-wrapper.bat" start= auto
    sc description OriMind "OriMind Universal AI Orchestration Ecosystem"
    echo ✅ Service created with SC
)

echo 🔧 To start service: sc start OriMind
echo 🛑 To stop service: sc stop OriMind
pause
`;

        fs.writeFileSync(path.join(windowsDir, 'create-windows-service.bat'), serviceCreator);
        
        console.log('✅ Windows deployment created');
    }

    async createMacOSDeployment() {
        console.log('\n🍎 Creating macOS deployment...');
        
        const macosDir = 'deploy/macos';
        this.ensureDirectory(macosDir);
        
        // macOS installer script
        const macosInstaller = `#!/bin/bash
# 🌍 OriMind Universal macOS Installer
# Supports Intel and Apple Silicon Macs

set -e

echo "🚀 OriMind Universal macOS Installer"
echo "====================================="

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        ARCH_NAME="Intel x86_64"
        ;;
    arm64)
        ARCH_NAME="Apple Silicon ARM64"
        ;;
    *)
        ARCH_NAME="Unknown ($ARCH)"
        ;;
esac

echo "🖥️  Architecture: $ARCH_NAME"

# Check for Homebrew
if command -v brew &> /dev/null; then
    echo "✅ Homebrew found"
    BREW_AVAILABLE=true
else
    echo "⚠️  Homebrew not found - some features may be limited"
    BREW_AVAILABLE=false
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Installing..."
    if [ "$BREW_AVAILABLE" = true ]; then
        brew install node
    else
        echo "Please install Node.js from https://nodejs.org/"
        echo "Or install Homebrew first: /bin/bash -c \\"\\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\\""
        exit 1
    fi
fi

# Detect package manager
if command -v pnpm &> /dev/null; then
    PKG_MGR="pnpm"
elif command -v yarn &> /dev/null; then
    PKG_MGR="yarn"
else
    PKG_MGR="npm"
fi

echo "📦 Using package manager: $PKG_MGR"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    $PKG_MGR install
fi

# Create LaunchAgent for auto-start
echo "🔧 Creating LaunchAgent..."
mkdir -p ~/Library/LaunchAgents

cat > ~/Library/LaunchAgents/com.orimind.universal.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.orimind.universal</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>$(pwd)/process-manager.js</string>
        <string>start</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$(pwd)/logs/orimind.log</string>
    <key>StandardErrorPath</key>
    <string>$(pwd)/logs/orimind-error.log</string>
</dict>
</plist>
EOF

# Load LaunchAgent
launchctl load ~/Library/LaunchAgents/com.orimind.universal.plist

# Create macOS app bundle
./create-macos-app.sh

echo "✅ macOS installation complete!"
echo "🚀 Run: ./start-orimind-universal.sh"
echo "🔧 LaunchAgent installed for auto-start"
`;

        fs.writeFileSync(path.join(macosDir, 'install-macos.sh'), macosInstaller);
        fs.chmodSync(path.join(macosDir, 'install-macos.sh'), '755');
        
        // macOS app bundle creator
        const appCreator = `#!/bin/bash
# Create macOS app bundle for OriMind

echo "🍎 Creating OriMind.app bundle..."

APP_DIR="OriMind.app"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Create Info.plist
cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>OriMind</string>
    <key>CFBundleIdentifier</key>
    <string>com.orimind.universal</string>
    <key>CFBundleName</key>
    <string>OriMind</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
</dict>
</plist>
EOF

# Create executable
cat > "$APP_DIR/Contents/MacOS/OriMind" << EOF
#!/bin/bash
cd "\\$(dirname "\\$0")/../../.."
./start-orimind-universal.sh
EOF

chmod +x "$APP_DIR/Contents/MacOS/OriMind"

echo "✅ OriMind.app created"
`;

        fs.writeFileSync(path.join(macosDir, 'create-macos-app.sh'), appCreator);
        fs.chmodSync(path.join(macosDir, 'create-macos-app.sh'), '755');
        
        console.log('✅ macOS deployment created');
    }

    async createLinuxDeployment() {
        console.log('\n🐧 Creating Linux deployment...');
        
        const linuxDir = 'deploy/linux';
        this.ensureDirectory(linuxDir);
        
        // Universal Linux installer
        const linuxInstaller = `#!/bin/bash
# 🌍 OriMind Universal Linux Installer
# Supports all major Linux distributions and architectures

set -e

echo "🚀 OriMind Universal Linux Installer"
echo "===================================="

# Detect distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO=$ID
    VERSION=$VERSION_ID
    echo "🐧 Distribution: $PRETTY_NAME"
else
    DISTRO="unknown"
    echo "❓ Unknown Linux distribution"
fi

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        ARCH_NAME="x86_64"
        ;;
    aarch64|arm64)
        ARCH_NAME="ARM64"
        ;;
    armv7l|armhf)
        ARCH_NAME="ARM32"
        ;;
    ppc64le)
        ARCH_NAME="PowerPC 64-bit Little Endian"
        ;;
    ppc64)
        ARCH_NAME="PowerPC 64-bit Big Endian"
        ;;
    s390x)
        ARCH_NAME="IBM Z"
        ;;
    riscv64)
        ARCH_NAME="RISC-V 64-bit"
        ;;
    *)
        ARCH_NAME="Unknown ($ARCH)"
        ;;
esac

echo "🏗️  Architecture: $ARCH_NAME"

# Install Node.js based on distribution
install_nodejs() {
    echo "📦 Installing Node.js..."
    
    case $DISTRO in
        ubuntu|debian)
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        fedora|centos|rhel)
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
            sudo dnf install -y nodejs npm
            ;;
        arch)
            sudo pacman -S nodejs npm
            ;;
        opensuse)
            sudo zypper install nodejs npm
            ;;
        alpine)
            sudo apk add nodejs npm
            ;;
        *)
            echo "⚠️  Unsupported distribution. Please install Node.js manually."
            echo "   Visit: https://nodejs.org/"
            exit 1
            ;;
    esac
}

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    install_nodejs
fi

# Detect package manager
if command -v pnpm &> /dev/null; then
    PKG_MGR="pnpm"
elif command -v yarn &> /dev/null; then
    PKG_MGR="yarn"
else
    PKG_MGR="npm"
fi

echo "📦 Using package manager: $PKG_MGR"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    $PKG_MGR install
fi

# Create systemd service
if command -v systemctl &> /dev/null; then
    echo "🔧 Creating systemd service..."
    
    sudo tee /etc/systemd/system/orimind.service > /dev/null << EOF
[Unit]
Description=OriMind Universal AI Orchestration Ecosystem
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(which node) process-manager.js start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    echo "✅ Systemd service created"
    echo "🔧 To enable auto-start: sudo systemctl enable orimind"
    echo "🚀 To start service: sudo systemctl start orimind"
fi

# Create desktop entry
if [ -d "$HOME/.local/share/applications" ]; then
    echo "🖥️  Creating desktop entry..."
    
    cat > "$HOME/.local/share/applications/orimind.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=OriMind Universal
Comment=OriMind AI Orchestration Ecosystem
Exec=$(pwd)/start-orimind-universal.sh
Icon=$(pwd)/assets/icon.png
Terminal=false
Categories=Development;Network;
EOF

    echo "✅ Desktop entry created"
fi

echo "✅ Linux installation complete!"
echo "🚀 Run: ./start-orimind-universal.sh"
`;

        fs.writeFileSync(path.join(linuxDir, 'install-linux.sh'), linuxInstaller);
        fs.chmodSync(path.join(linuxDir, 'install-linux.sh'), '755');
        
        // Create AppImage builder
        const appImageBuilder = `#!/bin/bash
# Create OriMind AppImage for universal Linux compatibility

echo "📦 Creating OriMind AppImage..."

APPDIR="OriMind.AppDir"
mkdir -p "$APPDIR/usr/bin"
mkdir -p "$APPDIR/usr/share/applications"
mkdir -p "$APPDIR/usr/share/icons"

# Copy application files
cp -r . "$APPDIR/usr/bin/orimind"

# Create AppRun
cat > "$APPDIR/AppRun" << 'EOF'
#!/bin/bash
HERE="$(dirname "$(readlink -f "$0")")"
export PATH="$HERE/usr/bin:$PATH"
cd "$HERE/usr/bin/orimind"
exec node process-manager.js start "$@"
EOF

chmod +x "$APPDIR/AppRun"

# Create desktop file
cat > "$APPDIR/orimind.desktop" << EOF
[Desktop Entry]
Name=OriMind Universal
Exec=orimind
Icon=orimind
Type=Application
Categories=Development;
EOF

# Create icon (placeholder)
echo "Creating icon placeholder..."
# You would add actual icon creation here

# Download appimagetool if not available
if ! command -v appimagetool &> /dev/null; then
    echo "Downloading appimagetool..."
    wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool-x86_64.AppImage
    APPIMAGETOOL="./appimagetool-x86_64.AppImage"
else
    APPIMAGETOOL="appimagetool"
fi

# Build AppImage
$APPIMAGETOOL "$APPDIR" OriMind-Universal.AppImage

echo "✅ OriMind-Universal.AppImage created"
`;

        fs.writeFileSync(path.join(linuxDir, 'create-appimage.sh'), appImageBuilder);
        fs.chmodSync(path.join(linuxDir, 'create-appimage.sh'), '755');
        
        console.log('✅ Linux deployment created');
    }

    async createFreeBSDDeployment() {
        console.log('\n🔱 Creating FreeBSD deployment...');
        
        const freebsdDir = 'deploy/freebsd';
        this.ensureDirectory(freebsdDir);
        
        const freebsdInstaller = `#!/bin/sh
# 🌍 OriMind Universal FreeBSD Installer

echo "🚀 OriMind Universal FreeBSD Installer"
echo "======================================"

# Detect architecture
ARCH=$(uname -m)
echo "🏗️  Architecture: $ARCH"

# Install Node.js via pkg
if ! command -v node >/dev/null 2>&1; then
    echo "📦 Installing Node.js via pkg..."
    pkg install -y node npm
else
    echo "✅ Node.js found: $(node --version)"
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create rc.d service script
echo "🔧 Creating FreeBSD service..."
cat > /usr/local/etc/rc.d/orimind << 'EOF'
#!/bin/sh

# PROVIDE: orimind
# REQUIRE: LOGIN
# KEYWORD: shutdown

. /etc/rc.subr

name="orimind"
rcvar="orimind_enable"

command="/usr/local/bin/node"
command_args="$(pwd)/process-manager.js start"
pidfile="/var/run/orimind.pid"

start_cmd="orimind_start"
stop_cmd="orimind_stop"

orimind_start()
{
    echo "Starting OriMind..."
    daemon -p $pidfile $command $command_args
}

orimind_stop()
{
    echo "Stopping OriMind..."
    if [ -f $pidfile ]; then
        kill $(cat $pidfile)
        rm $pidfile
    fi
}

load_rc_config $name
run_rc_command "$1"
EOF

chmod +x /usr/local/etc/rc.d/orimind

echo "✅ FreeBSD installation complete!"
echo "🔧 To enable auto-start: sysrc orimind_enable=YES"
echo "🚀 To start service: service orimind start"
`;

        fs.writeFileSync(path.join(freebsdDir, 'install-freebsd.sh'), freebsdInstaller);
        fs.chmodSync(path.join(freebsdDir, 'install-freebsd.sh'), '755');
        
        console.log('✅ FreeBSD deployment created');
    }

    async createPowerPCDeployment() {
        console.log('\n⚡ Creating PowerPC deployment...');
        
        const ppcDir = 'deploy/powerpc';
        this.ensureDirectory(ppcDir);
        
        const ppcInstaller = `#!/bin/bash
# 🌍 OriMind Universal PowerPC Installer
# Supports PowerPC 32-bit and 64-bit architectures

set -e

echo "🚀 OriMind Universal PowerPC Installer"
echo "======================================"

# Detect PowerPC variant
ARCH=$(uname -m)
case $ARCH in
    ppc64)
        ARCH_NAME="PowerPC 64-bit Big Endian"
        NODE_ARCH="ppc64"
        ;;
    ppc64le)
        ARCH_NAME="PowerPC 64-bit Little Endian"
        NODE_ARCH="ppc64le"
        ;;
    ppc)
        ARCH_NAME="PowerPC 32-bit"
        NODE_ARCH="ppc"
        ;;
    *)
        echo "❌ Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

echo "🏗️  Architecture: $ARCH_NAME"

# PowerPC-specific Node.js installation
install_nodejs_powerpc() {
    echo "📦 Installing Node.js for PowerPC..."
    
    # Try distribution package manager first
    if command -v yum >/dev/null 2>&1; then
        yum install -y nodejs npm
    elif command -v apt-get >/dev/null 2>&1; then
        apt-get update
        apt-get install -y nodejs npm
    elif command -v zypper >/dev/null 2>&1; then
        zypper install -y nodejs npm
    else
        echo "⚠️  Please install Node.js manually for PowerPC"
        echo "   Some distributions may require building from source"
        exit 1
    fi
}

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    install_nodejs_powerpc
fi

# PowerPC optimizations
echo "🔧 Applying PowerPC optimizations..."

# Set PowerPC-specific environment variables
export NODE_OPTIONS="--max-old-space-size=2048"  # Conservative memory for older PowerPC systems
export UV_THREADPOOL_SIZE=4  # Limit thread pool for PowerPC

# Create PowerPC-optimized startup script
cat > start-orimind-powerpc.sh << 'EOF'
#!/bin/bash
# OriMind PowerPC Optimized Startup

echo "🚀 Starting OriMind on PowerPC architecture..."

# PowerPC-specific optimizations
export NODE_OPTIONS="--max-old-space-size=2048"
export UV_THREADPOOL_SIZE=4

# Start with reduced concurrency for stability
node process-manager.js start --powerpc-mode
EOF

chmod +x start-orimind-powerpc.sh

echo "✅ PowerPC installation complete!"
echo "🚀 Run: ./start-orimind-powerpc.sh"
echo "⚡ Optimized for PowerPC architecture"
`;

        fs.writeFileSync(path.join(ppcDir, 'install-powerpc.sh'), ppcInstaller);
        fs.chmodSync(path.join(ppcDir, 'install-powerpc.sh'), '755');
        
        console.log('✅ PowerPC deployment created');
    }

    async createDockerDeployment() {
        console.log('\n🐳 Creating Docker deployment...');
        
        const dockerDir = 'deploy/docker';
        this.ensureDirectory(dockerDir);
        
        // Multi-architecture Dockerfile
        const dockerfile = `# 🌍 OriMind Universal Multi-Architecture Dockerfile
# Supports amd64, arm64, arm/v7, ppc64le, s390x

FROM node:18-alpine

# Install dependencies for multiple architectures
RUN apk add --no-cache \\
    bash \\
    curl \\
    git \\
    python3 \\
    make \\
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-universal.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S orimind && \\
    adduser -S orimind -u 1001

# Change ownership
RUN chown -R orimind:orimind /app
USER orimind

# Expose ports
EXPOSE 3000 3002 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \\
    CMD curl -f http://localhost:3002/health || exit 1

# Start command
CMD ["node", "process-manager.js", "start"]
`;

        fs.writeFileSync(path.join(dockerDir, 'Dockerfile'), dockerfile);
        
        // Docker Compose for full stack
        const dockerCompose = `version: '3.8'

services:
  orimind:
    build: .
    ports:
      - "3000:3000"
      - "3002:3002"
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - CONTAINER_MODE=true
    volumes:
      - orimind-logs:/app/logs
      - orimind-data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  orimind-monitor:
    build: .
    command: ["node", "health-checker.js"]
    depends_on:
      - orimind
    volumes:
      - orimind-logs:/app/logs
    restart: unless-stopped

volumes:
  orimind-logs:
  orimind-data:
`;

        fs.writeFileSync(path.join(dockerDir, 'docker-compose.yml'), dockerCompose);
        
        // Multi-arch build script
        const buildScript = `#!/bin/bash
# 🐳 OriMind Multi-Architecture Docker Build

echo "🚀 Building OriMind Docker images for multiple architectures..."

# Enable Docker BuildKit
export DOCKER_BUILDKIT=1

# Build for multiple architectures
docker buildx create --use --name orimind-builder || true

# Build and push multi-arch image
docker buildx build \\
    --platform linux/amd64,linux/arm64,linux/arm/v7,linux/ppc64le,linux/s390x \\
    --tag orimind/universal:latest \\
    --tag orimind/universal:1.0.0 \\
    --push \\
    .

echo "✅ Multi-architecture Docker images built and pushed!"
echo "🐳 Pull with: docker pull orimind/universal:latest"
`;

        fs.writeFileSync(path.join(dockerDir, 'build-multiarch.sh'), buildScript);
        fs.chmodSync(path.join(dockerDir, 'build-multiarch.sh'), '755');
        
        console.log('✅ Docker deployment created');
    }

    async createWebAssemblyDeployment() {
        console.log('\n🕸️  Creating WebAssembly deployment...');
        
        const wasmDir = 'deploy/wasm';
        this.ensureDirectory(wasmDir);
        
        // WASM build script
        const wasmBuilder = `#!/bin/bash
# 🕸️ OriMind WebAssembly Builder
# Creates WASM version for universal browser compatibility

echo "🚀 Building OriMind WebAssembly version..."

# Install wasm-pack if not available
if ! command -v wasm-pack &> /dev/null; then
    echo "📦 Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Create WASM package structure
mkdir -p wasm-package/src

# Create Cargo.toml for Rust WASM
cat > wasm-package/Cargo.toml << 'EOF'
[package]
name = "orimind-wasm"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
web-sys = "0.3"

[dependencies.web-sys]
version = "0.3"
features = [
  "console",
  "Document",
  "Element",
  "HtmlElement",
  "Window",
]
EOF

# Create basic Rust WASM wrapper
cat > wasm-package/src/lib.rs << 'EOF'
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn start_orimind() {
    log("🚀 OriMind WASM starting...");
}

#[wasm_bindgen]
pub fn get_platform_info() -> String {
    "Universal WebAssembly".to_string()
}
EOF

# Build WASM package
cd wasm-package
wasm-pack build --target web --out-dir ../pkg

echo "✅ OriMind WebAssembly build complete!"
echo "📁 WASM files in: deploy/wasm/pkg/"
`;

        fs.writeFileSync(path.join(wasmDir, 'build-wasm.sh'), wasmBuilder);
        fs.chmodSync(path.join(wasmDir, 'build-wasm.sh'), '755');
        
        // WASM HTML wrapper
        const wasmHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>OriMind Universal - WebAssembly Edition</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 30px;
            backdrop-filter: blur(10px);
        }
        .status {
            background: rgba(0, 255, 0, 0.2);
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 OriMind Universal - WebAssembly Edition</h1>
        <p>Cross-platform AI orchestration running in your browser!</p>
        
        <div class="status" id="status">
            <p>🔄 Initializing WebAssembly...</p>
        </div>
        
        <div id="controls">
            <button onclick="startOriMind()">🚀 Start OriMind</button>
            <button onclick="showPlatformInfo()">🖥️ Platform Info</button>
        </div>
        
        <div id="output"></div>
    </div>

    <script type="module">
        import init, { start_orimind, get_platform_info } from './pkg/orimind_wasm.js';
        
        async function run() {
            await init();
            document.getElementById('status').innerHTML = '<p>✅ WebAssembly loaded successfully!</p>';
            
            window.startOriMind = () => {
                start_orimind();
                document.getElementById('output').innerHTML += '<p>🚀 OriMind started in WebAssembly mode</p>';
            };
            
            window.showPlatformInfo = () => {
                const info = get_platform_info();
                document.getElementById('output').innerHTML += \`<p>🖥️ Platform: \${info}</p>\`;
            };
        }
        
        run();
    </script>
</body>
</html>`;

        fs.writeFileSync(path.join(wasmDir, 'orimind-wasm.html'), wasmHtml);
        
        console.log('✅ WebAssembly deployment created');
    }

    async createUniversalInstaller() {
        console.log('\n🌍 Creating universal installer...');
        
        const universalInstaller = `#!/usr/bin/env node

/**
 * 🌍 OriMind Universal Cross-Platform Installer
 * One script to install on any platform and architecture
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UniversalInstaller {
    constructor() {
        this.platform = os.platform();
        this.arch = os.arch();
        this.deployDir = 'deploy';
    }

    async install() {
        console.log('🌍 OriMind Universal Cross-Platform Installer');
        console.log('==============================================');
        console.log(\`🖥️  Platform: \${this.platform}\`);
        console.log(\`🏗️  Architecture: \${this.arch}\`);
        
        try {
            switch (this.platform) {
                case 'win32':
                    await this.installWindows();
                    break;
                case 'darwin':
                    await this.installMacOS();
                    break;
                case 'linux':
                    await this.installLinux();
                    break;
                case 'freebsd':
                    await this.installFreeBSD();
                    break;
                default:
                    await this.installGeneric();
                    break;
            }
            
            console.log('🎉 Universal installation complete!');
            this.showQuickStart();
            
        } catch (error) {
            console.error('❌ Installation failed:', error.message);
            process.exit(1);
        }
    }

    async installWindows() {
        console.log('🪟 Installing for Windows...');
        const scriptPath = path.join(this.deployDir, 'windows', 'install-windows.bat');
        if (fs.existsSync(scriptPath)) {
            execSync(scriptPath, { stdio: 'inherit' });
        } else {
            console.log('⚠️  Windows installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installMacOS() {
        console.log('🍎 Installing for macOS...');
        const scriptPath = path.join(this.deployDir, 'macos', 'install-macos.sh');
        if (fs.existsSync(scriptPath)) {
            execSync(\`bash "\${scriptPath}"\`, { stdio: 'inherit' });
        } else {
            console.log('⚠️  macOS installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installLinux() {
        console.log('🐧 Installing for Linux...');
        
        // Check for PowerPC
        if (this.arch.startsWith('ppc')) {
            const ppcScript = path.join(this.deployDir, 'powerpc', 'install-powerpc.sh');
            if (fs.existsSync(ppcScript)) {
                execSync(\`bash "\${ppcScript}"\`, { stdio: 'inherit' });
                return;
            }
        }
        
        const scriptPath = path.join(this.deployDir, 'linux', 'install-linux.sh');
        if (fs.existsSync(scriptPath)) {
            execSync(\`bash "\${scriptPath}"\`, { stdio: 'inherit' });
        } else {
            console.log('⚠️  Linux installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installFreeBSD() {
        console.log('🔱 Installing for FreeBSD...');
        const scriptPath = path.join(this.deployDir, 'freebsd', 'install-freebsd.sh');
        if (fs.existsSync(scriptPath)) {
            execSync(\`sh "\${scriptPath}"\`, { stdio: 'inherit' });
        } else {
            console.log('⚠️  FreeBSD installer not found, using generic installation');
            await this.installGeneric();
        }
    }

    async installGeneric() {
        console.log('🔧 Generic installation...');
        
        // Basic Node.js check
        try {
            execSync('node --version', { stdio: 'ignore' });
            console.log('✅ Node.js found');
        } catch (e) {
            throw new Error('Node.js is required but not found. Please install Node.js first.');
        }
        
        // Install dependencies
        console.log('📦 Installing dependencies...');
        try {
            execSync('npm install', { stdio: 'inherit' });
            console.log('✅ Dependencies installed');
        } catch (e) {
            throw new Error('Failed to install dependencies');
        }
        
        console.log('✅ Generic installation complete');
    }

    showQuickStart() {
        console.log('\\n🚀 Quick Start:');
        console.log('================');
        
        switch (this.platform) {
            case 'win32':
                console.log('   Start: .\\\\start-orimind-universal.bat');
                console.log('   Stop:  .\\\\stop-orimind-universal.bat');
                break;
            default:
                console.log('   Start: ./start-orimind-universal.sh');
                console.log('   Stop:  ./stop-orimind-universal.sh');
                break;
        }
        
        console.log('\\n🌐 Access URLs (after starting):');
        console.log('   - Chi Flow Platform: http://localhost:3002');
        console.log('   - Sherlock IDE: http://localhost:3000');
        console.log('   - ReliaKit Dashboard: http://localhost:5000');
    }
}

if (require.main === module) {
    const installer = new UniversalInstaller();
    installer.install();
}

module.exports = UniversalInstaller;`;

        fs.writeFileSync('install-universal.js', universalInstaller);
        
        // Create platform detection script
        const platformDetector = `#!/bin/bash
# 🌍 OriMind Platform Detector and Auto-Installer

detect_platform() {
    local platform=$(uname -s)
    local arch=$(uname -m)
    
    case $platform in
        Linux*)
            if [ -f /etc/os-release ]; then
                . /etc/os-release
                echo "🐧 Linux: $PRETTY_NAME ($arch)"
            else
                echo "🐧 Linux: Unknown distribution ($arch)"
            fi
            ;;
        Darwin*)
            echo "🍎 macOS: $(sw_vers -productVersion) ($arch)"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            echo "🪟 Windows: $(uname -r) ($arch)"
            ;;
        FreeBSD*)
            echo "🔱 FreeBSD: $(uname -r) ($arch)"
            ;;
        *)
            echo "❓ Unknown: $platform ($arch)"
            ;;
    esac
}

echo "🌍 OriMind Universal Platform Detector"
echo "====================================="
detect_platform

echo ""
echo "🚀 Starting universal installation..."
node install-universal.js
`;

        fs.writeFileSync('detect-and-install.sh', platformDetector);
        try {
            fs.chmodSync('detect-and-install.sh', '755');
        } catch (e) {}
        
        console.log('✅ Universal installer created');
    }

    ensureDirectory(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    showDeploymentSummary() {
        console.log('\n📊 Cross-Platform Deployment Summary:');
        console.log('=====================================');
        console.log('🪟 Windows: deploy/windows/install-windows.bat');
        console.log('🍎 macOS: deploy/macos/install-macos.sh');
        console.log('🐧 Linux: deploy/linux/install-linux.sh');
        console.log('🔱 FreeBSD: deploy/freebsd/install-freebsd.sh');
        console.log('⚡ PowerPC: deploy/powerpc/install-powerpc.sh');
        console.log('🐳 Docker: deploy/docker/Dockerfile');
        console.log('🕸️  WebAssembly: deploy/wasm/orimind-wasm.html');
        console.log('');
        console.log('🌍 Universal installer: ./install-universal.js');
        console.log('🔍 Auto-detect installer: ./detect-and-install.sh');
        console.log('');
        console.log('🎯 Supported architectures:');
        console.log('   x86_64, ARM64, ARM32, PowerPC 64/32, IBM Z, RISC-V');
        console.log('');
        console.log('✨ OriMind is now truly universal!');
    }
}

// Main execution
if (require.main === module) {
    const deployer = new OriMindCrossPlatformDeployer();
    deployer.deployUniversal().catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });
}

module.exports = OriMindCrossPlatformDeployer;