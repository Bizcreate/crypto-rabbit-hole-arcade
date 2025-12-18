# 🔄 Migration Guide: Discord Bot → Web Application

This guide explains the major changes from the Discord bot to the web application.

## 🏗️ Architecture Changes

### Before (Discord Bot)
```
Discord Bot
├── Bot Commands
├── Discord Views/Buttons
├── Thread Management
└── Discord Message Handling
```

### After (Web Application)
```
Web Application
├── Frontend (React)
│   ├── UI Components
│   ├── State Management
│   └── API/WebSocket Client
│
└── Backend (FastAPI)
    ├── REST API
    ├── WebSocket Server
    ├── Game Logic
    └── Database
```

## 📋 Key Changes

### 1. User Interface
- **Before**: Discord messages, embeds, and buttons
- **After**: React components with beautiful UI, animations, and responsive design

### 2. State Management
- **Before**: In-memory Python dictionaries tied to Discord threads
- **After**: 
  - Frontend: Zustand store for UI state
  - Backend: SQLAlchemy database for persistence

### 3. Real-time Communication
- **Before**: Discord bot events and interactions
- **After**: REST API + WebSockets for real-time updates

### 4. Authentication
- **Before**: Discord user authentication
- **After**: ThirdWeb wallet connection (blockchain-based)

### 5. Game Sessions
- **Before**: Discord threads (one per game)
- **After**: Database-backed game sessions with unique IDs

## 🗂️ Code Mapping

### Game Logic (Mostly Unchanged)

| Discord Bot | Web App |
|-------------|---------|
| `game_logic/draw_card.py` | `backend/app/game_logic/cards.py` |
| `game_logic/roll_dice.py` | `backend/app/game_logic/dice.py` |
| `game_logic/*_game.py` | `backend/app/services/game_service.py` |

### Card/Dice Configuration

| Discord Bot | Web App |
|-------------|---------|
| `utils/card_config.py` | `backend/app/game_logic/cards.py` |
| `utils/dice_config.py` | `backend/app/game_logic/dice.py` |

### Leaderboard

| Discord Bot | Web App |
|-------------|---------|
| `data/leaderboard.json` | PostgreSQL/SQLite database |
| `utils/leaderboard_store.py` | `backend/app/api/leaderboard.py` |
| `views/leaderboard_view.py` | `frontend/src/pages/LeaderboardPage.tsx` |

### Bot Opponents

| Discord Bot | Web App |
|-------------|---------|
| `bots/sandy_bot.py` | `backend/app/services/game_service.py` (AI logic) |
| `bots/aida_bot.py` | Same AI logic, different interface |
| `bots/lana_bot.py` | Dice weights preserved |
| `bots/enj1n_bot.py` | Behavior logic maintained |

## 🔧 Feature Equivalents

### Main Menu
- **Before**: `views/main_menu_view.py` - Discord button menu
- **After**: `frontend/src/pages/HomePage.tsx` - Web game mode selection

### Game Board
- **Before**: `views/draw_card_view.py`, `views/dice_roll_view.py`
- **After**: `frontend/src/components/GameBoard.tsx` - Interactive web game board

### PvP/Multiplayer
- **Before**: Discord interactions with thread-based coordination
- **After**: WebSocket-based real-time multiplayer

## 📦 Data Migration

If you want to migrate existing leaderboard data:

```python
# Example migration script
import json
import asyncio
from backend.app.database import get_db, init_db
from backend.app.models import LeaderboardEntry

async def migrate_leaderboard():
    # Initialize database
    await init_db()
    
    # Read old data
    with open('data/leaderboard.json', 'r') as f:
        old_data = json.load(f)
    
    # Convert to new format
    async with get_db() as db:
        for discord_id, stats in old_data.items():
            entry = LeaderboardEntry(
                player_name=stats.get('name', 'Unknown'),
                total_wins=stats.get('wins', 0),
                total_losses=stats.get('losses', 0),
                total_games=stats.get('games', 0),
                high_score=stats.get('high_score', 0),
                total_score=stats.get('total_score', 0)
            )
            db.add(entry)
        await db.commit()

# Run migration
asyncio.run(migrate_leaderboard())
```

## 🎮 Gameplay Changes

### User Flow Comparison

**Discord Bot:**
1. User types command or clicks button
2. Bot creates thread
3. Game plays in thread
4. Thread deleted when done

**Web App:**
1. User connects wallet (optional)
2. Selects game mode from home page
3. Game plays in browser
4. Can play again instantly

### Game Mechanics (UNCHANGED)
- ✅ Card drawing logic identical
- ✅ Dice rolling weights preserved
- ✅ Scoring system same
- ✅ Bearish card effects identical
- ✅ Ape In! mechanic works the same
- ✅ AI opponent behaviors maintained

## 🚀 Deployment Differences

### Discord Bot Hosting
- Single server running Discord.py
- Requires Discord bot token
- Limited to Discord users

### Web App Hosting
- **Frontend**: Static hosting (Vercel, Netlify, etc.)
- **Backend**: Server hosting (Railway, Heroku, DigitalOcean)
- **Database**: PostgreSQL or SQLite
- Available to anyone with a browser!

## 🔐 Environment Variables

### Before (.env)
```env
DISCORD_TOKEN=your_discord_token
```

### After

**Frontend (.env)**
```env
VITE_THIRDWEB_CLIENT_ID=your_client_id
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

**Backend (.env)**
```env
DATABASE_URL=sqlite+aiosqlite:///./ape_in_game.db
SECRET_KEY=your_secret_key
CORS_ORIGINS=http://localhost:3000
```

## ✨ New Features Enabled

The web app architecture enables:

1. **Better UX**: Beautiful UI with animations
2. **Global Access**: No Discord required
3. **Wallet Integration**: Blockchain features
4. **Mobile Support**: Responsive design
5. **Analytics**: Better game tracking
6. **Scalability**: Horizontal scaling possible
7. **SEO**: Can be indexed by search engines

## 📝 What Wasn't Migrated

These Discord-specific features were intentionally left out:

- ❌ Discord roles/permissions
- ❌ Thread management
- ❌ Discord embeds
- ❌ Discord-specific commands
- ❌ Server-specific features

## 🎯 Next Steps

1. **Test All Features**: Verify game logic works correctly
2. **Add Card Images**: Move card images to proper location
3. **Configure ThirdWeb**: Set up wallet integration
4. **Deploy**: Choose hosting providers
5. **Monitor**: Set up error tracking and analytics

## 💡 Tips

- The core game logic is nearly identical - bugs/features from Discord bot should behave the same
- AI opponent behaviors are preserved through dice weight profiles
- Leaderboard now supports wallet addresses for blockchain integration
- WebSocket enables smoother multiplayer than Discord's rate limits

---

**Questions?** Check the main README.md for setup instructions!

























