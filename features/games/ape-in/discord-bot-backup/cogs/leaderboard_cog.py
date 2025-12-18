# cogs/leaderboard_cog.py
import discord
from discord.ext import commands
from utils.leaderboard_store import get_top_players, get_player_stats

class LeaderboardCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.hybrid_command(name="leaderboard", description="Show the Top 20 Risk-Reward players")
    async def leaderboard(self, ctx: commands.Context):
        rows = await get_top_players(limit=20)
        if not rows:
            await ctx.send("No results yet. Be the first to play!")
            return

        embed = discord.Embed(title="🏆 Risk-Reward Leaderboard", description="Top 20 by total score", color=0xFFD700)
        for i, r in enumerate(rows, start=1):
            line = f"**{i}. {r.get('name','Unknown')}** — {r.get('score',0)} pts | {r.get('wins',0)}W-{r.get('losses',0)}L ({r.get('games_played',0)} games)"
            embed.add_field(name="\u200b", value=line, inline=False)

        await ctx.send(embed=embed)

    @commands.hybrid_command(name="player", description="Show your Risk-Reward stats (or mention someone)")
    async def player(self, ctx: commands.Context, member: discord.Member = None):
        member = member or ctx.author
        stats = await get_player_stats(str(member.id))
        if not stats:
            await ctx.send(f"No stats for {member.display_name} yet.")
            return

        embed = discord.Embed(title=f"📊 {stats['name']}'s Stats", color=0x00AAFF)
        embed.add_field(name="Total Score", value=str(stats.get("score", 0)), inline=True)
        embed.add_field(name="Wins", value=str(stats.get("wins", 0)), inline=True)
        embed.add_field(name="Losses", value=str(stats.get("losses", 0)), inline=True)
        embed.add_field(name="Games Played", value=str(stats.get("games_played", 0)), inline=True)
        embed.set_footer(text=f"Last seen: {stats.get('last_seen','—')}")
        await ctx.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(LeaderboardCog(bot))
