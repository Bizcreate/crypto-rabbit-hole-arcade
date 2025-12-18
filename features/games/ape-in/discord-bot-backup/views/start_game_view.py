import discord
from discord.ui import View
from typing import Callable, Awaitable


class StartGameView(View):
    """
    A Discord UI View for the initiator to manually start the game.
    """
    def __init__(self, initiator_id: int, on_start_callback: Callable[[], Awaitable[None]], min_players: int = 4):
        """
        :param initiator_id: The Discord user ID of the game initiator.
        :param on_start_callback: Callback function to start the game.
        :param min_players: Minimum number of players required to enable the button.
        """
        super().__init__(timeout=None)
        self.initiator_id = initiator_id
        self.on_start_callback = on_start_callback
        self.min_players = min_players

    @discord.ui.button(label="Start Game", style=discord.ButtonStyle.success, disabled=True)
    async def start_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        """
        Handles the start game button click.
        """
        if interaction.user.id != self.initiator_id:
            await interaction.response.send_message("❌ Only the initiator can start the game.", ephemeral=True)
            return

        # Trigger the start game callback
        await interaction.response.defer()
        await self.on_start_callback()

    def update_button_state(self, current_players: int):
        """
        Updates the button state based on the number of players.
        """
        for item in self.children:
            if isinstance(item, discord.ui.Button) and item.label == "Start Game":
                item.disabled = current_players < self.min_players
                break