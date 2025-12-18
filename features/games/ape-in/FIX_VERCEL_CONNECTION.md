# ✅ Fix Vercel → Render Connection (2 Minutes)

## 🎯 The Problem
Your Vercel frontend is looking for: `http://localhost:8000` ❌
But your backend is at: `https://ape-in-game-backend.onrender.com` ✅

## ✅ The Fix (Choose One Method)

---

### Method 1: Vercel Dashboard (EASIEST - 2 Minutes)

1. **Go to:** https://vercel.com/dashboard

2. **Click your project** (ape-in-game or similar)

3. **Go to Settings** → **Environment Variables**

4. **Add New Variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://ape-in-game-backend.onrender.com`
   - **Environments:** Check ALL (Production, Preview, Development)
   - Click **Save**

5. **Redeploy:**
   - Go to **Deployments** tab
   - Find the latest deployment
   - Click the **"..."** menu → **Redeploy**
   - Wait 1-2 minutes

6. **Test:**
   - Visit your Vercel URL
   - Click "Sandy" game
   - Should work! (May take 20-30 seconds first time if backend is sleeping)

---

### Method 2: Vercel CLI (Command Line)

```bash
# Install Vercel CLI
npm install -g vercel

# Go to frontend folder
cd /home/apedev/ape-in-bot/frontend

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://ape-in-game-backend.onrender.com

# Also add for preview
vercel env add VITE_API_URL preview
# Enter same URL

# Deploy
vercel --prod
```

---

### Method 3: Automated Script

```bash
# Run the deployment script
./DEPLOY_TO_VERCEL_NOW.sh
```

---

## 🧪 Testing

After deploying, test your game:

1. **Open your Vercel URL** in browser
2. **Open browser console** (F12)
3. **Click "Sandy" game**
4. **Check console for:**
   - ✅ Requests going to: `https://ape-in-game-backend.onrender.com`
   - ❌ If you see: `http://localhost:8000` → env var didn't apply, redeploy

---

## ⚠️ Important Notes About Render Free Tier

**Render sleeps after 15 minutes of inactivity!**

- First request: 20-30 seconds (backend waking up)
- Subsequent requests: Instant
- This is normal for free tier

**To keep always-on:**
- Upgrade to Render Starter ($7/month)
- Or use Koyeb.com (always-on free tier)

---

## 🔍 Troubleshooting

### Issue: "Network Error" or "Failed to Fetch"

**Check 1: Environment Variable**
```bash
# In Vercel dashboard, verify:
VITE_API_URL = https://ape-in-game-backend.onrender.com
```

**Check 2: Backend is Running**
- Visit: https://ape-in-game-backend.onrender.com
- Should see: `{"message":"Ape In! Game API","status":"running"}`
- If it takes 30 seconds → backend was sleeping (normal)

**Check 3: CORS**
Your backend should allow Vercel domain. Check `backend/app/main.py`:
```python
allow_origins=["*"]  # This should work
```

**Check 4: Redeployment**
Make sure you redeployed AFTER adding environment variable!

---

### Issue: Backend Takes Forever

**Cause:** Render free tier is sleeping

**Solutions:**
1. **Wait 30 seconds** on first request
2. **Use keep-alive service:**
   - Go to cron-job.org
   - Create job to ping your backend every 10 minutes
   - URL: `https://ape-in-game-backend.onrender.com/health`
3. **Upgrade to paid tier** ($7/month) for instant responses

---

### Issue: Still Showing localhost

**Cause:** Environment variable not applied

**Fix:**
1. Double-check env var in Vercel dashboard
2. Must redeploy AFTER adding env var
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R)

---

## ✅ Success Checklist

- [ ] Added `VITE_API_URL` to Vercel env vars
- [ ] Value is `https://ape-in-game-backend.onrender.com`
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] Redeployed frontend to Vercel
- [ ] Tested backend is running (visit URL directly)
- [ ] Opened Vercel app and clicked Sandy
- [ ] Game starts (may take 30 seconds first time)

---

## 🎉 After Fix

Once working, you'll have:
- ✅ Frontend on Vercel (24/7)
- ✅ Backend on Render (24/7, but sleeps when idle)
- ✅ Anyone can play from anywhere
- ✅ Works when YOUR computer is OFF

---

## 📊 Quick Summary

| What | URL |
|------|-----|
| **Frontend** | https://ape-in-game.vercel.app (your URL) |
| **Backend** | https://ape-in-game-backend.onrender.com |
| **Status** | Backend running ✅ |
| **Fix Needed** | Connect frontend to backend (2 minutes) |

---

## 🚀 Need Help?

If you're still stuck, tell me:
1. Your Vercel URL
2. What error you see in browser console
3. Screenshot of error (if any)

I'll help you fix it! 🎮

