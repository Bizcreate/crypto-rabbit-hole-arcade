# Vercel Environment Variables Setup

## Backend URL Configuration

Your backend is live at: **https://ape-in-game-backend.onrender.com**

## Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### 1. VITE_API_URL
- **Key**: `VITE_API_URL`
- **Value**: `https://ape-in-game-backend.onrender.com`
- **Environments**: Production, Preview, Development

### 2. VITE_THIRDWEB_CLIENT_ID
- **Key**: `VITE_THIRDWEB_CLIENT_ID`
- **Value**: Your ThirdWeb Client ID (get from https://thirdweb.com/dashboard)
- **Environments**: Production, Preview, Development

## How to Add Environment Variables in Vercel

1. Go to https://vercel.com/cryptorabbittcgs-projects
2. Click on your `ape-in-game` project
3. Navigate to **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Click **Add New** button
6. Enter the Key and Value
7. Select which environments to apply to
8. Click **Save**

## After Adding Variables

You must **redeploy** for changes to take effect:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (...) menu
4. Click **Redeploy**
5. Confirm the redeployment

## Testing

After redeployment, your frontend at Vercel should successfully connect to the backend at Render.

Test by:
1. Visiting your Vercel URL
2. Starting a new game
3. The game should connect to the backend and work fully

