# Complete Deployment Guide

## 🎉 Your Deployment URLs

- **Frontend**: https://ape-in-game.vercel.app/
- **Backend**: https://ape-in-game-backend.onrender.com/

## ✅ What's Already Done

- [x] Backend deployed to Render.com
- [x] Frontend deployed to Vercel
- [x] GitHub repository created and synced
- [x] Backend CORS updated to allow Vercel domain
- [x] All code committed and pushed

## ⚠️ What YOU Need to Do (10 minutes)

### Step 1: Configure Render Backend (5 minutes)

1. Go to: https://dashboard.render.com/
2. Click on your `ape-in-game-backend` service
3. Click `Environment` tab (left sidebar)
4. Look for `CORS_ORIGINS` variable
5. If it exists, click **Edit** and change value to: `*`
6. If it doesn't exist, click **Add Environment Variable**:
   - Key: `CORS_ORIGINS`
   - Value: `*`
7. Click **Save Changes**
8. Render will automatically redeploy (wait 2-3 minutes)

**Alternative specific CORS value** (more secure):
```
http://localhost:3000,http://localhost:5173,https://ape-in-game.vercel.app
```

### Step 2: Configure Vercel Frontend (5 minutes)

1. Go to: https://vercel.com/cryptorabbittcgs-projects/ape-in-game/settings/environment-variables
2. Click **Add New**
3. Fill in:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ape-in-game-backend.onrender.com`
   - **Environments**: ✅ Production ✅ Preview ✅ Development
4. Click **Save**
5. Go to: https://vercel.com/cryptorabbittcgs-projects/ape-in-game/deployments
6. Click the `...` menu on the latest deployment
7. Click **Redeploy**
8. Wait 30-60 seconds for build to complete

## 🧪 Testing Your Deployment

After both services have redeployed:

1. Visit: https://ape-in-game.vercel.app/
2. You should see the Ape In! home page with game modes
3. Click **Sandy** to start a game
4. Try drawing cards and rolling dice
5. The game should work perfectly!

## 🔧 Troubleshooting

### Frontend shows blank page
- Open browser console (F12)
- Look for errors
- Check if `VITE_API_URL` environment variable was added
- Make sure you redeployed after adding the variable

### CORS errors in browser console
- Make sure Render `CORS_ORIGINS` includes your Vercel domain or is set to `*`
- Wait for Render to finish redeploying after changing the variable

### Backend "Application Error"
- Check Render logs for specific errors
- Make sure `greenlet` is in `requirements.txt`
- Verify all environment variables are set correctly

### Network timeout errors
- Render free tier may sleep after inactivity
- First request after sleep takes 30-60 seconds
- This is normal for free tier

## 📋 Environment Variables Summary

### Render Backend Environment Variables
```
SECRET_KEY=production-secret-key-2024
CORS_ORIGINS=*
```

### Vercel Frontend Environment Variables
```
VITE_API_URL=https://ape-in-game-backend.onrender.com
VITE_THIRDWEB_CLIENT_ID=placeholder-client-id-replace-me
```

## 🚀 Next Steps (Optional)

1. **Get ThirdWeb Client ID**:
   - Sign up at https://thirdweb.com/
   - Create a project
   - Copy the Client ID
   - Update `VITE_THIRDWEB_CLIENT_ID` in Vercel
   - Redeploy Vercel

2. **Custom Domain** (Vercel):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Database Upgrade** (Render):
   - Currently using SQLite (file-based)
   - For production, consider PostgreSQL
   - Render offers managed PostgreSQL databases

4. **Monitoring**:
   - Set up error tracking (Sentry, LogRocket)
   - Monitor Render and Vercel dashboards
   - Check logs regularly

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Deployments → Click deployment → Logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Deployment Date**: October 14, 2025  
**Backend**: Render.com (Python/FastAPI)  
**Frontend**: Vercel (React/Vite)  
**Repository**: https://github.com/cryptorabbittcg/ape-in-game

