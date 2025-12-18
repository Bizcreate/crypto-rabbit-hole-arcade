# ✅ PM2 Setup Complete!

## 🎉 Your Ape In! Game is Now Running 24/7

### Current Status
- ✅ **Backend:** Running on http://localhost:8000 (managed by PM2)
- ✅ **Frontend:** Running on http://localhost:3000 (managed by PM2)
- ✅ **Auto-restart:** Enabled (if crashes, PM2 restarts automatically)
- ✅ **Survives terminal close:** Yes!
- ⏳ **Auto-start on boot:** Almost (one command needed - see below)

---

## 🚀 PM2 Commands You Can Use

```bash
# View status
npx pm2 status

# View logs (real-time)
npx pm2 logs

# View logs (last 100 lines)
npx pm2 logs --lines 100

# Restart everything
npx pm2 restart all

# Stop everything
npx pm2 stop all

# Start everything
npx pm2 start all

# Monitor CPU/memory usage
npx pm2 monit
```

---

## 🔧 Enable Auto-Start on Boot (Optional)

To make your game start automatically when your computer boots:

```bash
# Run this command (you'll need to enter your password):
sudo env PATH=$PATH:/usr/bin /home/apedev/.npm/_npx/5f7878ce38f1eb13/node_modules/pm2/bin/pm2 startup systemd -u apedev --hp /home/apedev
```

After running that, your game will start automatically every time you turn on your computer!

---

## 📊 What's Different Now?

### Before (Manual Start)
- ❌ Had to start backend manually every time
- ❌ Stopped when you closed terminal
- ❌ No auto-restart on crash
- ❌ No auto-start on boot

### After (PM2)
- ✅ Backend runs continuously
- ✅ Keeps running when terminal closes
- ✅ Auto-restarts if it crashes
- ✅ Can auto-start on boot (after running command above)

---

## 🎮 Play Your Game

Just open your browser and go to:
**http://localhost:3000**

The game will be available as long as:
- Your computer is on (and not sleeping)
- PM2 is running (check with `npx pm2 status`)

---

## 🔄 What Happens If...

**You close the terminal?**
- ✅ Game keeps running (PM2 is a daemon)

**Your backend crashes?**
- ✅ PM2 automatically restarts it

**You reboot your computer?**
- ⚠️ You need to run `npx pm2 resurrect` (unless you run the boot command above)
- ✅ Or run: `./START_WITH_PM2.sh` to restart everything

**You want to stop everything?**
- Run: `npx pm2 stop all`

**You want to start again?**
- Run: `npx pm2 start all` (or `./START_WITH_PM2.sh`)

---

## 💡 Pro Tips

1. **Check if running:** `npx pm2 status`
2. **View backend logs:** `npx pm2 logs ape-in-backend`
3. **View frontend logs:** `npx pm2 logs ape-in-frontend`
4. **Restart only backend:** `npx pm2 restart ape-in-backend`
5. **Restart only frontend:** `npx pm2 restart ape-in-frontend`

---

## ⚠️ Important Note About "Running When Computer is Off"

**Your computer cannot run anything when it's shut down.** 

If you want the game to be accessible 24/7 to other people, you need:
- A dedicated server (like AWS, DigitalOcean, Heroku, etc.)
- Or keep your computer on 24/7

PM2 makes sure the game runs continuously **while your computer is on**, but it can't run when the computer is off.

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Check status | `npx pm2 status` |
| View logs | `npx pm2 logs` |
| Restart all | `npx pm2 restart all` |
| Stop all | `npx pm2 stop all` |
| Start all | `npx pm2 start all` |
| Monitor | `npx pm2 monit` |

---

🎉 **Your game is now running with PM2!**
🎮 **Go to http://localhost:3000 and start playing!**

