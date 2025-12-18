import discord
from discord.ext import commands
from bots import enj1n_bot  # Assuming enj1n_bot.py is inside the bots/ directory


class Enj1nRouter(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="enj1n", help="Start a game of Risk-Reward: Stack Those Sats! vs Enj-1n")
    async def start_enj1n(self, ctx):
        await enj1n_bot.start_enj1n_game(ctx)

    @commands.command(name="rules", help="View the rules for Risk-Reward: Stack Those Sats!")
    async def show_rules(self, ctx):
        rules = [
            "**🎮 RISK-REWARD: STACK THOSE SATS!**",
            "1. 🎴 Draw a card and see its point value.",
            "2. 🎲 Roll a die — if you roll a 1, you bust and lose your turn sats.",
            "3. 🛡️ Some cards are Bearish! Roll an even number to dodge the penalty, odd to take it.",
            "4. 📥 You may stack your sats at any time to save your points.",
            "5. 🏁 First to 300 sats or most after 20 rounds wins!",
            "Use `!enj1n` to play vs Enj-1n, or try other bots like `!sandy`, `!aida`, `!lana`, or `!pvp`."
        ]
        await ctx.send("\n".join(rules))


async def setup(bot):
    await bot.add_cog(Enj1nRouter(bot))
