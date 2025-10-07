#!/bin/bash
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
cd "\$(dirname "\$0")/../../.."
./start-orimind-universal.sh
EOF

chmod +x "$APP_DIR/Contents/MacOS/OriMind"

echo "✅ OriMind.app created"
