import discord
from discord.ui import View, Button
from typing import Callable, Awaitable

class PvpMultiplayerView(View):
    """
    Main menu view for selecting PvP or multiplayer game modes.
    """
    def __init__(
        self,
        on_pvp_callback: Callable[[discord.Interaction], Awaitable[None]],
        on_multi_3_6_callback: Callable[[discord.Interaction], Awaitable[None]],
        on_multi_5_10_callback: Callable[[discord.Interaction], Awaitable[None]],
        timeout: int = 300
    ):
        """
        Args:
            on_pvp_callback: Called when PvP mode is selected.
            on_multi_3_6_callback: Called when 3–6 player mode is selected.
            on_multi_5_10_callback: Called when 5–10 player mode is selected.
            timeout: Seconds before view disables itself.
        """
        super().__init__(timeout=timeout)
        self.on_pvp_callback = on_pvp_callback
        self.on_multi_3_6_callback = on_multi_3_6_callback
        self.on_multi_5_10_callback = on_multi_5_10_callback
        self.message: discord.Message = None  # Optionally set when sending

    @discord.ui.button(label="🎮 PvP (1v1)", style=discord.ButtonStyle.primary)
    async def pvp_button(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_pvp_callback(interaction)

    @discord.ui.button(label="👥 Multiplayer (3–6)", style=discord.ButtonStyle.success)
    async def multi_3_6_button(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_multi_3_6_callback(interaction)

    @discord.ui.button(label="👥 Multiplayer (5–10)", style=discord.ButtonStyle.danger)
    async def multi_5_10_button(self, interaction: discord.Interaction, button: Button):
        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        await self.on_multi_5_10_callback(interaction)

    def disable_all_buttons(self):
        for child in self.children:
            child.disabled = True

    async def on_timeout(self):
        self.disable_all_buttons()
        if hasattr(self, "message") and self.message:
            try:
                await self.message.edit(content="⏰ Menu timed out.", view=self)
            except Exception:
                pass