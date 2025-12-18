#!/bin/bash

echo "🔧 Completing PM2 Auto-Start Setup"
echo ""
echo "Run this command to enable PM2 to start on boot:"
echo ""
echo "sudo env PATH=\$PATH:/usr/bin /home/apedev/.npm/_npx/5f7878ce38f1eb13/node_modules/pm2/bin/pm2 startup systemd -u apedev --hp /home/apedev"
echo ""
echo "After running that command, PM2 will:"
echo "✅ Start automatically when your computer boots"
echo "✅ Keep your game running 24/7"
echo "✅ Auto-restart if it crashes"
echo ""
echo "Note: You'll need to enter your password when prompted"
echo ""

