#!/bin/bash

echo "🚀 Deploying Frontend to Vercel with Render Backend"
echo ""
echo "Backend URL: https://ape-in-game-backend.onrender.com"
echo ""

cd /home/apedev/ape-in-bot/frontend

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🎯 Step 1: Setting Environment Variables"
echo ""

# Set environment variable for production
vercel env add VITE_API_URL production << EOF
https://ape-in-game-backend.onrender.com
EOF

# Set for preview too
vercel env add VITE_API_URL preview << EOF
https://ape-in-game-backend.onrender.com
EOF

echo ""
echo "🚀 Step 2: Deploying to Production"
echo ""

# Deploy to production
vercel --prod

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Your game should now work at your Vercel URL!"
echo "Frontend will connect to: https://ape-in-game-backend.onrender.com"
echo ""
echo "⚠️ Note: Render free tier sleeps after 15 minutes"
echo "   First request may take 20-30 seconds (backend waking up)"
echo ""

