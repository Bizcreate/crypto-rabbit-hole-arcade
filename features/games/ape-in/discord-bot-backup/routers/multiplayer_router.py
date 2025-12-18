# routers/multiplayer_router.py

import discord
from discord.ext import commands
from utils.constants import CHANNEL_PLAY_MINIGAMES_ID  # Use numeric ID for accuracy
from views.multiplayer_join_view import MultiplayerJoinView
import logging

logger = logging.getLogger(__name__)

class MultiplayerRouter(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.active_multiplayer_games = {}  # Optional: track active games

    @commands.command(name="multiplayer", help="Start a multiplayer match in Risk-Reward: Stack Those Sats!")
    async def start_multiplayer_match(self, ctx: commands.Context):
        """Posts a joinable multiplayer game recruitment message in the correct channel."""

        if ctx.channel.id != CHANNEL_PLAY_MINIGAMES_ID:
            await ctx.send("❌ Please use this command in the #play-risk-reward channel.")
            return

        try:
            view = MultiplayerJoinView(self.bot, host_user=ctx.author)
            await ctx.send(
                f"🌐 **Multiplayer Match Forming!**\n"
                f"🎮 Host: {ctx.author.mention}\n"
                f"Click the button below to join. Game will start when full!",
                view=view
            )
        except Exception as e:
            await ctx.send("❌ An error occurred while starting the multiplayer game.")
            logger.error(f"[MultiplayerRouter Error] {e}")

# Required for bot.load_extension()
async def setup(bot: commands.Bot):
    await bot.add_cog(MultiplayerRouter(bot))