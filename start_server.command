#!/bin/bash

# Clear terminal screen
clear

echo "================================================================="
echo "               🚀 BRIDGEONE - STARTING LOCAL SERVER              "
echo "================================================================="
echo ""

# Navigate to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR" || exit 1

# Ensure Node/NVM environment is loaded
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
fi

# Ensure standard Node and Homebrew paths are in PATH
export PATH="/Users/macc/.nvm/versions/node/v24.18.0/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "📍 Thư mục dự án:  $DIR"
echo "⚡ Node.js:         $(node -v 2>/dev/null || echo 'Chưa tìm thấy Node')"
echo "⚡ npm:             $(npm -v 2>/dev/null || echo 'Chưa tìm thấy npm')"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Đang cài đặt thư viện (lần đầu chạy)..."
  npm install
  echo ""
fi

echo "🌐 Đang khởi chạy server tại: http://localhost:3000"
echo "👉 Bấm Ctrl + C trong cửa sổ này bất cứ lúc nào để dừng server."
echo "================================================================="
echo ""

# Start Vite dev server
npm run dev
