#!/bin/bash

echo "🎮 =========================================="
echo "🎮   Starting Ape In! with Enhanced UI"
echo "🎮 =========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the ape-in-bot directory"
    exit 1
fi

echo "✨ Starting with World-Class UI/UX..."
echo ""
echo "Features enabled:"
echo "  ✅ Floating particle background"
echo "  ✅ 3D tilting game cards"
echo "  ✅ Animated glow effects"
echo "  ✅ Premium materials"
echo "  ✅ Smooth 60fps animations"
echo ""

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend API..."
    cd backend
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt --quiet 2>&1 | grep -v "Requirement already satisfied" || true
    python -m app.main &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started (PID: $BACKEND_PID)"
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend with Enhanced UI..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        npm install --silent
    fi
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
}

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Kill any remaining processes
    pkill -f "python -m app.main" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    echo "👋 Shutdown complete"
    exit 0
}

# Set up trap for Ctrl+C
trap cleanup SIGINT SIGTERM

# Start services
start_backend
sleep 3
start_frontend

echo ""
echo "🎉 =========================================="
echo "🎉   Ape In! is Running!"
echo "🎉 =========================================="
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "🎮 Open http://localhost:3000 in your browser!"
echo ""
echo "✨ Enhanced UI Features:"
echo "   • Hover over game mode cards to see 3D tilt"
echo "   • Watch the floating particle background"
echo "   • See the animated glow effects"
echo "   • Experience smooth 60fps animations"
echo ""
echo "Press Ctrl+C to stop both servers..."
echo ""

# Wait for processes
wait
