import discord
from discord.ui import View, button
from views.draw_card_view import DrawCardView
from views.dice_roll_view import DiceRollView

# Helper for formatting card info (define or import as needed)
def format_card_info(card):
    """Format card info for display."""
    if hasattr(card, "type") and hasattr(card, "name"):
        if card.type == "Bearish":
            return f"{card.name} (Bearish)"
        return f"{card.name} ({card.type}, {getattr(card, 'value', '')} pts)"
    return str(card)

class MultiplayerTurnView(View):
    def __init__(self, bot: discord.Client, game, thread: discord.Thread, player: discord.Member):
        super().__init__(timeout=60)  # 60-second turn timer
        self.bot = bot
        self.game = game
        self.thread = thread
        self.player = player  # discord.Member object

    def disable_all(self):
        for child in self.children:
            child.disabled = True

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.user.id != self.player.id:
            await interaction.response.send_message("It's not your turn!", ephemeral=True)
            return False
        return True

    @button(label="🎴 Draw Card", style=discord.ButtonStyle.blurple, row=0)
    async def draw_card(self, interaction: discord.Interaction, button: discord.ui.Button):
        card = self.game.draw_card()
        await interaction.response.send_message(
            f"🃏 You drew: **{format_card_info(card)}**\nNow roll the die!", ephemeral=True
        )

        # Disable Draw Card, enable Roll Dice
        self.draw_card.disabled = True
        self.roll_dice.disabled = False
        await interaction.message.edit(view=self)

    @button(label="🎲 Roll Dice", style=discord.ButtonStyle.green, disabled=True, row=0)
    async def roll_dice(self, interaction: discord.Interaction, button: discord.ui.Button):
        result, value = self.game.roll_dice()

        if result == "success":
            msg = f"🎯 Rolled a `{value}`! Your score increases. ✅"
        elif result == "bust":
            msg = f"💥 Rolled a `1` — you busted! Turn score lost. ❌"
            self.game.current_player().reset_turn()
            self.disable_all()
        elif result == "penalty":
            msg = f"🐻 Bearish Penalty! Rolled `{value}` — lost sats!"
        elif result == "dodged":
            msg = f"🛡️ Dodged the Bearish card with an even roll of `{value}`!"
        elif result == "game_over":
            msg = "🏁 The game is already over."
            self.disable_all()
        else:
            msg = f"❌ Invalid roll."

        await interaction.response.send_message(msg, ephemeral=True)

        # Disable Roll Dice, enable Stack Sats and Forfeit if not game over/bust
        self.roll_dice.disabled = True
        if result not in ("bust", "game_over"):
            self.stack_sats.disabled = False
            self.forfeit_turn.disabled = False
        await interaction.message.edit(view=self)

        # If bust or game over, end turn automatically
        if result in ("bust", "game_over"):
            await self.end_turn()

    @button(label="📥 Stack Sats", style=discord.ButtonStyle.success, disabled=True, row=1)
    async def stack_sats(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.game.stack_points()
        self.disable_all()
        await interaction.response.send_message("💾 Sats stacked and turn saved!", ephemeral=True)
        await interaction.message.edit(view=self)
        await self.end_turn()

    @button(label="🚪 Forfeit Turn", style=discord.ButtonStyle.danger, disabled=True, row=1)
    async def forfeit_turn(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.game.forfeit_turn()
        self.disable_all()
        await interaction.response.send_message("❌ Turn forfeited.", ephemeral=True)
        await interaction.message.edit(view=self)
        await self.end_turn()

    async def on_timeout(self):
        try:
            self.game.forfeit_turn()
            self.disable_all()
            await self.thread.send(f"⏱️ {self.player.mention} took too long. Turn skipped.")
            await self.thread.send(f"➡️ Next player's turn.")
        except Exception as e:
            await self.thread.send(f"⚠️ Error on timeout: {e}")
        finally:
            await self.end_turn()

    async def end_turn(self):
        from bots.multiplayer_bot import next_multiplayer_turn
        await next_multiplayer_turn(self.bot, self.thread, self.game)