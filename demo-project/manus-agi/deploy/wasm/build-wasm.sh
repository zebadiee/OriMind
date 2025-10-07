#!/bin/bash
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
