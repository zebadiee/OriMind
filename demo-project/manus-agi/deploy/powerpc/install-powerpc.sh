#!/bin/bash
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
