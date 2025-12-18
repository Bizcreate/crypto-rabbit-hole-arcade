# 🚀 Getting Started with Ape In! Web App

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Python 3.10+** installed ([Download](https://python.org/))
- [ ] **npm** or **yarn** package manager
- [ ] **Git** installed
- [ ] A code editor (VS Code recommended)
- [ ] (Optional) PostgreSQL for production database

## 🎯 Quick Start (5 Minutes)

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python -m app.main
```

✅ Backend should now be running at `http://localhost:8000`

Test it: Open `http://localhost:8000/health` in your browser

### Step 2: Setup Frontend

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running at `http://localhost:3000`

### Step 3: Play the Game!

1. Open your browser to `http://localhost:3000`
2. Click on any game mode (start with **Sandy** for tutorial)
3. Draw cards, roll dice, and stack your sats!

## 🎮 First Game Walkthrough

### Playing Against Sandy (Tutorial Mode)

1. **Click "Sandy"** on the home page
2. **Draw a Card**: Click the "Draw Card" button
3. **Roll Dice**: After drawing, click "Roll Dice"
   - 2-6 = Success! Keep your sats
   - 1 = Bust! Lose your turn sats
4. **Stack or Continue**: 
   - Click "Stack Sats" to save your score
   - Or draw again to risk it for more points!
5. **Win Condition**: First to 150 sats wins!

## 🔧 Configuration

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

**Get ThirdWeb Client ID:**
1. Go to [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project
3. Copy your Client ID
4. Paste it in the `.env` file

### Backend Configuration

The backend works out-of-the-box with SQLite! For production, create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ape_in_game
SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## 🎴 Adding Card Images

Your card images are in `assets/cards/`. To use them:

### Option 1: Serve from Backend (Simple)

1. Move `assets/cards/` to `backend/app/static/cards/`
2. Update `backend/app/main.py`:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/assets", StaticFiles(directory="app/static"), name="static")
```

### Option 2: Host on CDN (Recommended)

1. Upload images to AWS S3, Cloudinary, or similar
2. Update image URLs in `backend/app/game_logic/cards.py`

## 🐛 Troubleshooting

### Backend won't start

```bash
# Make sure you're in the virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check Python version
python --version  # Should be 3.10+
```

### Frontend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Database errors

```bash
# Delete the database and let it recreate
rm backend/ape_in_game.db

# Restart backend
cd backend
python -m app.main
```

### CORS errors

Make sure your backend `.env` has the correct CORS_ORIGINS:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📱 Testing Different Features

### Test Leaderboard
1. Play a few games
2. Navigate to `/leaderboard`
3. See your stats (requires wallet connection for persistence)

### Test PvP Mode
1. Open two browser windows
2. Click "PvP" in first window
3. Join with second window (coming soon - needs game ID sharing)

### Test Wallet Connection
1. Click "Connect Wallet" in header
2. Choose your wallet provider
3. Your wallet address appears in leaderboard

## 🚀 Next Steps

### For Development

1. **Customize Styling**: Edit `frontend/src/index.css`
2. **Add Features**: Check `TODO` comments in code
3. **Test AI Opponents**: Try different difficulty levels
4. **Implement Tournament**: See `backend/app/services/tournament_service.py`

### For Production

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   # Use provided Dockerfile or platform-specific deploy
   ```

3. **Setup PostgreSQL**:
   ```bash
   # Update DATABASE_URL in .env
   DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
   ```

4. **Configure Domain**: Update CORS_ORIGINS with your domain

## 📚 Learn More

- **Frontend**: React, TypeScript, TailwindCSS
  - Components: `frontend/src/components/`
  - Pages: `frontend/src/pages/`
  - State: `frontend/src/store/gameStore.ts`

- **Backend**: FastAPI, SQLAlchemy, WebSockets
  - API Routes: `backend/app/api/`
  - Game Logic: `backend/app/game_logic/`
  - Database Models: `backend/app/models/`

## 💡 Pro Tips

1. **Use React DevTools** for debugging frontend state
2. **Check FastAPI Docs** at `http://localhost:8000/docs` for API testing
3. **Enable Hot Reload** - both servers auto-reload on file changes
4. **Check Logs** - Console output shows API calls and errors
5. **Start Simple** - Test single-player modes before PvP

## 🎨 Customization Ideas

- Change color scheme in `frontend/tailwind.config.js`
- Adjust game difficulty in AI opponent logic
- Modify card probabilities in `backend/app/game_logic/cards.py`
- Add sound effects using Web Audio API
- Create custom card designs

## 🤝 Need Help?

- Check `README.md` for detailed documentation
- Read `MIGRATION_GUIDE.md` to understand the conversion
- Explore code comments for inline documentation
- Test API at `http://localhost:8000/docs`

---

**Ready to start?** Run both servers and visit `http://localhost:3000`! 🎮

Happy Gaming! 🚀

























