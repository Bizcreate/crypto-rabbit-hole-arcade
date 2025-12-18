# routers/pvp_router.py

import discord
from discord.ext import commands
from views.pvp_join_view import PvpJoinView
import logging

logger = logging.getLogger(__name__)

# Optional: If you want to restrict PvP requests to a specific channel, set this ID
# from utils.constants import CHANNEL_PVP_REQUESTS_ID

# Global reference to dispatch from main_menu_view
async def start_pvp_lobby(interaction: discord.Interaction):
    """
    Allows the main menu button to launch the PvP lobby via interaction.
    """
    try:
        view = PvpJoinView(interaction.client, initiator=interaction.user)
        await view.send_initial_message()
    except Exception as e:
        await interaction.followup.send("❌ Error posting PvP matchmaking message.", ephemeral=True)
        logger.error(f"[PvP Router Error] {e}")

class PvpRouter(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command(name="pvp", help="Start a PvP game of Risk-Reward: Stack Those Sats!")
    async def pvp_command(self, ctx: commands.Context, opponent: discord.Member = None):
        """
        Starts a PvP game directly if an opponent is mentioned,
        otherwise posts a matchmaking message to the current channel.
        """
        # Optional: Restrict to a specific channel
        # if ctx.channel.id != CHANNEL_PVP_REQUESTS_ID:
        #     await ctx.send(f"❗ Please use this command in <#{CHANNEL_PVP_REQUESTS_ID}>.")
        #     return

        if opponent:
            if opponent == ctx.author:
                await ctx.send("❗ You can't play PvP against yourself. Mention another player or wait for matchmaking.")
                return
            try:
                view = PvpJoinView(self.bot, initiator=ctx.author, opponent=opponent)
                await view.send_initial_message()
            except Exception as e:
                await ctx.send("❌ Error posting PvP matchmaking message.")
                logger.error(f"[PvP Router Error] {e}")
        else:
            try:
                view = PvpJoinView(self.bot, initiator=ctx.author)
                await view.send_initial_message()
            except Exception as e:
                await ctx.send("❌ Error posting PvP matchmaking message.")
                logger.error(f"[PvP Router Error] {e}")

    @commands.command(name="rules", help="View the rules for Risk-Reward: Stack Those Sats!")
    async def show_rules(self, ctx: commands.Context):
        """Show the rules for Risk-Reward: Stack Those Sats!"""
        rules = [
            "**🎮 RISK-REWARD: STACK THOSE SATS!**",
            "1. 🎴 Draw a card and see its point value.",
            "2. 🎲 Roll a die — if you roll a 1, you bust and lose your turn sats.",
            "3. 🛡️ Some cards are Bearish! Roll even to dodge, odd to take the penalty.",
            "4. 📥 Stack your sats any time to save your turn score.",
            "5. 🏁 First to 300 sats or most after 20 rounds wins!",
            "Play with `!sandy`, `!aida`, `!lana`, `!enj1n`, or try `!pvp`!"
        ]
        await ctx.send("\n".join(rules))

# Required for dynamic loading
async def setup(bot: commands.Bot):
    await bot.add_cog(PvpRouter(bot))