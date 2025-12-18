# 🚀 Deploy Ape In! with Arcade Integration

## Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Navigate to your `crypto-rabbit-hole-arcade` project

2. **Connect GitHub Repository** (if not already connected)
   - Go to Project Settings → Git
   - Connect your GitHub repository
   - Set Root Directory to: `frontend`

3. **Verify Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Framework Preset: Vite

4. **Deploy**
   - Click "Deploy" or push to your main branch
   - Vercel will auto-deploy the latest changes

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to frontend directory
cd /home/apedev/ape-in-bot/frontend

# Deploy (first time - will prompt for setup)
vercel

# Or deploy to production directly
vercel --prod
```

**During first setup, you'll be asked:**
- Link to existing project? **Y** (select `crypto-rabbit-hole-arcade`)
- Which scope? (Select your account)

### Option 3: Git Push (Auto-Deploy)

If your Vercel project is connected to GitHub:

```bash
# Commit changes
git add .
git commit -m "Add arcade hub integration"

# Push to trigger auto-deploy
git push origin main
```

Vercel will automatically detect the push and deploy.

---

## 🔧 Environment Variables (Optional)

**Note**: With arcade integration, most env vars come from the session. Only needed for standalone mode:

### For Standalone/Development Mode:
```env
VITE_ALLOW_STANDALONE=true
VITE_THIRDWEB_CLIENT_ID=your_client_id_here
VITE_API_URL=https://your-backend-url
```

### For Arcade Hub Mode (Production):
**No env vars needed** - Everything comes from arcade session!

---

## ✅ Post-Deployment Checklist

After deployment:

1. **Test Arcade Integration**
   - Open arcade hub: `https://arcade.thecryptorabbithole.io`
   - Connect wallet
   - Navigate to Ape In! game
   - Verify auto-login works

2. **Test Point Syncing**
   - Play and win a game
   - Check hub shows updated points/tickets
   - Verify achievements appear

3. **Check Browser Console**
   - Open DevTools (F12)
   - Verify no errors
   - Check for "✅ Arcade session found" message

4. **Verify Session Flow**
   - Without session: Should redirect to hub
   - With session: Should proceed to game
   - Session expiry: Should redirect to hub

---

## 🐛 Troubleshooting

### Build Fails
- Check `frontend/package.json` dependencies
- Run `npm install` locally to verify
- Check Vercel build logs

### Session Not Found
- Verify localStorage is accessible (same domain)
- Check browser console for session structure
- Ensure hub is creating sessions correctly

### Points Not Syncing
- Check browser console for sync messages
- Verify `localStorage.crypto_rabbit_point_updates` exists
- Check hub is reading point updates

### Redirect Loop
- Ensure `VITE_ALLOW_STANDALONE=true` is NOT set in production
- Check redirect URL is correct: `https://arcade.thecryptorabbithole.io`

---

## 📊 Deployment Status

Once deployed, your game will be available at:
- **Production URL**: `https://ape-in-game.vercel.app` (or your custom domain)
- **Arcade Hub**: `https://arcade.thecryptorabbithole.io`

---

## 🎉 Success!

After successful deployment:
1. ✅ Game is integrated with arcade hub
2. ✅ Users can single sign-on from hub
3. ✅ Points sync automatically after wins
4. ✅ Session management works correctly

---

**Next Step**: Test the integration with the arcade hub!

