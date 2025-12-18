import discord
from discord.ui import View, Button

class MultiplayerButtonHandler(View):
    def __init__(self, player_id, on_draw_callback, on_stack_callback, on_forfeit_callback):
        """
        Initializes the button handler for the multiplayer game.
        :param player_id: ID of the player interacting with the buttons.
        :param on_draw_callback: Callback function for the "Draw Card" button.
        :param on_stack_callback: Callback function for the "Stack Sats" button.
        :param on_forfeit_callback: Callback function for the "Forfeit Turn" button.
        """
        super().__init__(timeout=60)
        self.player_id = player_id
        self.on_draw_callback = on_draw_callback
        self.on_stack_callback = on_stack_callback
        self.on_forfeit_callback

        # Add buttons to the view
        self.add_item(Button(label="Draw Card", style=discord.ButtonStyle.primary, callback=self.draw_card))
        self.add_item(Button(label="Stack Sats", style=discord.ButtonStyle.success, callback=self.stack_sats))
        self.add_item(Button(label="Forfeit", style=discord.ButtonStyle.danger, callback=self.forfeit_turn))

    async def draw_card(self, interaction: discord.Interaction):
        """
        Handles the "Draw Card" button interaction.
        """
        if interaction.user.id != self.player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            return
        await self.on_draw_callback(self.player_id, interaction)

    async def stack_sats(self, interaction: discord.Interaction):
        """
        Handles the "Stack Sats" button interaction.
        """
        if interaction.user.id != self.player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            return
        await self.on_stack_callback(self.player_id, interaction)

    async def forfeit_turn(self, interaction: discord.Interaction):
        """
        Handles the "Forfeit Turn" button interaction.
        """
        if interaction.user.id != self.player_id:
            await interaction.response.send_message("❌ It's not your turn!", ephemeral=True)
            return
        await self.on_forfeit_callback(self.player_id, interaction)