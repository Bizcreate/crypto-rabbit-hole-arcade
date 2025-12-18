import discord

class CloseThreadView(discord.ui.View):
    """
    A Discord UI View with a button to manually close and delete the thread.
    """
    def __init__(self, thread: discord.Thread):
        super().__init__(timeout=None)  # No timeout for the button
        self.thread = thread

    @discord.ui.button(label="🛑 Close Thread", style=discord.ButtonStyle.red)
    async def close_thread_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        """
        Handles the button click to close and delete the thread.
        """
        if interaction.user.guild_permissions.manage_threads or interaction.user == self.thread.owner:
            try:
                await self.thread.send("🛑 This thread is being closed and archived.")
                await self.thread.edit(archived=True, locked=True, reason="Thread manually closed by user.")
                await interaction.response.send_message("✅ Thread successfully closed.", ephemeral=True)
            except discord.HTTPException as e:
                await interaction.response.send_message(f"⚠️ Failed to close the thread: {e}", ephemeral=True)
        else:
            await interaction.response.send_message("❌ You don't have permission to close this thread.", ephemeral=True)