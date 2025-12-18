from datetime import datetime
import discord
from discord.ext import commands

from typing import Tuple
from utils.thread_manager import close_game_thread
from utils.post_results import post_results_to_channel
from utils.score_utils import format_score_message
from game_logic.pvp_game import PvpGame
from views.pvp_draw_card_view import PvpDrawCardView
from views.dice_roll_view import DiceRollView
from views.stack_options_view import StackOptionsView
from utils.timeout_handler import TimeoutHandler
from utils.leaderboard_store import record_game_result, save_db  # Leaderboard utilities

class PvpBot(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.active_pvp_games = {}
        self.timeout_handler = TimeoutHandler()

    async def start_pvp_game(self, interaction: discord.Interaction, player_name: str = None):
        await interaction.response.send_message(
            "🎲 PvP mode requires 2 players. Mention someone to challenge them! Example:\n`/pvp @Opponent`",
            ephemeral=True
        )

    async def begin_match(self, interaction: discord.Interaction, player1_id, player2_id):
        guild = interaction.guild
        player1 = guild.get_member(player1_id)
        player2 = guild.get_member(player2_id)

        if not player1 or not player2:
            await interaction.followup.send("❌ One or both players could not be found.", ephemeral=True)
            return

        if player1_id in self.active_pvp_games or player2_id in self.active_pvp_games:
            await interaction.followup.send("⚠️ One of the players already has a game in progress.", ephemeral=True)
            return

        try:
            thread = await interaction.channel.create_thread(
                name=f"⚔️ pvp-{player1.display_name.lower()}-vs-{player2.display_name.lower()}",
                type=discord.ChannelType.public_thread,
                reason="New PvP Game",
            )
        except discord.HTTPException as e:
            await interaction.followup.send(f"❌ Failed to create thread: {e}", ephemeral=True)
            return

        game = PvpGame(player1, player2)
        game.thread = thread
        self.active_pvp_games[player1_id] = game
        self.active_pvp_games[player2_id] = game

        await thread.send(f"⚔️ PvP Match Started: {player1.mention} vs {player2.mention}!")
        await thread.send("🎴 Each turn: draw a card, roll dice, stack sats — or risk it all!")
        await self.begin_turn(game)

    async def begin_turn(self, game: PvpGame):
        current_player = game.get_current_player()
        print(f"Starting turn for: {current_player.display_name}, Current Player Index: {game.current_player_index}")
        thread = game.thread

        if game.current_player_index == 0:
            await thread.send(f"🔄 **Round {game.round_count}** begins!")

        # Create the view for the current player to draw a card
        draw_card_view = PvpDrawCardView(
            player_id=current_player.id,
            on_draw_callback=lambda uid, interaction: self.on_draw_card(uid, interaction, game),
            player_name=current_player.display_name
        )

        await thread.send(f"🎮 {current_player.mention}, it's your turn! Click below to draw a card:", view=draw_card_view)

        # Start the timeout handler for the current player's turn
        await self.timeout_handler.start_turn_timeout(
            current_player.id,
            thread,
            120,
            user_mention=current_player.mention,
            on_timeout_callback=lambda uid=current_player.id: self.handle_idle_forfeit(uid)
        )

    async def on_draw_card(self, user_id, interaction, game: PvpGame):
        print(f"Player {interaction.user.display_name} pressed the draw card button.")

        if user_id != game.get_current_player().id:
            if not interaction.response.is_done():
                await interaction.response.send_message("⛔ Not your turn.", ephemeral=True)
            else:
                await interaction.followup.send("⛔ Not your turn.", ephemeral=True)
            print(f"Invalid turn. Expected player: {game.get_current_player().display_name}, but got: {interaction.user.display_name}")
            return

        card = game.draw_card()

        # Send the card image or fallback message
        if card.filename:
            await game.thread.send(
                content=f"{interaction.user.mention}, you drew a card:",
                embed=discord.Embed().set_image(url=f"https://thecryptorabbithole.io/risk_reward/cards/{card.filename}")
            )
        else:
            await game.thread.send(f"{interaction.user.mention}, you drew a card with no image.")

        # Display the DiceRollView for the current player
        dice_roll_view = DiceRollView(
            player_id=user_id,
            on_roll_callback=lambda uid, interaction: self.on_roll_dice(uid, interaction, game)
        )
        await game.thread.send(f"🎲 {interaction.user.mention}, now roll the dice!", view=dice_roll_view)

    async def on_roll_dice(self, user_id, interaction, game: PvpGame):
        print(f"Player {interaction.user.display_name} pressed the roll dice button.")

        if user_id != game.get_current_player().id:
            await interaction.response.send_message("⛔ Not your turn.", ephemeral=True)
            print(f"Invalid turn. Expected player: {game.get_current_player().display_name}, but got: {interaction.user.display_name}")
            return

        result = game.roll_dice()
        if result[0] == "bust":
            await game.thread.send("💥 You rolled a 1 and busted! No sats this turn.")
            await self.end_turn(game)
        elif result[0] == "penalty":
            await game.thread.send(f"⚠️ Bearish penalty triggered! You rolled a {result[1]} → Penalty applied.")
            await self.end_turn(game)
        elif result[0] == "dodged":
            await game.thread.send(f"🛡️ You dodged the Bearish penalty! Rolled a {result[1]}.")
            await self.offer_stack_decision(game)
        elif result[0] == "success":
            await game.thread.send(f"✅ You rolled a {result[1]}! Turn sats: **{game.turn_scores[game.current_player.id]}**.")
            await self.offer_stack_decision(game)

    async def offer_stack_decision(self, game: PvpGame):
        player_id = game.get_current_player().id
        view = StackOptionsView(
            player_id=player_id,
            on_draw_callback=lambda uid, interaction: self.on_draw_card(uid, interaction, game),
            on_stack_callback=lambda uid, interaction: self.on_stack_sats(uid, interaction, game),
            on_forfeit_callback=lambda uid, interaction: self.on_player_forfeit(uid, interaction, game)
        )
        await game.thread.send("➕ Choose your next move:", view=view)

    async def on_stack_sats(self, user_id, interaction, game: PvpGame):
        if user_id != game.get_current_player().id:
            await interaction.response.send_message("⛔ Not your turn.", ephemeral=True)
            return
        game.stack_sats()
        await game.thread.send(f"📥 Sats stacked. Current total: **{game.get_current_score()}**")
        if game.check_game_end():
            await self.finish_game(game)
        else:
            await self.end_turn(game)

    async def end_turn(self, game: PvpGame):
        print(f"Ending turn for: {game.get_current_player().display_name}")
        if game.check_game_end():
            print("Game has ended.")
            await self.finish_game(game)
        else:
            # Advance the turn
            game.advance_turn()
            print(f"Next turn for: {game.get_current_player().display_name}")

            # Check if the round has ended (both players have completed their turns)
            if game.current_player_index == 0:  # Player 1's turn starts a new round
                player1_score = game.get_score(game.player1)
                player2_score = game.get_score(game.player2)
                await game.thread.send(
                    f"🏁 **Round {game.round_count - 1} Summary**:\n"
                    f"🔹 {game.player1.display_name}'s Total Score: **{player1_score}**\n"
                    f"🔹 {game.player2.display_name}'s Total Score: **{player2_score}**"
                )

            # Begin the next turn
            await self.begin_turn(game)

    async def finish_game(self, game: PvpGame):
        winner = game.get_winner()
        p1 = game.player1
        p2 = game.player2
        summary = format_score_message(
            p1.display_name, game.scores[p1.id],
            p2.display_name, game.scores[p2.id],
            winner.display_name if winner else "Tie"
        )

        # Update leaderboard
        try:
            if winner:
                await record_game_result(
                    winner_id=winner.id,
                    winner_name=winner.display_name,
                    score=max(game.scores[p1.id], game.scores[p2.id]),
                    mode="PvP",
                    participant_ids=[p1.id, p2.id],
                    participant_names=[p1.display_name, p2.display_name],
                    duration_sec=game.round_count * self.IDLE_TIMEOUT
                )
        except Exception as e:
            print(f"❌ Error updating leaderboard: {e}")

        # Post results to the general chat channel
        await game.thread.send(summary)
        await post_results_to_channel(
            self.bot,
            winner_name=winner.display_name if winner else "Tie",
            total_score=max(game.scores[p1.id], game.scores[p2.id]),
            game_mode="PvP",
            player_names=[p1.display_name, p2.display_name],
        )

        # Close the game thread and clean up
        await close_game_thread(game.thread)
        self.timeout_handler.remove_tracker(p1.id)
        self.timeout_handler.remove_tracker(p2.id)
        self.active_pvp_games.pop(p1.id, None)
        self.active_pvp_games.pop(p2.id, None)

    async def on_player_forfeit(self, user_id, interaction, game: PvpGame):
        print(f"Player {interaction.user.display_name} has forfeited the game.")

        if user_id != game.get_current_player().id:
            await interaction.response.send_message("⛔ You cannot forfeit on someone else's turn.", ephemeral=True)
            return

        forfeiter = game.get_player_by_id(user_id)
        opponent = game.get_opponent(forfeiter)

        await game.thread.send(f"🚪 {forfeiter.display_name} has forfeited the game. {opponent.display_name} wins by default!")
        await self.finish_game(game)

    async def handle_idle_forfeit(self, user_id):
        game = self.active_pvp_games.get(user_id)
        if not game:
            return
        forfeiter = game.get_player_by_id(user_id)
        opponent = game.get_opponent(forfeiter)
        await game.thread.send(f"🕒 {forfeiter.display_name} was idle too long. {opponent.display_name} wins by default.")
        await post_results_to_channel(
            self.bot,
            winner_name=opponent.display_name,
            total_score=game.get_score(opponent),
            game_mode="PvP",
            player_names=[forfeiter.display_name, opponent.display_name],
            player_name=forfeiter.display_name
        )
        await close_game_thread(game.thread)
        self.timeout_handler.remove_tracker(forfeiter.id)
        self.timeout_handler.remove_tracker(opponent.id)
        self.active_pvp_games.pop(forfeiter.id, None)
        self.active_pvp_games.pop(opponent.id, None)


async def start_pvp_lobby(interaction: discord.Interaction, player1: Tuple[int, str], player2: Tuple[int, str]):
    bot_cog = interaction.client.get_cog("PvpBot")
    if bot_cog:
        await bot_cog.begin_match(interaction, player1[0], player2[0])
    else:
        await interaction.followup.send("❌ PvP bot not loaded.", ephemeral=True)


async def setup(bot: commands.Bot):
    await bot.add_cog(PvpBot(bot))