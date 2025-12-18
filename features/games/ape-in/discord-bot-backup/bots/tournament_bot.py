import discord
from discord.ext import commands
from typing import Tuple
from utils.thread_manager import close_game_thread
from utils.post_results import post_results_to_channel
from utils.score_utils import format_score_message
from game_logic.tournament_manager import TournamentManager
from views.pvp_draw_card_view import PvpDrawCardView
from views.dice_roll_view import DiceRollView
from views.stack_options_view import StackOptionsView
from utils.timeout_handler import TimeoutHandler
from views.leaderboard_view import LeaderboardView
import asyncio

tournament = TournamentManager()

class TournamentBot(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="tourney", help="Start a 6-player tournament sign-up for Risk-Reward!")
    async def tournament_signup(self, ctx):
        if tournament.tournament_active:
            await ctx.send("❗ A tournament is already in progress.")
            return

        tournament.reset_tournament()
        signup_embed = discord.Embed(
            title="🏆 Risk-Reward TOURNAMENT SIGN-UP",
            description="Click the button below to join! First 6 players will be entered.",
            color=discord.Color.gold()
        )

        view = TournamentSignUpView(ctx.author)
        message = await ctx.send(embed=signup_embed, view=view)

        # Wait for sign-up period, then timeout if not enough players
        try:
            await asyncio.sleep(120)
            if not tournament.is_ready() and tournament.tournament_active:
                await message.edit(content="⏳ Sign-up timed out. Not enough players joined.", embed=None, view=None)
                tournament.reset_tournament()
            elif not tournament.tournament_active:
                await message.edit(content="❌ Tournament was cancelled.", embed=None, view=None)
        except Exception as e:
            await ctx.send(f"⚠️ Error during tournament sign-up: {e}")

    @commands.command(name="tourneywin", help="Report match winner during the tournament.")
    async def report_winner(self, ctx, winner: discord.Member):
        if not tournament.tournament_active:
            await ctx.send("❌ No tournament is currently running.")
            return

        result = tournament.report_match_winner(winner.id, winner.display_name)
        await ctx.send(result)

        if tournament.tournament_active:
            await ctx.send(tournament.get_bracket_summary())
            await run_next_match(ctx.channel)
        else:
            await ctx.send("🎉 Tournament complete!")
            await ctx.send(embed=LeaderboardView.get_leaderboard_embed())

class TournamentSignUpView(discord.ui.View):
    def __init__(self, initiator):
        super().__init__(timeout=120)  # Match the sign-up window
        self.initiator = initiator
        self.message: discord.Message = None

    @discord.ui.button(label="Join Tournament", style=discord.ButtonStyle.success)
    async def join_tournament(self, interaction: discord.Interaction, button: discord.ui.Button):
        user_id = interaction.user.id
        user_name = interaction.user.display_name
        success, message = tournament.add_player(user_id, user_name)

        await interaction.response.send_message(message, ephemeral=True)

        if tournament.is_ready():
            started, msg = tournament.start_tournament()
            if self.message:
                await self.message.edit(content="✅ Tournament is starting!", embed=None, view=None)
            await interaction.channel.send(msg)
            await interaction.channel.send(tournament.get_bracket_summary())
            await run_next_match(interaction.channel)

    async def on_timeout(self):
        # Disable the join button and update the message
        for child in self.children:
            child.disabled = True
        if self.message:
            try:
                await self.message.edit(content="⏰ Tournament sign-up timed out.", view=self)
            except Exception:
                pass

async def run_next_match(channel: discord.TextChannel):
    match = tournament.get_next_match()
    if not match:
        await channel.send("✅ All matches complete.")
        return

    p1 = match[0]
    p2 = match[1]

    # Create match thread with error handling
    try:
        thread = await channel.create_thread(
            name=f"{p1[1]} vs {p2[1]}",
            type=discord.ChannelType.public_thread,
            reason="Tournament Match"
        )
        await thread.send(f"🎮 Tournament Match:\n**{p1[1]}** vs **{p2[1]}**\n\nUse `/pvp` to begin your match!")
    except Exception as e:
        await channel.send(f"⚠️ Failed to create match thread: {e}")
        await channel.send(f"**{p1[1]}** vs **{p2[1]}** — please play your match here.")

# ✅ Required for cog setup
async def setup(bot: commands.Bot):
    await bot.add_cog(TournamentBot(bot))

# Optional helper for View-based menu launch
async def start_tournament_entry(interaction: discord.Interaction):
    ctx = await commands.Context.from_interaction(interaction)
    await TournamentBot(ctx.bot).tournament_signup(ctx)