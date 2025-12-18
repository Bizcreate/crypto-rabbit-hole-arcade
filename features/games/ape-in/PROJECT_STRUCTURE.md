# 📁 Ape In! Project Structure

## Clean Project Layout

```
ape-in-bot/
│
├── 📱 frontend/                    # React Web Application
│   ├── public/
│   │   └── assets/
│   │       └── cards/             # 44 card images (copied here)
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── Card.tsx          # Card display component
│   │   │   ├── Dice.tsx          # Dice component
│   │   │   ├── GameBoard.tsx     # Main game interface
│   │   │   └── Header.tsx        # Navigation header
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.tsx      # Mode selection
│   │   │   ├── GamePage.tsx      # Game page
│   │   │   └── LeaderboardPage.tsx
│   │   ├── services/             # API clients
│   │   │   ├── api.ts           # REST API
│   │   │   └── websocket.ts     # WebSocket
│   │   ├── store/               # State management
│   │   │   └── gameStore.ts     # Zustand store
│   │   ├── types/               # TypeScript types
│   │   │   └── game.ts
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── Dockerfile               # Frontend container
│   ├── nginx.conf              # Nginx config
│   ├── package.json            # Dependencies
│   ├── tailwind.config.js      # Styling config
│   └── vite.config.ts          # Build config
│
├── 🔧 backend/                     # FastAPI Server
│   ├── app/
│   │   ├── api/                  # REST endpoints
│   │   │   ├── game.py          # Game routes
│   │   │   └── leaderboard.py   # Leaderboard routes
│   │   ├── database/            # Database layer
│   │   │   └── database.py      # DB config
│   │   ├── game_logic/          # Core game logic
│   │   │   ├── cards.py         # Card mechanics
│   │   │   ├── dice.py          # Dice mechanics
│   │   │   └── __init__.py
│   │   ├── models/              # Database models
│   │   │   ├── game.py          # SQLAlchemy models
│   │   │   └── __init__.py
│   │   ├── services/            # Business logic
│   │   │   ├── game_service.py  # Game management
│   │   │   ├── tournament_service.py
│   │   │   └── __init__.py
│   │   ├── websockets/          # WebSocket handlers
│   │   │   ├── game_ws.py
│   │   │   └── __init__.py
│   │   ├── config.py            # Settings
│   │   ├── main.py              # FastAPI app
│   │   └── __init__.py
│   ├── Dockerfile               # Backend container
│   ├── requirements.txt         # Python deps
│   └── run.sh                  # Run script
│
├── 🎴 assets/                      # Original card images (source)
│   └── cards/                    # 44 card JPG files
│
├── 📦 discord-bot-backup/          # Original Discord bot (backup)
│   ├── bots/                    # Discord cogs
│   ├── cogs/                    # Commands
│   ├── game_logic/              # Old game logic
│   ├── routers/                 # Discord routers
│   ├── utils/                   # Utilities
│   ├── views/                   # Discord views
│   ├── data/                    # JSON files
│   ├── main.py                  # Bot entry point
│   └── README.md                # Backup info
│
├── 📄 Documentation
│   ├── README.md                # Main documentation
│   ├── GETTING_STARTED.md       # Quick start guide
│   ├── MIGRATION_GUIDE.md       # Conversion details
│   ├── CONVERSION_SUMMARY.md    # Complete feature list
│   └── PROJECT_STRUCTURE.md     # This file
│
├── 🐳 Docker Configuration
│   ├── docker-compose.yml       # Full stack orchestration
│   ├── frontend/Dockerfile      # Frontend image
│   └── backend/Dockerfile       # Backend image
│
└── 🔧 Root Configuration
    └── .gitignore               # Git ignore rules

```

## File Count Summary

### Frontend
- **Components**: 4 React components
- **Pages**: 3 page components
- **Services**: 2 service files
- **Config Files**: 5 (package.json, tailwind, vite, tsconfig, etc.)
- **Total**: ~20 TypeScript/React files

### Backend
- **API Routes**: 2 route files
- **Game Logic**: 3 core logic files
- **Models**: 2 model files
- **Services**: 3 service files
- **WebSockets**: 2 WebSocket files
- **Config Files**: 3 (main.py, config.py, requirements.txt)
- **Total**: ~15 Python files

### Assets
- **Card Images**: 44 JPG files
  - 20 Cipher cards
  - 12 Oracle cards
  - 5 Historacle cards
  - 3 Bearish cards
  - 1 Special card (Ape In!)
  - 3 Additional cards

### Documentation
- **Guides**: 5 markdown files

### Total Active Files
- **~80 files** in active project
- **~50 files** in Discord bot backup

## Key Differences from Original

### ✅ Removed (Discord-specific)
- ❌ Discord.py bot files
- ❌ Discord views and buttons
- ❌ Thread management
- ❌ Discord embeds
- ❌ C# files (obj/, Program.cs)
- ❌ JSON data files (moved to database)

### ✅ Added (Web-specific)
- ✅ React frontend application
- ✅ FastAPI backend server
- ✅ Database models (SQLAlchemy)
- ✅ WebSocket support
- ✅ Docker configuration
- ✅ Comprehensive documentation

### ✅ Preserved (Core game)
- ✅ Card mechanics and images
- ✅ Dice rolling system
- ✅ AI opponent logic
- ✅ Scoring system
- ✅ Game rules

## Directory Purposes

| Directory | Purpose | Size |
|-----------|---------|------|
| `frontend/` | React web app | ~2 MB |
| `backend/` | FastAPI server | ~100 KB |
| `assets/` | Source card images | ~5 MB |
| `discord-bot-backup/` | Original bot (reference) | ~500 KB |
| `node_modules/` | Frontend deps | ~200 MB |
| Documentation | Guides and docs | ~50 KB |

## Environment Files

### Frontend `.env`
```
VITE_THIRDWEB_CLIENT_ID=xxx
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Backend `.env`
```
DATABASE_URL=sqlite+aiosqlite:///./ape_in_game.db
SECRET_KEY=xxx
CORS_ORIGINS=http://localhost:3000
```

## Build Artifacts (Gitignored)

- `frontend/node_modules/` - NPM packages
- `frontend/dist/` - Production build
- `backend/venv/` - Python virtual env
- `backend/ape_in_game.db` - SQLite database
- `backend/__pycache__/` - Python cache

## Quick Navigation

### To start development:
```bash
# Backend
cd backend && python -m app.main

# Frontend
cd frontend && npm run dev
```

### To build for production:
```bash
# Frontend
cd frontend && npm run build

# Docker
docker-compose up --build
```

### To access documentation:
- **Setup**: `GETTING_STARTED.md`
- **Migration**: `MIGRATION_GUIDE.md`
- **Features**: `CONVERSION_SUMMARY.md`
- **API**: `http://localhost:8000/docs`

---

**Last Updated**: After cleanup and reorganization
**Status**: ✅ Clean, organized, production-ready

























