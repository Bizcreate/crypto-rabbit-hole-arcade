# Discord Bot Backup

This folder contains the original Discord bot files for reference.

## Contents

- `bots/` - Discord bot cogs for each game mode
- `cogs/` - Discord command cogs
- `routers/` - Discord interaction routers
- `views/` - Discord UI views and buttons
- `game_logic/` - Original game logic (ported to backend)
- `utils/` - Utility functions
- `data/` - JSON data files (leaderboard, match history)
- `main.py` - Original Discord bot entry point
- `bot_config.py` - Discord bot configuration
- `requirements.txt` - Discord bot dependencies

## Note

These files are kept for reference only. The web application uses the new structure:
- `frontend/` - React web app
- `backend/` - FastAPI server

All game logic has been ported to `backend/app/game_logic/` and `backend/app/services/`.

























