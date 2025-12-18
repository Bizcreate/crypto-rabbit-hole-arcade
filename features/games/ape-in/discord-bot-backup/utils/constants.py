# === CHANNEL CONFIGURATION ===

# Channel names (used when comparing ctx.channel.name)
CHANNEL_PLAY_MINIGAMES = "play-risk-reward"  # Previously 'play-official-minigames'
CHANNEL_GENERAL_CHAT = "general-chat"
CHANNEL_MAIN_MENU = "risk-reward-hub"  # Optional: channel for main menu interface

# Channel IDs (used when comparing ctx.channel.id)
CHANNEL_PLAY_MINIGAMES_ID = 1393415841525137428  # ✅ play-risk-reward
CHANNEL_GENERAL_CHAT_ID = 1172097033012777001
CHANNEL_PVP_REQUESTS_ID = 1393416695753740289  # ✅ pvp-requests (used for join announcements)

# Compatibility alias for legacy imports
GENERAL_CHAT_CHANNEL_ID = CHANNEL_GENERAL_CHAT_ID

# === GAME CONFIGURATION ===
MAX_SCORE = 300
TURN_TIMEOUT_SECONDS = 60
MAX_IDLE_TURNS = 5

# === BOT NAMES ===
BOTS = {
    "sandy": "Sandy",
    "aida": "Aida",
    "lana": "Lana",
    "enj1n": "En-J1n",
    "nifty": "Nifty"
}

# === INTRO MODES ===
INTRO_MODES = ["Sandy", "Aida", "Lana", "Enj1n", "Nifty", "PvP"]

# === PVP / MULTIPLAYER CONFIGURATION ===
PVP_JOIN_TIMEOUT = 90           # Seconds to wait for 2nd player
MULTIPLAYER_JOIN_TIMEOUT = 120  # Seconds to wait for full group

# === CARD CONFIGURATION ===
POINT_VALUES = [1, 2, 3, 5, 8, 13, 21]

# === FILE PATHS ===
CARD_IMAGE_FOLDER = "/cards/"              # Relative path or hosted URL base
LEADERBOARD_FILE = "leaderboard.json"      # Local leaderboard storage
