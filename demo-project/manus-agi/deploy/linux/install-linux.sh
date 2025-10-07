#!/bin/bash
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
