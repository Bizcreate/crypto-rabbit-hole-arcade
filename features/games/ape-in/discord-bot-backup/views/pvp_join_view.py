import discord
from discord import ButtonStyle, Interaction
from discord.ext.commands import Bot
from typing import List, Tuple

PVP_REQUESTS_CHANNEL_ID = 1393416695753740289  # Auto-post location
PVP_JOIN_TIMEOUT = 180  # seconds before timeout

# Import your PvP game start logic
from bots.pvp_bot import start_pvp_lobby


class PvpJoinView(discord.ui.View):
    """
    Discord UI View for PvP matchmaking.
    Allows one user to host and another to join. Starts the game when two players are present.
    """
    def __init__(self, bot: Bot, initiator: discord.User):
        super().__init__(timeout=PVP_JOIN_TIMEOUT)
        self.bot = bot
        self.initiator = initiator
        self.players: List[Tuple[int, str]] = [(initiator.id, initiator.display_name)]
        self.message: discord.Message = None

    async def on_timeout(self):
        if self.message:
            try:
                await self.message.edit(content="⏰ PvP match timed out. No opponent joined in time.", view=None)
            except Exception:
                pass

    async def interaction_check(self, interaction: Interaction) -> bool:
        if any(uid == interaction.user.id for uid, _ in self.players):
            await interaction.response.send_message("🛑 You've already joined this match!", ephemeral=True)
            return False
        return True

    @discord.ui.button(label="⚔️ Join PvP", style=ButtonStyle.blurple)
    async def join_button(self, interaction: Interaction, button: discord.ui.Button):
        # Check if the user is already in the match
        if any(uid == interaction.user.id for uid, _ in self.players):
            await interaction.response.send_message("🛑 You've already joined this match!", ephemeral=True)
            return

        # Add the user to the match
        self.players.append((interaction.user.id, interaction.user.display_name))

        # Respond to the interaction
        await interaction.response.send_message("✅ You’ve joined the match!", ephemeral=True)

        # Update the message if two players have joined
        if len(self.players) == 2 and self.message:
            player1, player2 = self.players
            await self.message.edit(
                content=(
                    f"⚔️ **PvP Match Found!**\n"
                    f"{player1[1]} vs {player2[1]} — match starting!"
                ),
                view=None
            )
            self.stop()  # Stop the view to disable the button

            # Start the PvP game using the PvP bot's lobby function
            await start_pvp_lobby(interaction, player1, player2)

    async def send_initial_message(self):
        """Posts the initial PvP announcement to #pvp-requests."""
        channel = self.bot.get_channel(PVP_REQUESTS_CHANNEL_ID)
        if not channel:
            print(f"❌ Could not find #pvp-requests channel with ID {PVP_REQUESTS_CHANNEL_ID}")
            return

        try:
            self.message = await channel.send(
                content=(
                    f"🎮 **{self.initiator.display_name}** is looking for a PvP opponent!\n"
                    f"Click below to join the match.\n\n"
                    f"1/2 players joined."
                ),
                view=self
            )
        except Exception as e:
            print(f"❌ Failed to send initial PvP message: {e}")