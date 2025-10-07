#!/bin/bash
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
