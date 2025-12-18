# ⚡ What You Need to Add - Quick Reference

## 🎯 ONLY 1 THING REQUIRED TO START PLAYING!

---

## ✅ WHAT'S ALREADY DONE

- ✅ **Backend API** - Fully functional with all endpoints
- ✅ **Frontend UI** - Beautiful game interface with animations
- ✅ **Game Logic** - All mechanics ported and working
- ✅ **AI Opponents** - All 5 bots ready (Sandy, Aida, Lana, En-J1n, Nifty)
- ✅ **Card System** - All 41 cards present and configured
- ✅ **CxRH Banner** - Added to homepage
- ✅ **Database** - Auto-initializes on startup
- ✅ **Wallet Integration** - ThirdWeb v5 SDK installed
- ✅ **Documentation** - Complete guides and setup scripts
- ✅ **Environment Files** - Created with defaults

---

## ❗ WHAT YOU MUST ADD

### 1. ThirdWeb Client ID (REQUIRED - 2 minutes)

**Why?** Enables Gmail social login and wallet functionality

**How to Get:**
```bash
1. Visit: https://thirdweb.com/dashboard
2. Sign in or create account
3. Click "Create API Key" or navigate to Settings
4. Copy your Client ID
```

**Where to Add:**
```bash
# Edit this file:
frontend/.env

# Add your Client ID here (replace the empty value):
VITE_THIRDWEB_CLIENT_ID=your_actual_client_id_here
```

**Enable Google Login:**
```bash
1. Go to ThirdWeb Dashboard
2. Navigate to "Embedded Wallets" or "In-App Wallets"
3. Enable "Google" authentication
4. Save settings
```

---

## 🚀 QUICK START (After Adding Client ID)

### Option 1: Use Setup Script (Recommended)
```bash
cd /home/apedev/ape-in-bot
./SETUP_AND_RUN.sh
```

This will:
- Check prerequisites
- Setup backend virtual environment
- Install all dependencies
- Verify configuration
- Show you what to do next

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app.main
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

**Browser:**
```
Open: http://localhost:3000
```

---

## 📋 CONFIGURATION FILES

### Frontend Environment (`frontend/.env`)
```env
# ⚠️  ADD YOUR CLIENT ID HERE ⚠️
VITE_THIRDWEB_CLIENT_ID=

# These are already set correctly:
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Backend Environment (`backend/.env`)
```env
# ✅ All set! No changes needed for development

# Database (SQLite - no setup needed)
DATABASE_URL=sqlite+aiosqlite:///./ape_in_game.db

# Security (OK for development)
SECRET_KEY=dev-secret-key-change-in-production

# CORS (configured for local dev)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## ✅ VERIFICATION CHECKLIST

Before starting, verify:

```bash
# 1. Check Python installed
python3 --version
# Should show: Python 3.10 or higher

# 2. Check Node installed
node --version
# Should show: Node 18 or higher

# 3. Check npm installed
npm --version
# Should show: npm 8 or higher

# 4. Check CxRH banner exists
ls -la frontend/public/assets/cxrh-banner.png
# Should show the file

# 5. Check card images
ls frontend/public/assets/cards/*.jpg | wc -l
# Should show: 41

# 6. Verify .env files exist
ls backend/.env frontend/.env
# Should show both files

# 7. Check ThirdWeb Client ID (MUST DO)
cat frontend/.env | grep VITE_THIRDWEB_CLIENT_ID
# Should show your Client ID (not empty!)
```

---

## 🎮 WHAT WORKS OUT OF THE BOX

### Without ThirdWeb Client ID:
- ✅ View homepage
- ✅ See game modes
- ✅ Read instructions
- ⚠️  **Cannot sign in** (need Client ID)
- ⚠️  **Cannot play games** (need to be signed in)

### With ThirdWeb Client ID:
- ✅ Sign in with Gmail
- ✅ Wallet address displays
- ✅ Play all game modes
- ✅ AI opponents work
- ✅ Leaderboard tracking
- ✅ Full game functionality

---

## 🐛 TROUBLESHOOTING

### "ThirdWeb Client ID not found"
```bash
# Solution:
1. Edit: frontend/.env
2. Add: VITE_THIRDWEB_CLIENT_ID=your_id
3. Restart frontend: npm run dev
```

### "Cannot connect to backend"
```bash
# Solution:
1. Check backend is running on port 8000
2. Check VITE_API_URL in frontend/.env
3. Restart both servers
```

### "Google login not available"
```bash
# Solution:
1. Go to ThirdWeb Dashboard
2. Enable Google in Embedded Wallets
3. Save and refresh browser
```

### "Card images not loading"
```bash
# Solution:
1. Verify: frontend/public/assets/cards/ has 41 .jpg files
2. Restart frontend server
3. Clear browser cache
```

---

## 📚 DOCUMENTATION

### Quick Reference
- **2-min setup**: `QUICK_START_WALLET.md`
- **Testing**: `TEST_WALLET_INTEGRATION.md`
- **Complete audit**: `COMPREHENSIVE_AUDIT.md`

### Detailed Guides
- **Main README**: `README.md`
- **Getting Started**: `GETTING_STARTED.md`
- **ThirdWeb Setup**: `frontend/THIRDWEB_SETUP.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`

---

## 🎯 SUMMARY

### What You Have:
✅ Complete playable game (95% done)
✅ Beautiful UI with CxRH banner
✅ All game mechanics working
✅ Wallet integration ready
✅ Database configured
✅ Documentation complete

### What You Need:
❗ ThirdWeb Client ID (2 minutes to get)

### Steps to Play:
1. Get ThirdWeb Client ID → https://thirdweb.com/dashboard
2. Add to `frontend/.env`
3. Enable Google in ThirdWeb Dashboard
4. Run `./SETUP_AND_RUN.sh`
5. Start backend and frontend
6. Play! 🎮

---

**Total Time to First Game: ~10 minutes** ⚡

(2 min to get Client ID + 3 min setup + 5 min to play first game)

---

## 🆘 NEED HELP?

### For ThirdWeb Issues:
- **Dashboard**: https://thirdweb.com/dashboard
- **Docs**: https://portal.thirdweb.com/
- **Support**: Check `frontend/THIRDWEB_SETUP.md`

### For Game Issues:
- **API Docs**: http://localhost:8000/docs (when backend running)
- **Test Guide**: `TEST_WALLET_INTEGRATION.md`
- **Audit**: `COMPREHENSIVE_AUDIT.md`

---

**🎮 Ready to Ape In! Just add that Client ID and you're good to go! 🚀**

























