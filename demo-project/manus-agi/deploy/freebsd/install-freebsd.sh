#!/bin/sh
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
