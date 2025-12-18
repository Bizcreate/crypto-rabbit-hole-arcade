import discord
from game_logic.tournament_manager import TournamentManager

tournament = TournamentManager()  # Shared instance

class TournamentView(discord.ui.View):
    """
    Discord UI View for joining and launching a tournament.
    """
    def __init__(self, initiator: discord.Member, timeout: int = 120):
        super().__init__(timeout=timeout)
        self.initiator = initiator
        self.message: discord.Message = None

    @discord.ui.button(label="🎯 Join Tournament", style=discord.ButtonStyle.success)
    async def join_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        user_id = interaction.user.id
        user_name = interaction.user.display_name

        success, message = tournament.add_player(user_id, user_name)
        await interaction.response.send_message(message, ephemeral=True)

        # Optionally update the join message with the current player count
        if self.message:
            joined_names = ", ".join(name for _, name in tournament.players)
            await self.message.edit(
                content=(
                    f"🏆 **Tournament Sign-Up**\n"
                    f"Players joined: {joined_names} ({len(tournament.players)}/6)\n"
                    f"Click below to join!"
                ),
                view=self
            )

        # Notify channel if tournament is full and ready
        if tournament.is_ready():
            started, msg = tournament.start_tournament()
            if self.message:
                await self.message.edit(content="✅ Tournament is starting!", view=None)
            await interaction.channel.send(msg)
            await interaction.channel.send(tournament.get_bracket_summary())
            await self.run_first_match(interaction.channel)

    async def run_first_match(self, channel: discord.TextChannel):
        match = tournament.get_next_match()
        if match:
            p1 = match[0]
            p2 = match[1]
            try:
                thread = await channel.create_thread(
                    name=f"{p1[1]} vs {p2[1]}",
                    type=discord.ChannelType.public_thread,
                    reason="First Tournament Match"
                )
                await thread.send(
                    f"🎮 **First Tournament Match:**\n**{p1[1]}** vs **{p2[1]}**\n\nUse `!pvp @{p2[1]}` to begin!"
                )
            except Exception as e:
                await channel.send(
                    f"⚠️ Could not create thread for {p1[1]} vs {p2[1]}: {e}\n"
                    f"Please play your match here!"
                )

    async def on_timeout(self):
        # Disable the join button and update the message
        for child in self.children:
            child.disabled = True
        if self.message:
            try:
                await self.message.edit(content="⏰ Tournament sign-up timed out.", view=self)
            except Exception:
                pass