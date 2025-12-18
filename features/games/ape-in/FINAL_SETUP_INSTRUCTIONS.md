# 🎮 Final Setup Instructions - Start Backend

## ✅ What's Already Working:

- ✅ **Frontend:** Running perfectly on http://localhost:3000
- ✅ **Enhanced UI:** Particles, 3D cards, animations all working
- ✅ **Python Packages:** All installed successfully
- ✅ **Virtual Environment:** Created in `backend/venv/`

---

## 🚀 Next Step: Start the Backend Server

### **Run These Commands in Your Terminal:**

**Open a NEW terminal window** and run:

```bash
cd /home/apedev/ape-in-bot/backend
source venv/bin/activate
python -m app.main
```

---

## ✅ **When It Works You'll See:**

```
🚀 Starting Ape In! Game API...
📊 Initializing database...
✅ Database initialized successfully!
✅ Serving assets from: /home/apedev/ape-in-bot/assets
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Leave this terminal open!** The server needs to keep running.

---

## ❌ **If You See Errors:**

Please share the error message with me so I can fix it!

Common errors:
- Module not found → Missing package
- Port already in use → `pkill -f "python -m app.main"`
- Permission denied → Check file permissions
- Import error → Missing dependency

---

## 🎮 **Then Play the Game!**

Once you see "Uvicorn running on http://0.0.0.0:8000":

1. **Go to browser:** http://localhost:3000
2. **Click "Sandy"** (yellow card with 🟡)
3. **You'll see the game board** with:
   - Your score vs Sandy's score
   - "Draw Card" button (click it!)
   - "Roll Dice" button (after drawing)
   - "Stack Sats" button (to save score)
4. **Play until 150 sats!**

---

## 📊 **Complete System Status:**

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ RUNNING | http://localhost:3000 |
| Backend | ⏳ START NOW | http://localhost:8000 |
| Database | ✅ READY | Auto-creates on startup |
| Enhanced UI | ✅ ACTIVE | Particles + 3D cards |

---

## 🎯 **What Each Terminal Should Show:**

**Terminal 1 (Frontend):**
```
VITE v6.3.6  ready in 333 ms
➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```
✅ Keep this running

**Terminal 2 (Backend - NEEDS TO START):**
```
Uvicorn running on http://0.0.0.0:8000
```
⏳ Run the commands above to start this

---

## 📝 **Quick Copy-Paste:**

```bash
cd /home/apedev/ape-in-bot/backend && source venv/bin/activate && python -m app.main
```

---

**Run this command in a NEW terminal and tell me if you see "Uvicorn running"!** 🚀

If you see ANY errors, copy them and share with me so I can fix them immediately!

























