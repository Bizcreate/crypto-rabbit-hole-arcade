import discord
from discord.ext import commands
from bots import lana_bot  # Assuming lana_bot.py is inside the bots/ directory


class LanaRouter(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="lana", help="Start a game of Risk-Reward: Stack Those Sats! vs Lana")
    async def start_lana(self, ctx):
        await lana_bot.start_lana_game(ctx)

    @commands.command(name="rules", help="View the rules for Risk-Reward: Stack Those Sats!")
    async def show_rules(self, ctx):
        rules = [
            "**🎮 RISK-REWARD: STACK THOSE SATS!**",
            "1. 🎴 Draw a card and see its point value.",
            "2. 🎲 Roll a die — if you roll a 1, you bust and lose your turn sats.",
            "3. 🛡️ Some cards are Bearish! Roll an even number to dodge the penalty, odd to take it.",
            "4. 📥 You may stack your sats at any time to save your points.",
            "5. 🏁 First to 300 sats or most after 20 rounds wins!",
            "Use `!lana` to play vs Lana, or try other bots like `!sandy`, `!aida`, or `!pvp`."
        ]
        await ctx.send("\n".join(rules))


async def setup(bot):
    await bot.add_cog(LanaRouter(bot))
