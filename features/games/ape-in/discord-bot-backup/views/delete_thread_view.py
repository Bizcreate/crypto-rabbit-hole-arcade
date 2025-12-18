import discord
from discord.ui import View, Button
import logging

logger = logging.getLogger(__name__)

class DeleteThreadView(View):
    def __init__(self, thread: discord.Thread):
        """
        View that displays a 'Delete Thread' button.

        Args:
            thread: The Discord thread to be deleted.
        """
        super().__init__(timeout=None)  # No timeout since it should persist until clicked
        self.thread = thread

    @discord.ui.button(label="🗑️ Delete Thread", style=discord.ButtonStyle.danger, custom_id="delete_thread_button")
    async def delete_thread(self, interaction: discord.Interaction, button: Button):
        # Ensure the user has permission to delete the thread
        if not interaction.user.guild_permissions.manage_threads:
            await interaction.response.send_message("❌ You don't have permission to delete this thread.", ephemeral=True)
            return

        # Attempt to delete the thread
        try:
            # Check if the thread still exists
            if not self.thread or not isinstance(self.thread, discord.Thread):
                await interaction.response.send_message("❌ Thread no longer exists or is inaccessible.", ephemeral=True)
                return

            await self.thread.delete()
            await interaction.response.send_message("✅ Thread deleted successfully.", ephemeral=True)

        except discord.Forbidden:
            # Bot lacks permission to delete the thread
            await interaction.response.send_message("❌ I don't have permission to delete this thread.", ephemeral=True)

        except discord.NotFound:
            # Thread is already deleted or interaction is invalid
            try:
                await interaction.response.send_message("❌ Thread not found or already deleted.", ephemeral=True)
            except discord.NotFound:
                logger.warning("Interaction expired or invalid while handling thread deletion.")

        except discord.HTTPException as e:
            # Log the error and notify the user
            logger.error(f"Failed to delete thread: {e}")
            try:
                await interaction.response.send_message(f"❌ Failed to delete the thread: {e}", ephemeral=True)
            except discord.NotFound:
                logger.warning("Interaction expired or invalid while sending error message.")