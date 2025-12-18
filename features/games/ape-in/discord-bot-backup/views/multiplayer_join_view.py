import discord
from discord.ext.commands import Bot
from discord.ui import View, Button
from typing import Callable, Awaitable


class MultiplayerJoinView(View):
    def __init__(
        self,
        bot: Bot,
        game_id: int,
        initiator_id: int,
        on_join_callback: Callable[[discord.Member], Awaitable[None]],
        on_start_callback: Callable[[], Awaitable[None]],
        required_players: int = 6,
        timeout: int = 120,
        thread: discord.Thread = None,
    ):
        super().__init__(timeout=timeout)
        self.bot = bot
        self.game_id = game_id
        self.initiator_id = initiator_id
        self.on_join_callback = on_join_callback
        self.on_start_callback = on_start_callback
        self.required_players = required_players
        self.players = []  # Will be initialized after fetching initiator's display name
        self.message = None
        self.thread = thread  # Reference to the thread for updates
        self.start_game_timer = None  # Timer for automatic start

    async def on_timeout(self):
        """Handles timeout for the view."""
        if self.message:
            try:
                await self.message.edit(content="⏰ Multiplayer game timed out. Not enough players joined.", view=None)
            except discord.NotFound:
                print("❌ Message not found during timeout handling. It may have been deleted.")
            except Exception as e:
                print(f"Error during on_timeout: {e}")

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        """Prevents duplicate joins."""
        if any(uid == interaction.user.id for uid, _ in self.players):
            await interaction.response.send_message("🛑 You've already joined!", ephemeral=True)
            return False
        return True

    @discord.ui.button(label="🎲 Join Game (1 of 6)", style=discord.ButtonStyle.green)
    async def join_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        """Handles the 'Join Game' button."""
        try:
            # Add the player to the game
            self.players.append((interaction.user.id, interaction.user.display_name))
            await self.on_join_callback(interaction.user)  # Synchronize with MultiplayerGame

            # Update the button label to show the number of players joined
            button.label = f"🎲 Join Game ({len(self.players)} of {self.required_players})"

            # Automatically add the player to the thread
            if self.thread:
                try:
                    await self.thread.add_user(interaction.user)
                    await self.thread.send(f"✅ {interaction.user.mention} has joined the match!")
                except discord.NotFound:
                    await interaction.response.send_message("❌ The game thread no longer exists.", ephemeral=True)
                except discord.Forbidden:
                    await interaction.response.send_message("❌ I don't have permission to add you to the thread.", ephemeral=True)
                except Exception as e:
                    print(f"Unexpected error in join_button: {e}")
                    await interaction.response.send_message("❌ An unexpected error occurred. Please try again later.", ephemeral=True)

            # Update the view
            try:
                await interaction.response.edit_message(view=self)
            except discord.NotFound:
                await interaction.response.send_message("❌ This interaction has expired. Please try again.", ephemeral=True)
            except discord.InteractionResponded:
                print("❌ Interaction has already been responded to.")
            except Exception as e:
                print(f"❌ Unexpected error while editing the message: {e}")

            # Automatically start the game if the required number of players have joined
            if len(self.players) == self.required_players:
                self.stop()
                if self.message:
                    await self.message.edit(content="🚨 Multiplayer game is starting!", view=None)
                await self.on_start_callback()

            # Start a timer to automatically start the game after 60 seconds if at least 4 players have joined
            if len(self.players) >= 4 and not self.start_game_timer:
                self.start_game_timer = self.bot.loop.call_later(60, self.auto_start_game)

            # Enable the "Start Game" button if at least 4 players have joined
            for item in self.children:
                if isinstance(item, discord.ui.Button) and item.label == "Start Game":
                    item.disabled = len(self.players) < 4
                    break

        except Exception as e:
            print(f"❌ Unexpected error in join_button: {e}")

    @discord.ui.button(label="Start Game", style=discord.ButtonStyle.success, disabled=True)
    async def start_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        """Handles the 'Start Game' button."""
        if interaction.user.id != self.initiator_id:
            await interaction.response.send_message("⛔ Only the initiator can start the match.", ephemeral=True)
            return

        if len(self.players) < 4:
            await interaction.response.send_message("❌ At least 4 players are required to start the match.", ephemeral=True)
            return

        self.stop()
        if self.message:
            await self.message.edit(content="🚨 Multiplayer game is starting!", view=None)
        await self.on_start_callback()

    async def send_initial_message(self, channel: discord.TextChannel):
        """Posts the initial multiplayer announcement."""
        # Fetch the initiator's display name
        initiator = channel.guild.get_member(self.initiator_id)
        initiator_name = initiator.display_name if initiator else "Initiator"
        self.players = [(self.initiator_id, initiator_name)]

        # Update the "Start Game" button for the initiator
        for item in self.children:
            if isinstance(item, discord.ui.Button) and item.label == "Start Game":
                item.disabled = True  # Initially disabled
                break

        joined_names = ", ".join(name for _, name in self.players)
        self.message = await channel.send(
            content=(
                f"🚨 **Multiplayer Match Starting!**\n"
                f"Click the button below to join.\n\n"
                f"🧪 Players joined: {joined_names} (1/{self.required_players})"
            ),
            view=self
        )

    def auto_start_game(self):
        """Automatically starts the game after 60 seconds if at least 4 players have joined."""
        if len(self.players) >= 4:
            self.stop()
            if self.message:
                self.bot.loop.create_task(
                    self.message.edit(content="🚨 Multiplayer game is starting automatically!", view=None)
                )
            self.bot.loop.create_task(self.on_start_callback())