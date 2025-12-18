# 🔧 Vercel Project Configuration Fix

## Current Situation

**Frontend folder is linked to:**
- Project Name: `frontend`
- Project ID: `prj_0WbVlD8Q5U0MY6MnOLhcx8htNRd7`

**Your deployment URL:**
- `ape-in-game-msft17ko8-info-36621003s-projects.vercel.app`

**Problem:** These don't match! The frontend is deploying to "frontend" project, but your URL is from a different project (likely "ape-in-game" or similar).

---

## Solution Options

### Option 1: Link Frontend to the Correct Project (RECOMMENDED)

You need to link the frontend to the project that has your deployment URL:

```bash
cd /home/apedev/ape-in-bot/frontend

# Unlink from current project
vercel unlink

# Link to the correct project
vercel link

# When prompted:
# - Link to existing project? YES
# - Which project? Look for one with "ape-in-game" in the name
#   OR find the project ID that matches your deployment URL
# - Select that project

# Deploy
vercel --prod
```

---

### Option 2: Check Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard

2. **Find the project** with your deployment URL:
   - Look for project with deployment: `ape-in-game-msft17ko8...`
   - Check project name (might be "ape-in-game" or similar)

3. **Check if it's connected to GitHub:**
   - Go to Settings → Git
   - Verify repository is connected
   - Verify Root Directory is set to: `frontend`
   - Verify branch is `main`

4. **If not connected:**
   - Click "Connect Git Repository"
   - Select: `cryptorabbittcg/ape-in-discord-bot` (or your repo)
   - Set Root Directory: `frontend`
   - Deploy

5. **If connected but not deploying:**
   - Go to Deployments tab
   - Click "Redeploy" or "Create Deployment"
   - Select branch: `main`
   - Deploy

---

### Option 3: Deploy Directly to That Project via Dashboard

1. **Vercel Dashboard** → Find project with your URL

2. **Go to:** Deployments tab

3. **Click:** "Create Deployment"

4. **Connect GitHub** (if not connected):
   - Repository: Your GitHub repo
   - Branch: `main`
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Deploy**

---

## Verify Deployment

After deploying, check:

1. **New deployment** appears in dashboard (today's date)
2. **Deployment URL** shows arcade integration working
3. **Check browser console** for: "✅ Arcade session found" (if session exists) or redirect to hub

---

## Expected Project Configuration

For auto-deploy to work:

```
Vercel Project:
├── Name: "ape-in-game" (or matches your URL)
├── GitHub: Connected to your repo
├── Root Directory: "frontend"
├── Branch: "main"
└── Auto-deploy: Enabled
```

---

## Quick Fix Command

If you have Vercel CLI access:

```bash
cd /home/apedev/ape-in-bot/frontend

# Find and link to correct project
vercel link
# Select: The project with "ape-in-game" in name or your deployment URL

# Deploy latest code
vercel --prod
```

---

**The code is on GitHub and ready - we just need to deploy it to the correct Vercel project!**

