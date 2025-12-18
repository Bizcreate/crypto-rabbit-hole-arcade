# 🎮 Wallet Integration - Quick Start

## ⚡ 5-Minute Setup

### Option 1: Automated Setup (Recommended)
```bash
cd /home/apedev/ape-in-bot
./setup-thirdweb.sh
```
Follow the prompts!

### Option 2: Manual Setup
```bash
# 1. Get Client ID from https://thirdweb.com/dashboard
# 2. Create .env file:
cd /home/apedev/ape-in-bot/frontend
echo "VITE_THIRDWEB_CLIENT_ID=your_client_id_here" > .env

# 3. Restart dev server
npm run dev
```

## 🎯 What You Get

### Connect Wallet Button
- Top-right of header
- Supports all major wallets
- Shows your address when connected

### Leaderboard
- Visit: http://localhost:3000/leaderboard
- See all players ranked by wins
- Your entry is highlighted
- Updates automatically

### Stats Tracking
- Play with wallet connected → Stats saved
- Tracks: Wins, Losses, High Score, Games Played
- Persistent across sessions

## 🔗 Get ThirdWeb Client ID

1. **Visit**: https://thirdweb.com/dashboard
2. **Sign In**: Use wallet or email
3. **Create Project**: Click "Create Project"
4. **Get Key**: Settings → API Keys → Create API Key
5. **Copy**: Copy the Client ID (public, safe to use)

## ✅ Test It

1. **Connect**: Click "🎮 Connect Wallet"
2. **Play**: Complete a game with wallet connected
3. **Check**: Visit /leaderboard to see your stats

## 📚 Full Documentation

- Setup Guide: `THIRDWEB_SETUP.md`
- ThirdWeb Docs: https://portal.thirdweb.com/

## 🎉 You're Ready!

Your game now has wallet auth and leaderboard tracking!
