# 🔧 Backend Setup - System Dependencies Needed

## ⚠️ Missing Python Dependencies

Your system needs Python pip and venv. Run these commands:

```bash
sudo apt update
sudo apt install python3-pip python3-venv -y
```

---

## 🚀 Then Start Backend

After installing the above, run:

```bash
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

Backend will run on: **http://localhost:8000**

---

## ✅ Quick Command (Copy-Paste)

```bash
sudo apt install python3-pip python3-venv -y && \
cd /home/apedev/ape-in-bot/backend && \
python3 -m venv venv && \
source venv/bin/activate && \
pip install -r requirements.txt && \
python -m app.main
```

---

## 🎮 For Now: Test Frontend Only

Your **frontend is already running** on http://localhost:3000!

You can:
- ✅ See the enhanced UI
- ✅ See floating particles
- ✅ See 3D card tilting
- ✅ See all animations
- ✅ Browse game modes
- ⚠️  Cannot play yet (needs backend)

---

## 📝 Alternative: Docker (No System Dependencies)

If you have Docker installed:

```bash
cd /home/apedev/ape-in-bot
docker-compose up
```

This runs everything without needing system Python packages!

























