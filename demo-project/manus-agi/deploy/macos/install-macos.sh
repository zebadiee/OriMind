#!/bin/bash
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
        echo "Or install Homebrew first: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
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
