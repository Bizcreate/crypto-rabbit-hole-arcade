import discord
from discord.ui import View, Button
from typing import Callable, Awaitable, Optional


class DrawCardView(View):
    def __init__(
        self,
        on_draw_callback: Callable[[int, discord.Interaction], Awaitable[None]],
        player_id: int,
        timeout: int = 60,
        player_name: Optional[str] = None,
        game_id: Optional[str] = None
    ):
        """
        View for the "Draw Card" action.

        Args:
            on_draw_callback: Function to call when the draw button is pressed.
            player_id: The Discord user ID of the current player.
            timeout: View timeout in seconds.
            player_name: Optional player name for UI clarity.
            game_id: Optional game session ID for tracking.
        """
        super().__init__(timeout=timeout)
        self.on_draw_callback = on_draw_callback
        self.player_id = player_id
        self.player_name = player_name
        self.game_id = game_id
        self.draw_clicked = False

    @discord.ui.button(label="🃏 Draw Card", style=discord.ButtonStyle.primary, custom_id="draw_card_button")
    async def draw_card(self, interaction: discord.Interaction, button: Button):
        if interaction.user.id != self.player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            # Re-enable the button and refresh the view
            for child in self.children:
                child.disabled = False
            await interaction.message.edit(view=self)
            return

        if self.draw_clicked:
            await interaction.response.send_message("⚠️ You've already drawn this turn.", ephemeral=True)
            # Re-enable the button and refresh the view
            for child in self.children:
                child.disabled = False
            await interaction.message.edit(view=self)
            return

        self.draw_clicked = True

        # Optional: update label with player name on first click
        if self.player_name and button.label == "🃏 Draw Card":
            button.label = f"🃏 Draw Card ({self.player_name})"
            await interaction.message.edit(view=self)

        # Disable button to prevent repeated clicks
        for child in self.children:
            child.disabled = True

        await interaction.response.edit_message(view=self)

        # Trigger the game logic callback
        await self.on_draw_callback(interaction.user.id, interaction)
