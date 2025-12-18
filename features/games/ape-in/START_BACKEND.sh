#!/bin/bash

echo "🎮 =========================================="
echo "🎮   Starting Ape In! Backend Server"
echo "🎮 =========================================="
echo ""

cd /home/apedev/ape-in-bot/backend

# Step 1: Install system dependencies
echo "📦 Installing Python system dependencies..."
sudo apt update
sudo apt install python3-pip python3-venv python3-full -y

# Step 2: Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create venv. Trying alternative..."
        virtualenv venv -p python3
    fi
fi

# Step 3: Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Step 4: Install Python packages
echo "📥 Installing Python packages..."
pip install -r requirements.txt

echo ""
echo "✅ =========================================="
echo "✅   Backend Ready - Starting Server"
echo "✅ =========================================="
echo ""
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo ""
echo "📍 API Documentation: http://localhost:8000/docs"
echo "📍 Health Check: http://localhost:8000/health"
echo ""
echo "🎮 Go to http://localhost:3000 to play!"
echo ""

# Step 5: Start the server
python -m app.main
