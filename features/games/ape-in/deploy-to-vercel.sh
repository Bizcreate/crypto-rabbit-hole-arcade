#!/bin/bash

echo "=========================================================================="
echo "🚀 Ape In! - Vercel Deployment Script"
echo "=========================================================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

echo "📋 DEPLOYMENT PLAN:"
echo "===================="
echo "1. Deploy Frontend to Vercel"
echo "2. Backend will deploy to Railway/Render separately"
echo ""
echo "Press Enter to continue..."
read

# Navigate to frontend
cd frontend

echo ""
echo "🎨 Deploying Frontend to Vercel..."
echo "===================================="
echo ""
echo "Follow the prompts:"
echo "  - Set up and deploy? Y"
echo "  - Project name: ape-in-game (or your choice)"
echo "  - Override settings? N"
echo ""

vercel

echo ""
echo "=========================================================================="
echo "✅ FRONTEND DEPLOYED!"
echo "=========================================================================="
echo ""
echo "Your game is live! Vercel provided a URL above."
echo ""
echo "📝 NEXT STEPS:"
echo "==============="
echo ""
echo "1. Backend Deployment:"
echo "   Option A - Railway (Recommended):"
echo "      • Go to https://railway.app"
echo "      • Click 'Start a New Project'"
echo "      • Deploy from GitHub"
echo "      • Select the backend folder"
echo "      • It will auto-deploy!"
echo ""
echo "   Option B - Render:"
echo "      • Go to https://render.com"
echo "      • Click 'New Web Service'"
echo "      • Connect GitHub"
echo "      • Auto-deploys!"
echo ""
echo "2. Connect Frontend to Backend:"
echo "   After backend deploys, get its URL and run:"
echo "   vercel env add VITE_API_URL"
echo "   # Enter your backend URL"
echo "   vercel --prod"
echo ""
echo "3. Add ThirdWeb Client ID:"
echo "   vercel env add VITE_THIRDWEB_CLIENT_ID"
echo "   # Enter your client ID from thirdweb.com/dashboard"
echo "   vercel --prod"
echo ""
echo "=========================================================================="
echo "🎉 Deployment Started!"
echo "=========================================================================="

