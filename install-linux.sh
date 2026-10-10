#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  Helium Browser Linux Installer"
echo "=========================================="

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/256x256/apps"

mkdir -p "$BIN_DIR" "$DESKTOP_DIR" "$ICON_DIR"

echo "1. Installing dependencies and building Helium..."
cd "$APP_DIR"
npm install
npm run build

echo "2. Installing Helium icon..."
cp "$APP_DIR/resources/branding/app_icon/raw.png" "$ICON_DIR/helium-browser.png" 2>/dev/null || true

echo "3. Creating launcher binary at $BIN_DIR/helium-browser..."
cat << 'EOF' > "$BIN_DIR/helium-browser"
#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# Look for application dir
APP_PATH="$(grep -m1 '^Path=' "$HOME/.local/share/applications/helium-browser.desktop" 2>/dev/null | cut -d= -f2 || echo "$DIR")"
cd "$APP_PATH"
npm start
EOF
chmod +x "$BIN_DIR/helium-browser"

echo "4. Creating desktop menu launcher at $DESKTOP_DIR/helium-browser.desktop..."
cat << EOF > "$DESKTOP_DIR/helium-browser.desktop"
[Desktop Entry]
Name=Helium Browser
Comment=Privacy-first Chromium browser with Ask Gemini side panel and Zen mode
Exec=$BIN_DIR/helium-browser
Icon=helium-browser
Terminal=false
Type=Application
Categories=Network;WebBrowser;
Path=$APP_DIR
StartupNotify=true
EOF

echo "5. Updating desktop database..."
update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true

echo ""
echo "=========================================="
echo " Installation Complete!"
echo "=========================================="
echo "You can now launch Helium Browser in Linux by:"
echo "  1. Searching for 'Helium Browser' in your Application Menu (GNOME, KDE, etc.)"
echo "  2. Running: ~/.local/bin/helium-browser"
echo "  3. Or running 'npm start' in this directory"
echo "=========================================="
