#!/bin/bash

echo "🔧 Installing Ape In! Backend as a System Service"
echo ""
echo "This will make the backend start automatically on boot."
echo ""

# Make sure venv exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend venv not found. Run START_BACKEND.sh first!"
    exit 1
fi

# Copy service file
echo "📋 Installing systemd service..."
sudo cp ape-in-backend.service /etc/systemd/system/

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Enable service
echo "✅ Enabling service to start on boot..."
sudo systemctl enable ape-in-backend.service

# Start service
echo "🚀 Starting service now..."
sudo systemctl start ape-in-backend.service

echo ""
echo "✅ Installation complete!"
echo ""
echo "Service commands:"
echo "  Start:   sudo systemctl start ape-in-backend"
echo "  Stop:    sudo systemctl stop ape-in-backend"
echo "  Restart: sudo systemctl restart ape-in-backend"
echo "  Status:  sudo systemctl status ape-in-backend"
echo "  Logs:    sudo journalctl -u ape-in-backend -f"
echo ""
echo "🎮 Backend will now start automatically on boot!"
echo ""

