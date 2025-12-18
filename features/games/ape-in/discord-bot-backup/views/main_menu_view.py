import discord
from discord.ext.commands import Bot  # Correct import for Bot
from discord.ui import View, Button
from typing import Optional, Callable, Awaitable

# ✅ Real working bots
from bots.sandy_bot import start_sandy_game
from bots.aida_bot import start_aida_game
from bots.lana_bot import start_lana_game
from bots.enj1n_bot import start_enj1n_game
from bots.nifty_bot import start_nifty_game

# ✅ Real lobby modes
from bots.pvp_bot import start_pvp_lobby
from bots.tournament_bot import start_tournament_entry

from views.leaderboard_view import LeaderboardView
from views.pvp_join_view import PvpJoinView  # PvP matchmaking view

class MainMenuView(View):
    def __init__(self, bot: Bot, timeout: int = None, on_mode_selected: Optional[Callable[[discord.Interaction, str], Awaitable[None]]] = None):
        # Set timeout to None for perpetual buttons
        super().__init__(timeout=timeout)
        self.bot = bot
        self.on_mode_selected = on_mode_selected

        # Add the leaderboard button for top 20
        self.add_item(LeaderboardButton())

    async def _refresh_menu(self, interaction: discord.Interaction):
        # Re-attach a fresh view to the menu message so buttons stay active
        await interaction.message.edit(view=MainMenuView(self.bot, timeout=self.timeout, on_mode_selected=self.on_mode_selected))

    @discord.ui.button(label="🤖 Play Sandy (Tutorial)", style=discord.ButtonStyle.success)
    async def sandy_mode(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        await start_sandy_game(interaction)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="🧠 Play Aida (Strategic)", style=discord.ButtonStyle.primary)
    async def aida_mode(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        await start_aida_game(interaction)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="🔥 Play En-J1n (Risky)", style=discord.ButtonStyle.danger)
    async def enj1n_mode(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        await start_enj1n_game(interaction)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="🔧 Play Lana (Adaptive)", style=discord.ButtonStyle.primary)
    async def lana_mode(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        await start_lana_game(interaction)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="🎨 Play Nifty (Creative)", style=discord.ButtonStyle.secondary)
    async def nifty_mode(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        await start_nifty_game(interaction)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="👥 Play PvP", style=discord.ButtonStyle.success, row=1)
    async def pvp_mode(self, interaction: discord.Interaction, button: Button):
        # Post to #pvp-requests for open matchmaking using PvpJoinView
        view = PvpJoinView(interaction.client, interaction.user)
        await view.send_initial_message()
        await interaction.response.send_message("✅ Posted your PvP request in #pvp-requests!", ephemeral=True)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="🌐 Play Multiplayer", style=discord.ButtonStyle.secondary, row=1)
    async def multiplayer_mode(self, interaction: discord.Interaction, button: Button):
        """Handles the 'Play Multiplayer' button."""
        multiplayer_bot = self.bot.get_cog("MultiplayerBot")
        if multiplayer_bot:
            await multiplayer_bot.start_multiplayer_lobby(interaction)
        else:
            await interaction.response.send_message("❌ Multiplayer bot not loaded.", ephemeral=True)
        await self._refresh_menu(interaction)

    @discord.ui.button(label="🏆 Join Tournament", style=discord.ButtonStyle.danger, row=1)
    async def tournament_mode(self, interaction: discord.Interaction, button: Button):
        # Do NOT defer here, let start_tournament_entry handle the response
        await start_tournament_entry(interaction)
        await self._refresh_menu(interaction)

class LeaderboardButton(discord.ui.Button):
    def __init__(self):
        super().__init__(
            label="🏅 View Leaderboard",
            style=discord.ButtonStyle.primary,
            row=2
        )

    async def callback(self, interaction: discord.Interaction):
        embed = LeaderboardView.get_leaderboard_embed(top_n=20)
        await interaction.response.send_message(embed=embed, ephemeral=True)