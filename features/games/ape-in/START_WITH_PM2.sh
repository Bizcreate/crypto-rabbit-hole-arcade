#!/bin/bash

echo "🚀 Starting Ape In! with PM2 Process Manager"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop any existing PM2 processes
pm2 delete all 2>/dev/null || true

# Make sure backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "📦 Setting up backend virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Make sure frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start with PM2
echo "🚀 Starting services with PM2..."
pm2 start ecosystem.config.js

echo ""
echo "✅ Services started!"
echo ""
echo "📊 View logs: pm2 logs"
echo "📊 View status: pm2 status"
echo "🛑 Stop all: pm2 stop all"
echo "🔄 Restart: pm2 restart all"
echo ""
echo "🎮 Open http://localhost:3000 to play!"
echo ""

