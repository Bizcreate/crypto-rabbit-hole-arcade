import discord
from discord.ui import View, Button
from typing import Callable, Awaitable, Optional


class StackOptionsView(View):
    def __init__(
        self,
        on_draw_callback: Callable[[int, discord.Interaction], Awaitable[None]],
        on_stack_callback: Callable[[int, discord.Interaction], Awaitable[None]],
        on_forfeit_callback: Callable[[int, discord.Interaction], Awaitable[None]],
        timeout: int = 60,
        player_name: Optional[str] = None,
        player_id: Optional[int] = None,
        game_id: Optional[str] = None
    ):
        """
        View that shows stack options after a successful dice roll.

        Args:
            on_draw_callback: Called when the player chooses to draw again.
            on_stack_callback: Called when the player chooses to stack sats.
            on_forfeit_callback: Called when the player chooses to forfeit.
            timeout: Button interaction timeout.
            player_name: Optional display name.
            player_id: Optional user ID for tracking.
            game_id: Optional session/game ID.
        """
        super().__init__(timeout=timeout)
        self.on_draw_callback = on_draw_callback
        self.on_stack_callback = on_stack_callback
        self.on_forfeit_callback = on_forfeit_callback
        self.player_name = player_name
        self.player_id = player_id
        self.game_id = game_id
        self.used = False

    @discord.ui.button(label="🃏 Draw Again", style=discord.ButtonStyle.primary, custom_id="draw_again_button")
    async def draw_card(self, interaction: discord.Interaction, button: Button):
        if not await self._validate(interaction, button, "🃏 Draw Again"):
            return
        if self.on_draw_callback:
            await self.on_draw_callback(interaction.user.id, interaction)

    @discord.ui.button(label="💰 Stack Sats", style=discord.ButtonStyle.success, custom_id="stack_sats_button")
    async def stack_sats(self, interaction: discord.Interaction, button: Button):
        if not await self._validate(interaction, button, "💰 Stack Sats"):
            return
        if self.on_stack_callback:
            await self.on_stack_callback(interaction.user.id, interaction)

    @discord.ui.button(label="🚪 Forfeit", style=discord.ButtonStyle.danger, custom_id="forfeit_button")
    async def forfeit_game(self, interaction: discord.Interaction, button: Button):
        if not await self._validate(interaction, button, "🚪 Forfeit"):
            return
        if self.on_forfeit_callback:
            await self.on_forfeit_callback(interaction.user.id, interaction)

    async def _validate(self, interaction: discord.Interaction, button: Button, base_label: str) -> bool:
        if self.used:
            await interaction.response.send_message("⚠️ You've already made your choice.", ephemeral=True)
            return False

        self.used = True

        # Optional player tagging in label
        if self.player_name and base_label in button.label:
            button.label = f"{base_label} ({self.player_name})"
            await interaction.message.edit(view=self)

        self.disable_all_buttons()
        await interaction.response.edit_message(view=self)
        return True

    def disable_all_buttons(self):
        for child in self.children:
            child.disabled = True
