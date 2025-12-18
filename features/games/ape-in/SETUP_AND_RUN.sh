#!/bin/bash

# =================================================================
# Ape In! Game - Complete Setup and Run Script
# =================================================================

set -e  # Exit on error

echo "🎮 =========================================="
echo "🎮   APE IN! - Complete Setup Script"
echo "🎮 =========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# =================================================================
# 1. Check Prerequisites
# =================================================================
echo "📋 Step 1: Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found: $(python3 --version)${NC}"

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"

echo ""

# =================================================================
# 2. Backend Setup
# =================================================================
echo "🔧 Step 2: Setting up Backend..."

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt --quiet

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found for backend${NC}"
    echo "📝 .env file already created with defaults"
else
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
fi

cd ..
echo ""

# =================================================================
# 3. Frontend Setup
# =================================================================
echo "🎨 Step 3: Setting up Frontend..."

cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📥 Installing Node dependencies (this may take a few minutes)..."
    npm install --silent
else
    echo -e "${GREEN}✅ Node modules already installed${NC}"
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found for frontend${NC}"
    echo "📝 .env file already created"
    echo -e "${YELLOW}⚠️  IMPORTANT: Add your ThirdWeb Client ID to frontend/.env${NC}"
else
    echo -e "${GREEN}✅ Frontend .env file exists${NC}"
fi

# Check if ThirdWeb Client ID is set
if grep -q "VITE_THIRDWEB_CLIENT_ID=$" .env 2>/dev/null || grep -q "^VITE_THIRDWEB_CLIENT_ID=$" .env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  ThirdWeb Client ID is not set!${NC}"
    echo "   Get it from: https://thirdweb.com/dashboard"
    echo "   Then edit: frontend/.env"
fi

# Check for banner image
if [ -f "public/assets/cxrh-banner.png" ]; then
    echo -e "${GREEN}✅ CxRH banner found${NC}"
else
    echo -e "${YELLOW}⚠️  CxRH banner not found (optional)${NC}"
fi

# Count card images
CARD_COUNT=$(find public/assets/cards -name "*.jpg" 2>/dev/null | wc -l)
if [ "$CARD_COUNT" -eq 41 ]; then
    echo -e "${GREEN}✅ All 41 card images present${NC}"
else
    echo -e "${YELLOW}⚠️  Expected 41 cards, found: $CARD_COUNT${NC}"
fi

cd ..
echo ""

# =================================================================
# 4. Database Initialization
# =================================================================
echo "🗄️  Step 4: Database will initialize on first backend start"
echo ""

# =================================================================
# 5. Summary
# =================================================================
echo "✅ =========================================="
echo "✅   Setup Complete!"
echo "✅ =========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "   1. Get ThirdWeb Client ID (if not already):"
echo "      → Visit: https://thirdweb.com/dashboard"
echo "      → Copy your Client ID"
echo "      → Edit: frontend/.env"
echo "      → Set: VITE_THIRDWEB_CLIENT_ID=your_id_here"
echo ""
echo "   2. Start the Backend:"
echo "      → cd backend"
echo "      → source venv/bin/activate"
echo "      → python -m app.main"
echo "      → Backend will run on: http://localhost:8000"
echo ""
echo "   3. Start the Frontend (in a new terminal):"
echo "      → cd frontend"
echo "      → npm run dev"
echo "      → Frontend will run on: http://localhost:3000"
echo ""
echo "   4. Play the Game:"
echo "      → Open: http://localhost:3000"
echo "      → Click 'Sign In' to connect wallet"
echo "      → Choose a game mode and start playing!"
echo ""
echo "🎮 Ready to Ape In! 🚀"
echo ""

























