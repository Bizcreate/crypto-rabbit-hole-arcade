# 🚀 Ape In! Startup Options

## Current Status
✅ Backend: Running on http://localhost:8000
✅ Frontend: Running on http://localhost:3000
🎮 Ready to play at http://localhost:3000

---

## Option 1: Manual Start (Current Method)

**Backend:**
```bash
cd backend
source venv/bin/activate
python -m app.main
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Pros:** Full control, good for debugging
**Cons:** Need to start both manually every time

---

## Option 2: Unified Script ⭐ EASIEST

```bash
./START_GAME.sh
```

**What it does:**
- Starts backend on port 8000
- Starts frontend on port 3000
- Both run until you press Ctrl+C

**Pros:** One command starts everything
**Cons:** Stops when you close terminal

---

## Option 3: PM2 Process Manager ⭐ RECOMMENDED

```bash
# First time setup
./START_WITH_PM2.sh

# Then use PM2 commands:
pm2 logs              # View logs
pm2 status            # Check status
pm2 restart all       # Restart services
pm2 stop all          # Stop services
pm2 start all         # Start services
```

**Pros:**
- ✅ Auto-restarts if crashes
- ✅ Runs in background
- ✅ Survives terminal close
- ✅ Easy log viewing
- ✅ Can set to start on boot: `pm2 startup` then `pm2 save`

**Cons:** Need to install PM2 (script does this automatically)

---

## Option 4: System Service (Boot on Startup)

```bash
# One-time installation
./INSTALL_SERVICE.sh

# Service commands
sudo systemctl start ape-in-backend
sudo systemctl stop ape-in-backend
sudo systemctl restart ape-in-backend
sudo systemctl status ape-in-backend
```

**Pros:**
- ✅ Starts automatically on boot
- ✅ Managed by systemd
- ✅ Production-ready

**Cons:** Only starts backend (need to start frontend separately)

---

## Option 5: Docker Compose

```bash
docker-compose up
```

**Pros:**
- ✅ Everything containerized
- ✅ Includes database
- ✅ Production-ready

**Cons:** Need Docker installed

---

## Quick Recommendation

**For Development:** Use **Option 3 (PM2)**
```bash
./START_WITH_PM2.sh
pm2 save
pm2 startup  # Follow the command it gives you
```

**For Quick Testing:** Use **Option 2 (Unified Script)**
```bash
./START_GAME.sh
```

**For Production:** Use **Option 4 (Systemd)** or **Option 5 (Docker)**

---

## Current Running Processes

Check what's running:
```bash
pm2 status                    # If using PM2
sudo systemctl status ape-in-backend  # If using systemd
ps aux | grep -E "(python.*main|vite)"  # Manual check
```

Stop everything:
```bash
pm2 stop all                  # If using PM2
sudo systemctl stop ape-in-backend    # If using systemd
pkill -f "python -m app.main"  # Kill backend manually
pkill -f "vite"                # Kill frontend manually
```

---

## What's Best for You?

| Situation | Best Option |
|-----------|-------------|
| Just playing around | `./START_GAME.sh` |
| Active development | `./START_WITH_PM2.sh` |
| Want auto-start on boot | `./INSTALL_SERVICE.sh` |
| Production deployment | Docker Compose or Systemd |

---

🎮 **All options are ready to use right now!**

