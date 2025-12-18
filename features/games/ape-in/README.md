# 🎮 Ape In! - Push Your Luck Card & Dice Game

A high-stakes card and dice game where you battle AI opponents, dodge bearish penalties, and stack sats to win!

## 🎯 Features

### ✅ Fully Working
- **5 Unique AI Bots** with different difficulties (Sandy → EnJ1n)
- **Wallet Integration** via ThirdWeb (MetaMask, Coinbase, etc.)
- **Live Leaderboard** with stats tracking
- **Compact Mobile-Friendly UI** with floating overlays
- **Smart Animations** and visual feedback
- **Bearish Card Mechanics** with dodge system
- **Ape In! Special Cards** for 2x multipliers

### 🔜 Coming Soon
- PvP Mode (player vs player)
- Multiplayer Mode (3-10 players)
- Tournament Mode (brackets)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Git

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd ape-in-bot

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Open Game
Visit: http://localhost:3000

---

## 🌐 Deploy to Production

### Option 1: One-Command Deploy (Recommended)
```bash
./deploy-to-vercel.sh
```

### Option 2: Manual Vercel Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Deploy backend to Railway
# Visit: https://railway.app
# Click "Deploy from GitHub"
# Select backend folder
```

See **VERCEL_DEPLOY_NOW.md** for detailed instructions.

---

## 🤖 Game Modes

| Bot | Difficulty | Target Score | Rounds | Strategy |
|-----|-----------|--------------|--------|----------|
| 🟡 Sandy | Tutorial | 150 sats | 10 | Conservative |
| 🟣 Aida | Medium | 200 sats | 12 | Balanced |
| 🟠 Nifty | Med-Hard | 180 sats | 12 | Variable |
| 🔵 Lana | Hard | 250 sats | 15 | Aggressive |
| 🔴 EnJ1n | Expert | 300 sats | 18 | Extreme |

---

## 🎮 How to Play

1. **Draw Card** - Click deck to draw a card
2. **Roll Dice** - Roll to determine success
3. **Stack Sats** - Save your score and end turn
4. **Dodge Bears** - Roll even (2,4,6) to dodge penalties
5. **Use Ape In!** - Special cards double your next card value

**Win Condition**: First to target score OR highest score after max rounds

---

##  Configuration

### Frontend Environment Variables
Create `frontend/.env`:
```env
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
VITE_API_URL=http://localhost:8000
```

For production:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend Environment Variables
Create `backend/.env`:
```env
DATABASE_URL=sqlite+aiosqlite:///./ape_in_game.db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

---

## 📁 Project Structure

```
ape-in-bot/
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & WebSocket
│   │   ├── store/           # State management
│   │   └── lib/             # ThirdWeb config
│   ├── public/              # Static assets
│   └── vercel.json          # Vercel config
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── game_logic/      # Game mechanics
│   │   └── websockets/      # WebSocket handlers
│   ├── requirements.txt     # Python dependencies
│   └── Procfile             # Railway/Render config
│
└── discord-bot-backup/      # Reference Discord bot code
```

---

## 🔧 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- ThirdWeb (wallet integration)
- Zustand (state management)

**Backend:**
- FastAPI
- SQLAlchemy (async)
- SQLite / PostgreSQL
- WebSockets
- Pydantic

---

## 📚 Documentation

- **BOT_CONFIGURATIONS.md** - All bot stats and strategies
- **DEPLOYMENT_STRATEGY.md** - Deployment options and recommendations
- **VERCEL_DEPLOY_NOW.md** - Step-by-step Vercel guide
- **WALLET_QUICKSTART.md** - ThirdWeb setup
- **SESSION_SUMMARY.md** - Recent changes and fixes

---

## 🧪 Testing

### Test All Bots
```bash
# Backend must be running
python3 /tmp/test_all_bots.py
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Create game
curl -X POST http://localhost:8000/api/game/create \
  -H "Content-Type: application/json" \
  -d '{"mode":"sandy","playerName":"Test","walletAddress":null}'

# Get leaderboard
curl http://localhost:8000/api/leaderboard/
```

---

## 🐛 Troubleshooting

### Blank Page?
- Check browser console (F12) for errors
- Verify both servers are running
- Check CORS settings if API calls fail

### Backend Won't Start?
```bash
cd backend
source venv/bin/activate
python -c "from app.config import settings; print('Config OK')"
```

### Frontend Build Fails?
```bash
cd frontend
npm run build
# Check for TypeScript or import errors
```

---

## 🚀 Ready to Deploy!

**One-command deploy:**
```bash
./deploy-to-vercel.sh
```

Or see **VERCEL_DEPLOY_NOW.md** for full instructions.

---

## 📧 Support

- Documentation in `/docs` folder
- Check SESSION_SUMMARY.md for recent changes
- All 5 bots tested and working!

---

**Built with ❤️ for the Ape In! community** 🎮🚀
