# views/leaderboard_view.py

import discord
import json
import os

LEADERBOARD_FILE = "leaderboard.json"

class LeaderboardView:
    @staticmethod
    def get_leaderboard_embed(top_n: int = 10) -> discord.Embed:
        """
        Load leaderboard data and format it as an embed.
        Args:
            top_n: Number of top players to display.
        """
        embed = discord.Embed(
            title=f"🏆 Risk-Reward Leaderboard (Top {top_n})",
            description="Players ranked by total sats stacked!",
            color=discord.Color.gold()
        )

        # Load data
        if not os.path.exists(LEADERBOARD_FILE):
            embed.add_field(name="No data yet!", value="Play a few matches to appear here.", inline=False)
            return embed

        with open(LEADERBOARD_FILE, "r") as f:
            try:
                data = json.load(f)
            except Exception:
                embed.add_field(name="Error", value="Could not load leaderboard data.", inline=False)
                return embed

        if not data:
            embed.add_field(name="No scores yet!", value="Once players complete games, scores will appear here.", inline=False)
            return embed

        # Sort and display top N
        sorted_scores = sorted(data.items(), key=lambda x: x[1], reverse=True)[:top_n]
        for rank, (player, score) in enumerate(sorted_scores, start=1):
            if rank == 1:
                medal = "🥇"
            elif rank == 2:
                medal = "🥈"
            elif rank == 3:
                medal = "🥉"
            else:
                medal = f"`#{rank}`"
            embed.add_field(name=f"{medal} {player}", value=f"**{score} sats**", inline=False)

        return embed

    @staticmethod
    def get_leaderboard_button(top_n: int = 20):
        """
        Returns a Discord button that, when pressed, shows the top N leaderboard.
        (Requires integration in a View and a callback in your bot.)
        """
        return discord.ui.Button(
            label=f"Show Top {top_n}",
            style=discord.ButtonStyle.primary,
            custom_id=f"show_leaderboard_top_{top_n}"
        )

# --- Usage notes ---

# 1. To view the leaderboard, you should add a command to your bot, e.g.:
# @bot.command(name="leaderboard")
# async def leaderboard(ctx):
#     embed = LeaderboardView.get_leaderboard_embed(top_n=20)
#     await ctx.send(embed=embed)

# 2. To use a button for the top 20, add the button from get_leaderboard_button() to a discord.ui.View,
#    and in your callback, send the embed from get_leaderboard_embed(top_n=20).