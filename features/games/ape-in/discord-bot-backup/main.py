import discord
from discord.ext import commands
import asyncio
import logging
from dotenv import load_dotenv
import sys
import os

# Load .env and bot token/intents
load_dotenv()
from bot_config import TOKEN, INTENTS

# Import the Main Menu View
from views.main_menu_view import MainMenuView

# === Debug: Show Python path ===
print("🔍 PYTHONPATH:", sys.path)

# ✅ Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === Bot setup ===
bot = commands.Bot(command_prefix="!", intents=INTENTS)

# === Game Channels ===
MAIN_MENU_CHANNEL_NAME = "🎮play-ape-in"

# === Game Mode Handler ===
async def handle_game_mode(interaction: discord.Interaction, mode: str):
    try:
        # Normalize mode string for robust lookup (handles dashes/case)
        mode_key = mode.replace("-", "").lower()
        cog_map = {
            "sandy": "SandyBot",
            "aida": "AidaBot",
            "lana": "LanaBot",
            "enj1n": "Enj1nBot",
            "nifty": "NiftyBot",
            "pvp": "PvpBot",
            "multiplayer": "MultiplayerBot",
            "tournament": "TournamentBot"
        }

        cog_name = cog_map.get(mode_key)
        if cog_name:
            cog = bot.get_cog(cog_name)
            if cog:
                start_func = getattr(cog, f"start_{mode_key}_game", None)
                if start_func:
                    await start_func(interaction)
                    logger.info(f"🚀 {mode} game started.")
                    return
                else:
                    await interaction.followup.send(f"⚠️ {mode} start function not found.", ephemeral=True)
            else:
                await interaction.followup.send(f"❌ {mode} cog not loaded.", ephemeral=True)
        else:
            await interaction.followup.send(f"🚧 {mode} mode is not supported yet.", ephemeral=True)
    except Exception as e:
        logger.exception(f"❌ Error launching {mode} mode")
        await interaction.followup.send(f"🚨 Failed to launch **{mode}** game mode.", ephemeral=True)

# === Bot Ready Event ===
@bot.event
async def on_ready():
    logger.info(f"✅ Logged in as {bot.user.name}")
    for guild in bot.guilds:
        for channel in guild.text_channels:
            if channel.name == MAIN_MENU_CHANNEL_NAME:
                async for message in channel.history(limit=20):
                    if message.author == bot.user and message.components:
                        return  # Already posted
                # Pass the bot instance to MainMenuView
                view = MainMenuView(bot=bot, on_mode_selected=handle_game_mode)
                await channel.send("🎮 **Choose your game mode:**", view=view)
                logger.info("📨 Main menu posted to #play-risk-reward")

# === Extension Loader ===
async def load_extensions():
    extensions = [
        "routers.main_menu_router",
        "bots.sandy_bot",
        "bots.aida_bot",
        "bots.lana_bot",
        "bots.enj1n_bot",
        "bots.nifty_bot",
        "bots.pvp_bot",           # <-- Enable PvP bot
        "bots.multiplayer_bot",   # <-- Enable Multiplayer bot
        "bots.tournament_bot",    # <-- Enable Tournament bot
        # Add other routers if needed
    ]
    for ext in extensions:
        try:
            await bot.load_extension(ext)
            logger.info(f"✅ Loaded {ext}")
        except Exception as e:
            logger.exception(f"❌ Failed to load {ext}")

# === Leaderboard Command (optional, for easy access) ===
from views.leaderboard_view import LeaderboardView

@bot.command(name="leaderboard")
async def leaderboard(ctx):
    embed = LeaderboardView.get_leaderboard_embed(top_n=20)
    await ctx.send(embed=embed)

# === Bot Runner ===
if __name__ == "__main__":
    async def main():
        try:
            async with bot:
                await load_extensions()
                await bot.start(TOKEN)
        except KeyboardInterrupt:
            logger.info("👋 Bot shutdown by user.")

    asyncio.run(main())