#!/bin/bash
# Auto-deploy script for CVA Sync Backend

echo "====================================="
echo "   CVA Sync Backend Auto-Deploy      "
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "[!] Node.js is not installed. Installing Node.js via NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
else
    echo "[V] Node.js is already installed: $(node -v)"
fi

# Check if pm2 is installed
if ! command -v pm2 &> /dev/null
then
    echo "[!] PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
else
    echo "[V] PM2 is already installed."
fi

# Install backend dependencies
echo "[*] Installing backend dependencies..."
npm install

# Start or restart the server using PM2
echo "[*] Starting/Restarting server via PM2..."
pm2 restart cva-sync-backend || pm2 start server.js --name cva-sync-backend

# Save PM2 state to resurrect on reboot
pm2 save

echo "====================================="
echo "  [SUCCESS] Backend is running!      "
echo "  Port: 3000 (Make sure to open it)  "
echo "====================================="
