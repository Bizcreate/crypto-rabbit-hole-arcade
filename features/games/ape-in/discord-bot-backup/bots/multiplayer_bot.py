from datetime import datetime
import discord
from discord.ext import commands

from typing import List, Dict, Optional
from game_logic.multiplayer_game import MultiplayerGame
from utils.post_results import post_results_to_channel
from utils.thread_manager import close_game_thread
from views.multiplayer_join_view import MultiplayerJoinView
from views.multiplayer_draw_card_view import MultiplayerDrawCardView
from views.dice_roll_view import DiceRollView
from views.stack_options_view import StackOptionsView
from views.start_game_view import StartGameView
from utils.timeout_handler import TimeoutHandler
from utils.leaderboard_store import record_game_result, save_db  # Leaderboard utilities

active_multiplayer_games = {}


class MultiplayerBot(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.timeout_handler = TimeoutHandler()

    async def start_multiplayer_lobby(self, interaction: discord.Interaction):
        print(f"🔍 start_multiplayer_lobby called for user ID: {interaction.user.id}")
        """Starts a multiplayer lobby."""
        try:
            # Get the #multiplayer-requests channel
            multiplayer_requests_channel = self.bot.get_channel(1397794189680574474)
            if not multiplayer_requests_channel:
                await interaction.response.send_message(
                    "❌ Could not find the #multiplayer-requests channel.", ephemeral=True
                )
                return

            # Create a thread in the #multiplayer-requests channel
            thread = await multiplayer_requests_channel.create_thread(
                name=f"🌐 multiplayer-{interaction.user.display_name.lower()}",
                type=discord.ChannelType.public_thread,
                reason="New Multiplayer Game",
            )

            # Initialize the game instance
            players = [(interaction.user.id, interaction.user.display_name)]
            game_instance = MultiplayerGame(players)

            # Initialize the game and store it in the active games dictionary
            active_multiplayer_games[interaction.user.id] = {
                "game": game_instance,
                "thread": thread,
                "initiator_id": interaction.user.id,
            }
            print(f"✅ Game initialized for user ID: {interaction.user.id}")
            print(f"📂 Active games: {active_multiplayer_games}")

            # Add the StartGameView to the thread
            start_game_view = StartGameView(
                initiator_id=interaction.user.id,
                on_start_callback=lambda: self.start_multiplayer_game(interaction.user.id),
            )
            await thread.send(
                "🚀 **The game is ready!**\n"
                "The initiator can start the game once at least 4 players have joined.",
                view=start_game_view,
            )

            # Send the join button to the #multiplayer-requests channel
            join_view = MultiplayerJoinView(
                bot=self.bot,
                game_id=interaction.user.id,
                initiator_id=interaction.user.id,
                on_join_callback=lambda user: self.add_player_to_game(user, interaction.user.id),
                on_start_callback=lambda: self.start_multiplayer_game(interaction.user.id),
                required_players=6,
                thread=thread,
            )
            await multiplayer_requests_channel.send(
                f"🌐 **New Multiplayer Match Created!**\n"
                f"👥 Initiator: {interaction.user.mention}\n"
                f"Click the button below to join the match!",
                view=join_view,
            )

            # Send the lobby message in the thread
            await thread.send(
                f"🌐 **Multiplayer Match Lobby**\n"
                f"👥 Initiator: {interaction.user.mention}\n"
                f"🎴 Players can join the match using the button in the #multiplayer-requests channel.\n"
                f"🏑 First to 150 sats or most points after 15 rounds wins!\n"
                f"Waiting for all players to join...\n"
                f"Players joined: 1 of 6"
            )

        except discord.Forbidden:
            await interaction.response.send_message("❌ I don't have permission to create a thread.", ephemeral=True)
        except discord.HTTPException as e:
            await interaction.response.send_message(f"❌ Failed to create a thread: {e}", ephemeral=True)

    async def add_player_to_game(self, user: discord.Member, game_id: int):
        """Adds a player to the multiplayer game."""
        print(f"🔍 Adding player {user.display_name} to game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            print(f"❌ No active game found for ID: {game_id}")
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]

        # Check if the user is already in the game
        if any(player.user_id == user.id for player in game.players):
            await thread.send(f"⚠️ {user.mention} is already in the game.")
            return

        # Check if the game is full
        if len(game.players) >= 6:
            await thread.send(f"⚠️ Game is full. Cannot add more players.")
            return

        # Add the player to the game
        game.add_player(user.id, user.display_name)
        await thread.send(f"✅ {user.mention} has joined the match! Total players: {len(game.players)} of 6")

        # Automatically add the player to the thread
        try:
            await thread.add_user(user)
        except discord.NotFound:
            print(f"❌ Thread not found while adding {user.display_name}. It may have been deleted.")
        except discord.Forbidden:
            print(f"❌ Failed to add {user.display_name} to the thread. Missing permissions.")
        except Exception as e:
            print(f"❌ Unexpected error while adding {user.display_name} to the thread: {e}")

        # Update the StartGameView button state
        start_game_view = StartGameView(
            initiator_id=data["initiator_id"],
            on_start_callback=lambda: self.start_multiplayer_game(game_id),
        )
        start_game_view.update_button_state(len(game.players))
        await thread.send(view=start_game_view)

        # Automatically start the game if 6 players have joined
        if len(game.players) == 6:
            await self.start_multiplayer_game(game_id)

    async def start_multiplayer_game(self, game_id: int):
        """Starts the multiplayer game."""
        print(f"🔍 Looking for game with ID: {game_id}")  # Debugging log
        print(f"📂 Active games: {active_multiplayer_games}")  # Debugging log
        data = active_multiplayer_games.get(game_id)
        if not data:
            print(f"❌ No active game found for ID: {game_id}")  # Debugging log
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]

        if len(game.players) < 4:
            await thread.send("❌ At least 4 players are required to start the match.")
            return

        await thread.send(
            f"🌐 **Multiplayer Match Begins!**\n"
            f"👥 Players: {', '.join(player.name for player in game.players)}\n"
            f"🎴 Draw cards, 🎲 roll dice, 📈 stack sats, and ⚠️ dodge penalties!\n"
            f"🏑 First to 150 sats or most points after 15 rounds wins!\n"
            f"Let’s begin…"
        )

        # Begin the first turn
        await self.begin_turn(game_id)

    async def begin_turn(self, game_id: int):
        """Begins the turn for the current player."""
        print(f"🔍 Beginning turn for game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            print(f"❌ No active game found for ID: {game_id}")
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        # Announce the round if it's the first player's turn
        if game.current_player_index == 0:
            await thread.send(f"🔄 **Round {game.round_count}** begins!")

        # Announce the current player's turn and their score
        await thread.send(
            f"🎮 It's now **{current_player.name}'s** turn! "
            f"Current score: **{current_player.total_score}**"
        )

        # Reset timeout handler for the previous player
        self.timeout_handler.remove_tracker(current_player.user_id)

        # Start the timeout handler for the current player's turn
        await self.timeout_handler.start_turn_timeout(
            current_player.user_id,
            thread,
            120,
            user_mention=current_player.name,
            on_timeout_callback=lambda uid=current_player.user_id: self.handle_idle_forfeit(uid, game_id)
        )

        # Add the MultiplayerDrawCardView to the thread
        draw_card_view = MultiplayerDrawCardView(
            player_id=current_player.user_id,
            on_draw_callback=lambda uid, interaction: self.handle_draw_card(game_id, uid, interaction),
            timeout=60,
        )
        await thread.send("🃏 Click below to draw a card:", view=draw_card_view)

    async def handle_draw_card(self, game_id: int, player_id: int, interaction: discord.Interaction):
        """Handles the draw card action for the current player."""
        print(f"🔍 Handling draw card for game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            print(f"❌ No active game found for ID: {game_id}")
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        if current_player.user_id != player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            return

        card = game.draw_card()
        if not card:
            await thread.send("❌ You cannot draw a card right now.")
            return

        # Send the card details and image
        embed = discord.Embed(
            title=f"{current_player.name} drew a card!",
            color=discord.Color.blue(),
        )
        if card.filename:
            embed.set_image(url=f"https://thecryptorabbithole.io/risk_reward/cards/{card.filename}")

        await thread.send(embed=embed)

        # Add the DiceRollView to the thread
        dice_roll_view = DiceRollView(
            player_id=current_player.user_id,
            on_roll_callback=lambda uid, interaction: self.handle_roll_dice(game_id, uid, interaction),
            timeout=60,
        )
        await thread.send("🎲 Click below to roll the dice:", view=dice_roll_view)

    async def handle_roll_dice(self, game_id: int, player_id: int, interaction: discord.Interaction):
        """Handles the dice roll action for the current player."""
        print(f"🔍 Handling dice roll for game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            print(f"❌ No active game found for ID: {game_id}")
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        if current_player.user_id != player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            return

        result, value = game.roll_dice()
        if result == "bust":
            await thread.send(f"💥 {current_player.name} rolled a **{value}** and busted!")
            await self.end_turn(game_id)
        elif result == "penalty":
            await thread.send(f"⚠️ {current_player.name} rolled a **{value}** and received a penalty!")
            await self.end_turn(game_id)
        elif result == "dodged":
            await thread.send(f"🛡️ {current_player.name} dodged the penalty! Rolled a {value}.")
            await self.offer_stack_decision(game_id)
        elif result == "success":
            await thread.send(f"✅ {current_player.name} rolled a {value}! Turn sats: **{current_player.turn_score}**.")
            await self.offer_stack_decision(game_id)

    async def offer_stack_decision(self, game_id: int):
        """Offers the current player the option to stack sats or continue."""
        data = active_multiplayer_games.get(game_id)
        if not data:
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        stack_options_view = StackOptionsView(
            player_id=current_player.user_id,
            on_draw_callback=lambda uid, interaction: self.handle_draw_card(game_id, uid, interaction),  # Added
            on_stack_callback=lambda uid, interaction: self.handle_stack_points(game_id, uid, interaction),
            on_forfeit_callback=lambda: self.handle_forfeit_turn(game_id),
            timeout=60,
        )
        await thread.send("📈 Choose your next move:", view=stack_options_view)

    async def handle_stack_points(self, game_id: int, user_id: int, interaction: discord.Interaction):
        """Handles stacking points for the current player."""
        print(f"🔍 Handling stack points for game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        if current_player.user_id != user_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            return

        game.stack_sats()
        await thread.send(f"📥 {current_player.name} stacked their sats! Total sats: **{current_player.total_score}**")

        if game.check_game_over():
            await self.finish_game(game_id)
        else:
            await self.end_turn(game_id)

    async def end_turn(self, game_id: int):
        """Ends the current player's turn and advances to the next player."""
        print(f"🔍 Ending turn for game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        # Reset timeout handler for the current player
        self.timeout_handler.remove_tracker(current_player.user_id)

        game.advance_turn()

        # Check if the round is complete
        if game.current_player_index == 0:
            # Generate round summary
            round_summary = "\n".join(
                [f"🔹 {player.name}'s Total Score: **{player.total_score}**" for player in game.players]
            )
            await thread.send(f"🏁 **Round {game.round_count - 1} Summary**:\n{round_summary}")

        await self.begin_turn(game_id)

    async def finish_game(self, game_id: int):
        """Finishes the game and announces the winner."""
        print(f"🔍 Finishing game for game ID: {game_id}")
        data = active_multiplayer_games.pop(game_id, None)
        if not data:
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]

        # Determine the winner
        winner = game.get_winner()
        if winner:
            await thread.send(f"🏆 {winner.name} wins the game with {winner.total_score} points!")
        else:
            await thread.send("🤝 The game ended in a tie!")

        # Calculate the highest score directly
        highest_score = max(player.total_score for player in game.players)

        # Update leaderboard (log only the winner)
        try:
            if winner:  # Only log the winner
                await record_game_result(
                    winner_id=winner.user_id,
                    winner_name=winner.name,
                    score=winner.total_score,
                    mode="Multiplayer",
                    participant_ids=[player.user_id for player in game.players],
                    participant_names=[player.name for player in game.players],
                    duration_sec=game.round_count * self.timeout_handler.IDLE_TIMEOUT
                )
        except Exception as e:
            print(f"❌ Error updating leaderboard: {e}")

        # Post results to the general chat channel
        await post_results_to_channel(
            self.bot,
            winner_name=winner.name if winner else "Tie",
            total_score=highest_score,
            game_mode="Multiplayer",
        )

        # Send a summary of scores to the thread
        score_summary = "\n".join([f"🔹 {player.name}: {player.total_score}" for player in game.players])
        await thread.send(f"📊 **Final Scores:**\n{score_summary}")

        # Close the game thread
        await close_game_thread(thread)

    async def handle_idle_forfeit(self, user_id: int, game_id: int):
        """Handles a player's turn timeout by forfeiting their turn."""
        print(f"🔍 Handling idle forfeit for user ID: {user_id} in game ID: {game_id}")
        data = active_multiplayer_games.get(game_id)
        if not data:
            print(f"❌ No active game found for ID: {game_id}")
            return

        game: MultiplayerGame = data["game"]
        thread: discord.Thread = data["thread"]
        current_player = game.current_player()

        # Check if the current player matches the timed-out user
        if current_player.user_id != user_id:
            print(f"❌ Timeout mismatch: Expected {current_player.user_id}, got {user_id}")
            return

        # Announce the timeout and forfeit the turn
        await thread.send(f"⏳ {current_player.name} took too long and forfeited their turn!")

        # Check if the game is over
        if game.check_game_over():
            await self.finish_game(game_id)
        else:
            # End the current player's turn and advance to the next player
            await self.end_turn(game_id)

            # Refresh the View for the next player
            await self.begin_turn(game_id)

# ✅ Required for cog loading
async def setup(bot: commands.Bot):
    await bot.add_cog(MultiplayerBot(bot))