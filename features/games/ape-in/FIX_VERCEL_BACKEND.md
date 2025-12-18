# 🔧 Fix: Connect Vercel Frontend to Railway Backend

## ❌ Current Problem

Your Vercel frontend is trying to connect to:
```
http://localhost:8000  ❌ This doesn't exist in the cloud!
```

When deployed to Vercel, there IS no "localhost" - it needs your Railway URL!

---

## ✅ Solution: Configure Environment Variable

### Step 1: Get Your Railway Backend URL

1. Go to https://railway.app
2. Open your project
3. Click on your backend service
4. Click "Settings" → "Domains"
5. Copy the URL (looks like: `https://your-app.up.railway.app`)

**Example Railway URL:**
```
https://ape-in-backend-production.up.railway.app
```

---

### Step 2: Add Environment Variable to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/dashboard
2. Select your `ape-in-game` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app`
   - **Environment:** Check "Production", "Preview", "Development"
5. Click **Save**
6. Go to **Deployments** tab
7. Click "..." on latest deployment → **Redeploy**

**Option B: Using Vercel CLI (Command Line)**

```bash
cd /home/apedev/ape-in-bot/frontend

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://your-railway-url.up.railway.app

# Also add for preview
vercel env add VITE_API_URL preview
# Enter same URL

# Redeploy
vercel --prod
```

---

### Step 3: Update CORS on Backend

Your Railway backend needs to allow requests from Vercel:

**Edit backend/app/main.py:**

```python
# Current CORS (line 31-37)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This is fine for now
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This should already work with `allow_origins=["*"]` but if you want to be specific:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ape-in-game.vercel.app",
        "https://*.vercel.app"  # All Vercel preview deployments
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then redeploy backend to Railway.

---

### Step 4: Check Railway Backend is Running

**Railway Free Tier sleeps after 5 minutes of inactivity!**

To check:
1. Visit your Railway backend URL in browser
2. You should see: `{"message": "Ape In! Game API", "status": "running"}`
3. If it takes 10-30 seconds to load → it was sleeping (normal on free tier)

**To keep it always on:**
- Upgrade to Railway Pro ($5/month)
- Or use a "keep-alive" service (like cron-job.org) to ping it every 5 minutes

---

## 🧪 Test After Fix

1. Deploy changes to Vercel
2. Visit: `https://ape-in-game.vercel.app`
3. Open browser console (F12)
4. Click "Sandy" game
5. You should see API requests going to Railway URL (not localhost)

---

## 🚨 Common Issues & Fixes

### Issue 1: "Network Error" or "Failed to Fetch"
**Cause:** Frontend can't reach backend
**Fix:** 
- Check Railway backend URL is correct in Vercel env vars
- Check Railway backend is running (visit the URL)
- Check CORS is configured correctly

### Issue 2: Backend Takes 30 Seconds to Respond First Time
**Cause:** Railway free tier sleeps when idle
**Fix:** 
- Wait 30 seconds for first request (backend waking up)
- Upgrade to Railway Pro
- Use keep-alive service

### Issue 3: "CORS Error" in Console
**Cause:** Backend not allowing Vercel domain
**Fix:**
- Check CORS configuration in backend/app/main.py
- Make sure `allow_origins=["*"]` or includes your Vercel domain

---

## 📋 Quick Checklist

- [ ] I have my Railway backend URL
- [ ] I added `VITE_API_URL` to Vercel environment variables
- [ ] I redeployed Vercel frontend
- [ ] Railway backend is running (I can visit the URL)
- [ ] CORS is configured to allow Vercel domain
- [ ] I tested the game on Vercel

---

## 🎯 What You Need to Tell Me

To help you fix this, I need:

1. **Your Railway backend URL** (e.g., `https://xxx.up.railway.app`)
2. **Your Vercel frontend URL** (e.g., `https://ape-in-game.vercel.app`)

Then I can:
- Update the environment variables
- Update CORS configuration
- Redeploy everything
- Make it work!

