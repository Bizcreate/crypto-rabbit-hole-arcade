import discord
from discord.ui import View, Button
from typing import Callable, Awaitable

class ForfeitView(View):
    def __init__(
        self,
        on_confirm_callback: Callable[[discord.Interaction], Awaitable[None]],
        on_cancel_callback: Callable[[discord.Interaction], Awaitable[None]],
        timeout: int = 30
    ):
        """
        View prompting the player to confirm or cancel forfeiting the game.

        Args:
            on_confirm_callback: Function called when the player confirms.
            on_cancel_callback: Function called when the player cancels.
            timeout: Seconds before the view times out.
        """
        super().__init__(timeout=timeout)
        self.on_confirm_callback = on_confirm_callback
        self.on_cancel_callback = on_cancel_callback

    @discord.ui.button(label="✅ Yes, Forfeit", style=discord.ButtonStyle.danger, custom_id="confirm_forfeit_button")
    async def confirm_forfeit(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_confirm_callback(interaction)

    @discord.ui.button(label="❌ Cancel", style=discord.ButtonStyle.secondary, custom_id="cancel_forfeit_button")
    async def cancel_forfeit(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_cancel_callback(interaction)

    def disable_all_buttons(self):
        for child in self.children:
            child.disabled = True
