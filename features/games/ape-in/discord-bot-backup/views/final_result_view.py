import discord
from discord.ui import View, Button
from typing import Callable, Awaitable

class FinalResultView(View):
    def __init__(
        self,
        on_rematch_callback: Callable[[discord.Interaction], Awaitable[None]],
        on_main_menu_callback: Callable[[discord.Interaction], Awaitable[None]],
        timeout: int = 120
    ):
        """
        End-of-game view with options to rematch or return to main menu.

        Args:
            on_rematch_callback: Function to call when rematch is selected.
            on_main_menu_callback: Function to call to return to menu.
            timeout: Seconds before the view disables.
        """
        super().__init__(timeout=timeout)
        self.on_rematch_callback = on_rematch_callback
        self.on_main_menu_callback = on_main_menu_callback

    @discord.ui.button(label="🔁 Rematch", style=discord.ButtonStyle.primary)
    async def rematch_button(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_rematch_callback(interaction)

    @discord.ui.button(label="🏠 Main Menu", style=discord.ButtonStyle.secondary)
    async def main_menu_button(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_main_menu_callback(interaction)

    def disable_all_buttons(self):
        for child in self.children:
            child.disabled = True
