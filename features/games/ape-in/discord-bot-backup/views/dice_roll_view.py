import discord
from discord.ui import View, Button
from typing import Callable, Awaitable, Optional


class DiceRollView(View):
    def __init__(
        self,
        player_id: int,
        on_roll_callback: Callable[[int, discord.Interaction], Awaitable[None]],
        timeout: int = 60,
        player_name: Optional[str] = None,
        game_id: Optional[str] = None,
    ):
        """
        View that displays the 'Roll Dice' button during a turn.

        Args:
            player_id: The Discord user ID of the player.
            on_roll_callback: The function to call when the dice is rolled.
            timeout: How long before the view becomes inactive.
            player_name: (Optional) The name of the player, for multiplayer clarity.
            game_id: (Optional) Game identifier for AFK/timeouts.
        """
        super().__init__(timeout=timeout)
        self.player_id = player_id
        self.on_roll_callback = on_roll_callback
        self.roll_clicked = False
        self.player_name = player_name
        self.game_id = game_id

    @discord.ui.button(label="🎲 Roll Dice", style=discord.ButtonStyle.primary, custom_id="roll_dice_button")
    async def roll_button(self, interaction: discord.Interaction, button: Button):
        # 💡 Update button label with player name if provided (only once per interaction)
        if self.player_name and button.label == "🎲 Roll Dice":
            button.label = f"🎲 Roll Dice ({self.player_name})"
            await interaction.message.edit(view=self)

        # ⛔ Prevent multiple activations
        if self.roll_clicked:
            await interaction.response.send_message("❌ You've already rolled this dice.", ephemeral=True)
            # Re-enable the button and refresh the view
            for child in self.children:
                child.disabled = False
            await interaction.message.edit(view=self)
            return

        self.roll_clicked = True

        # Disable the view for all
        for child in self.children:
            child.disabled = True
        await interaction.response.edit_message(view=self)

         # 🎲 Simulate the dice roll
        roll_result = self.roll_dice()  # Simulate or calculate the dice roll result
        print(f"DEBUG: roll_button -> roll_result: {roll_result}")  # Add logging

        # ✅ Corrected: Pass both player_id and interaction
        await self.on_roll_callback(self.player_id, roll_result)
    
    def roll_dice(self):
        """
        Simulates a dice roll and returns the result.
        """
        import random
        roll = random.randint(1, 6)  # Simulate a roll between 1 and 6
        outcome = "success" if roll != 1 else "bust"
        return outcome, roll