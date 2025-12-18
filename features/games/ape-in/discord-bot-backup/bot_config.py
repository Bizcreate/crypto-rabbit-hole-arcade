import os
from dotenv import load_dotenv
import discord

# Load environment variables
load_dotenv()

# Get token from .env
TOKEN = os.getenv("DISCORD_TOKEN")
if not TOKEN:
    raise ValueError("❌ DISCORD_TOKEN not found in .env file.")

# Set Discord intents
INTENTS = discord.Intents.default()
INTENTS.messages = True
INTENTS.guilds = True
INTENTS.message_content = True
INTENTS.members = True
