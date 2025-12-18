import discord
from discord.ext import commands
from bots import nifty_bot  # Assuming nifty_bot.py is inside the bots/ directory


class NiftyRouter(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="nifty", help="Start a game of Risk-Reward: Stack Those Sats! vs Nifty")
    async def start_nifty(self, ctx):
        await nifty_bot.start_nifty_game(ctx)

    @commands.command(name="rules", help="View the rules for Risk-Reward: Stack Those Sats!")
    async def show_rules(self, ctx):
        rules = [
            "**🎮 RISK-REWARD: STACK THOSE SATS!**",
            "1. 🎴 Draw a card and see its point value.",
            "2. 🎲 Roll a die — if you roll a 1, you bust and lose your turn sats.",
            "3. 🛡️ Some cards are Bearish! Roll an even number to dodge the penalty, odd to take it.",
            "4. 📥 You may stack your sats at any time to save your points.",
            "5. 🏁 First to 300 sats or most after 20 rounds wins!",
            "Use `!nifty` to play vs Nifty, or try other bots like `!sandy`, `!aida`, `!lana`, or `!pvp`."
        ]
        await ctx.send("\n".join(rules))


async def setup(bot):
    await bot.add_cog(NiftyRouter(bot))
