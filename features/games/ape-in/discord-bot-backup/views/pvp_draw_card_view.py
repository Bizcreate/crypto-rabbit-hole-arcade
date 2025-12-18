import discord
from discord.ui import View, Button
from typing import Callable, Awaitable, Optional


class PvpDrawCardView(View):
    """
    A Discord UI View for the PvP 'Draw Card' action.
    Only the specified player can use the button. Disables itself after use.
    """
    def __init__(
        self,
        player_id: int,
        on_draw_callback: Callable[[int, discord.Interaction], Awaitable[None]],
        timeout: int = 60,
        player_name: Optional[str] = None
    ):
        """
        :param player_id: The Discord user ID allowed to draw.
        :param on_draw_callback: Coroutine called with (user_id, interaction) when the button is pressed.
        :param timeout: How long before the view times out (seconds).
        :param player_name: Optional player name for UI clarity.
        """
        super().__init__(timeout=timeout)
        self.player_id = player_id
        self.on_draw_callback = on_draw_callback
        self.player_name = player_name
        self.draw_clicked = False  # Track whether the button has been clicked

    @discord.ui.button(label="🃏 Draw Card", style=discord.ButtonStyle.primary, custom_id="pvp_draw_card_button")
    async def draw_card(self, interaction: discord.Interaction, button: Button):
        print(f"Player {interaction.user.id} pressed the draw card button.")

        # Validate that the correct player is interacting
        if interaction.user.id != self.player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            print(f"Invalid turn. Expected player: {self.player_id}, but got: {interaction.user.id}")
            return

        # Prevent repeated clicks during the same turn
        if self.draw_clicked:
            await interaction.response.send_message("⚠️ You've already drawn this turn.", ephemeral=True)
            print("Button already clicked this turn.")
            return

        self.draw_clicked = True

        # Disable the button to prevent repeated clicks
        for child in self.children:
            child.disabled = True
        await interaction.response.edit_message(view=self)

        # Trigger the game logic callback
        try:
            print(f"Valid turn. Player {interaction.user.id} is drawing a card.")
            await self.on_draw_callback(interaction.user.id, interaction)
        except Exception as e:
            print(f"Error during on_draw_callback: {e}")
            await interaction.followup.send("❌ An error occurred while processing your action.", ephemeral=True)

    async def on_timeout(self):
        print("View has timed out. Disabling buttons.")
        for child in self.children:
            child.disabled = True
        try:
            await self.message.edit(content="⏰ Draw card timed out.", view=self)
            print("Message updated successfully on timeout.")
        except Exception as e:
            print(f"Failed to edit message on timeout: {e}")