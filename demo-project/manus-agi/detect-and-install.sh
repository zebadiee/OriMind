#!/bin/bash
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
