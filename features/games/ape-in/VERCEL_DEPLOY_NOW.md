# 🚀 Deploy to Vercel - Step by Step Guide

## ⚡ Quick Deploy (5 Minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy Frontend
```bash
cd /home/apedev/ape-in-bot/frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- What's your project's name? **ape-in-game** (or your choice)
- In which directory is your code located? **./**
- Want to override settings? **N**

**That's it!** Vercel will:
- Build your app
- Deploy to production
- Give you a live URL: `https://ape-in-game.vercel.app`

### Step 3: Deploy Backend (Railway - Easier for Python)

**Why Railway for Backend:**
- Better Python support than Vercel
- Built-in PostgreSQL
- One-click deploy
- Free tier available

**Deploy to Railway:**
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select the backend folder
6. Railway auto-detects Python and deploys!

**OR use Render.com:**
1. Go to: https://render.com
2. Click "New Web Service"
3. Connect GitHub
4. Select backend folder
5. Auto-deploys!

### Step 4: Connect Frontend to Backend

After backend deploys, you'll get a URL like:
`https://ape-in-backend.up.railway.app`

Update frontend environment:
```bash
cd /home/apedev/ape-in-bot/frontend
vercel env add VITE_API_URL
# Enter: https://your-backend-url.railway.app
vercel --prod
```

---

## 🎯 Alternative: Deploy Everything to Vercel

### Frontend (Easy)
Already configured! Just run `vercel` in `/frontend`

### Backend (Advanced)  
Vercel supports Python but requires specific setup:

1. Create `api/` folder in root
2. Move backend endpoints to serverless functions
3. Configure `vercel.json` for Python runtime

**This takes longer** - I recommend Railway/Render for backend.

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Deploy:

- [ ] Create `.env` file in frontend:
  ```
  VITE_THIRDWEB_CLIENT_ID=your_id_here
  VITE_API_URL=http://localhost:8000
  ```

- [ ] Test locally one more time:
  ```bash
  # Backend
  cd backend && source venv/bin/activate && python -m uvicorn app.main:app
  
  # Frontend (new terminal)
  cd frontend && npm run dev
  
  # Visit http://localhost:3000
  ```

- [ ] If working locally, proceed with Vercel!

---

## 🚀 Immediate Deployment Commands

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy frontend NOW
cd /home/apedev/ape-in-bot/frontend
vercel

# Follow prompts, then you'll get a live URL!
```

---

## 🔧 Current Issue: Blank Page

The blank page might be due to:
1. ThirdWeb not configured (needs client ID)
2. Missing imports
3. Build issue

**Let's fix it first, then deploy:**

I'll check the console errors and fix them now!

