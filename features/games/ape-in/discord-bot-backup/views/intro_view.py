import discord
from discord.ui import View, Button
from typing import Callable, Awaitable

# Intro messages per game mode
INTRO_MESSAGES = {
    "Sandy": [
        "🤖 Sandy: Welcome to...\n",
        "🎮 Risk-Reward: Stack Those Sats!\n",
        "🪙 In this game, you’ll face off against me — Sandy!",
        "🎯 First to stack 150 sats wins.",
        "🎴 You'll draw cards, 🎲 roll dice, and ⚠️ dodge bearish penalties!",
        "📈 Stack wisely… or risk losing it all.",
        "🤞 Good luck!",
        "➡️ Let's begin..."
    ],
    "Aida": [
        "🧠 Aida: Let's test your probability instincts.",
        "🎯 Outsmart me in 20 rounds or accept defeat.",
        "📊 Data doesn't lie. But maybe you can bend it."
    ],
    "Lana": [
        "🔧 Lana: Systems initialized.",
        "🎲 Prepare for adaptive gameplay.",
        "🧪 Let’s see how you perform under strategic pressure."
    ],
    "Enj1n": [
        "🔥 En-J1n: Let’s ride the volatility!",
        "🎲 No brakes. No rules. Just risk.",
        "💥 Beat me before I explode the sats stack!"
    ],
    "Nifty": [
        "🎨 Nifty: Art of probability is my game.",
        "🎭 You’ll need flair *and* strategy.",
        "📈 The charts may favor me... let’s see."
    ],
    "PvP": [
        "👥 PvP Mode Activated!",
        "🎮 Battle another player in a 20-round trading session.",
        "🏆 Stack smarter, survive longer, win bigger."
    ],
    "Multiplayer": [
        "🌐 Multiplayer Activated!",
        "🎲 Compete with 3–10 players in a strategic sats-stacking brawl.",
        "🔢 First to 300 wins — or be the last player standing."
    ]
}


class IntroView(View):
    def __init__(self, mode_name: str, on_intro_complete: Callable[[discord.Interaction, bool], Awaitable[None]], timeout: int = 60):
        """
        View for the game introduction screen.

        Args:
            mode_name: The current game mode (e.g., "Sandy", "PvP").
            on_intro_complete: Callback function to trigger when the intro is complete or skipped.
            timeout: Time before the view becomes inactive.
        """
        super().__init__(timeout=timeout)
        self.mode_name = mode_name
        self.on_intro_complete = on_intro_complete

    @discord.ui.button(label="▶️ Start Game", style=discord.ButtonStyle.success)
    async def start_game(self, interaction: discord.Interaction, button: Button):
        await self.disable_buttons(interaction)
        await self.on_intro_complete(interaction, skip=False)

    @discord.ui.button(label="⏭️ Skip Intro", style=discord.ButtonStyle.secondary)
    async def skip_intro(self, interaction: discord.Interaction, button: Button):
        await self.disable_buttons(interaction)
        await self.on_intro_complete(interaction, skip=True)

    async def disable_buttons(self, interaction: discord.Interaction):
        for child in self.children:
            child.disabled = True
        await interaction.response.edit_message(view=self)

    def get_intro_messages(self) -> list[str]:
        """Returns the list of intro messages for the current mode."""
        return INTRO_MESSAGES.get(self.mode_name, ["Welcome to Risk-Reward!"])
