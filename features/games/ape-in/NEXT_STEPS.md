# 🚀 Next Steps - Connect Backend & Play!

## ✅ Current Status

**Frontend:** ✅ RUNNING with enhanced UI on http://localhost:3000
- Floating particles working
- 3D card tilting working
- CxRH banner displayed
- Smooth animations

**Backend:** ⏳ Need to start

---

## 🎯 Step-by-Step: Start Backend

### Option 1: Automated Script (Easiest)

**Open a NEW terminal** (keep frontend running) and run:

```bash
cd /home/apedev/ape-in-bot
./START_BACKEND.sh
```

This will:
1. Install Python pip and venv (if needed)
2. Create virtual environment
3. Install all Python packages
4. Start FastAPI server on http://localhost:8000

### Option 2: Manual Steps

**In a NEW terminal:**

```bash
# Install Python tools (one-time)
sudo apt install python3-pip python3-venv -y

# Navigate to backend
cd /home/apedev/ape-in-bot/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m app.main
```

---

## ✅ When Backend Starts Successfully

You'll see:
```
🚀 Starting Ape In! Game API...
📊 Initializing database...
✅ Database initialized successfully!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🎮 Then You Can Play!

### With Backend Running:

1. **Go to** http://localhost:3000
2. **Click any game mode** (try Sandy first)
3. **Click "Draw Card"**
4. **Click "Roll Dice"**
5. **Click "Stack Sats" or continue**
6. **Play against the AI!**

---

## 🔐 Optional: Add Wallet Connection

For the full experience with wallet integration:

1. **Get ThirdWeb Client ID:**
   - Visit: https://thirdweb.com/dashboard
   - Create/select project
   - Copy Client ID

2. **Add to frontend/.env:**
   ```bash
   nano frontend/.env
   # Add: VITE_THIRDWEB_CLIENT_ID=your_id_here
   ```

3. **Enable Google** in ThirdWeb Dashboard
4. **Restart frontend**

Then the "🎮 Sign In" button will fully work!

---

## 📊 What Each Server Does

### Frontend (Port 3000)
- UI/UX and animations
- Game mode selection
- User interactions
- Displays game state

### Backend (Port 8000)
- Game logic and rules
- AI opponent behaviors
- Card drawing mechanics
- Dice rolling
- Score calculation
- Database storage

---

## 🎯 Testing Game Flow

Once backend is running:

### Test Sandy Mode:
1. Click "Sandy" card (🟡)
2. Wait for game page
3. Click "Draw Card" → See card appear
4. Click "Roll Dice" → See dice animation
5. If successful → Click "Stack Sats" or "Draw Card" again
6. Play until 150 sats or 10 rounds
7. See winner announced!

---

## 📝 Quick Commands Reference

**Start Backend:**
```bash
./START_BACKEND.sh
```

**Start Frontend:**
```bash
cd frontend && npm run dev
```

**Check Backend API:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

**View API Documentation:**
Open: http://localhost:8000/docs

---

## 🐛 Troubleshooting

### Backend won't start - "pip not found"
```bash
sudo apt install python3-pip python3-venv -y
```

### Backend won't start - "venv not available"
```bash
sudo apt install python3.12-venv -y
```

### Backend port already in use
```bash
pkill -f "python -m app.main"
./START_BACKEND.sh
```

### Database errors
Backend creates SQLite database automatically on first run - no setup needed!

---

## 🎊 Summary

**Current:**
- ✅ Frontend running with amazing UI
- ⏳ Backend needs to start

**Next:**
1. Run `./START_BACKEND.sh` in new terminal
2. Wait for "Uvicorn running on http://0.0.0.0:8000"
3. Go back to browser
4. Click a game mode
5. **Play!** 🎮

---

**Ready to start the backend? Run `./START_BACKEND.sh`!** 🚀

























