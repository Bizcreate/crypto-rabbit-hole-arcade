import discord
from discord.ext import commands
from views.main_menu_view import MainMenuView

# Import start functions for all bots
from bots.sandy_bot import start_sandy_game
from bots.aida_bot import start_aida_game
from bots.lana_bot import start_lana_game
from bots.enj1n_bot import start_enj1n_game
from bots.nifty_bot import start_nifty_game

class MainMenuRouter(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="launch_menu")
    async def launch_main_menu(self, ctx):
        """Admin-only command to post the main menu."""
        if not ctx.author.guild_permissions.administrator:
            await ctx.send("❌ You don't have permission to use this command.")
            return

        # Interaction-aware mode handler
        async def on_mode_selected(interaction: discord.Interaction, mode: str):
            try:
                player_name = interaction.user.display_name

                if mode.lower() == "sandy":
                    await start_sandy_game(interaction, player_name)
                elif mode.lower() == "aida":
                    await start_aida_game(interaction, player_name)
                elif mode.lower() == "lana":
                    await start_lana_game(interaction, player_name)
                elif mode.lower().replace("-", "") == "enj1n":
                    await start_enj1n_game(interaction, player_name)
                elif mode.lower() == "nifty":
                    await start_nifty_game(interaction, player_name)
                else:
                    await interaction.response.defer(ephemeral=True)
                    await interaction.followup.send(
                        f"🚧 `{mode}` mode not recognized.",
                        ephemeral=True  # Fixed this line
                    )
            except Exception as e:
                print(f"[MainMenuRouter Error] Launch failed for {mode}: {e}")
                try:
                    await interaction.followup.send(
                        f"❌ Failed to start **{mode}** mode.",
                        ephemeral=True
                    )
                except discord.errors.InteractionResponded:
                    pass

        def view_with_context():
            view = MainMenuView(
                on_mode_selected=on_mode_selected
            )
            return view

        # Prepare and send main menu embed
        embed = discord.Embed(
            title="🎮 Risk-Reward: Stack Your Sats",
            description=(
                "Welcome to the official Risk-Reward minigame center!\n\n"
                "👇 Select a game mode below to get started:\n"
                "• **Sandy** – Tutorial Mode\n"
                "• **Aida, Lana, En-J1n, Nifty** – Bot battles with increasing difficulty\n"
                "• **PvP Match** – Challenge another player\n"
                "• **Multiplayer Match** – Join a larger trading session (3–6 or 5–10 players)\n\n"
                "🧠 Stack sats, dodge bears, and outplay your rivals!"
            ),
            color=discord.Color.gold()
        )
        embed.set_footer(text="Powered by The Crypto Rabbit Hole")

        await ctx.send(embed=embed, view=view_with_context())

# ✅ Required for bot.load_extension("routers.main_menu_router")
async def setup(bot):
    await bot.add_cog(MainMenuRouter(bot))  # Corrected this line
