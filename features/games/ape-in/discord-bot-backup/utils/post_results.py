from utils.constants import GENERAL_CHAT_CHANNEL_ID
import logging

logger = logging.getLogger(__name__)

async def post_results_to_channel(
    bot,
    winner_name: str,
    total_score: int,
    game_mode: str,
    player_names: list[str] = None,
    player_name=None
):
    """
    Posts the final game result message in the general-chat channel.
    """
    try:
        channel = await bot.fetch_channel(GENERAL_CHAT_CHANNEL_ID)
        if not channel:
            logger.error("❌ Could not find general chat channel. Check channel ID.")
            return

        if game_mode == "pvp":
            # PvP game logic
            if not player_names or len(player_names) < 2:
                logger.error("❌ PvP game requires two player names.")
                return

            player1_name, player2_name = player_names
            message = (
                f"⚔️ **PvP Battle Result** ⚔️\n"
                f"🔹 **Players**: {player1_name} vs {player2_name}\n"
                f"🏆 **Winner:** {winner_name} with **{total_score} sats**!"
            )

        elif game_mode.startswith("multiplayer"):
            # Multiplayer game logic
            players = ", ".join(player_names or [])
            message = (
                f"👥 **Multiplayer Match Result** ({game_mode})\n"
                f"Players: {players}\n"
                f"🏆 **Winner:** {winner_name} with **{total_score} sats**!"
            )

        else:
            # Single-player bot match logic (e.g., Sandy, Aida, Lana, En-J1n)
            bot_name = game_mode.title()
            player_display = (
                getattr(player_name, "display_name", None)
                or getattr(player_name, "name", None)
                or str(player_name)
                or "Unknown Player"
            )

            # Ensure winner_name is a string for comparison
            if winner_name == player_display:
                message = (
                    f"🏆 **{player_display}** won a match against **{bot_name}** "
                    f"and stacked **{total_score} sats**! 💥"
                )
            elif winner_name.lower() == bot_name.lower():
                message = (
                    f"🎲 **{player_display}** played a match against {bot_name} but lost. "
                    f"🏆 {bot_name} stacked **{total_score} sats**. 🤖"
                )
            else:
                message = (
                    f"🎲 **{player_display}** completed a match against {bot_name}.\n"
                    f"🏁 Winner: **{winner_name}** with **{total_score} sats**."
                )

        await channel.send(message)

    except Exception as e:
        logger.exception(f"❌ Error posting final results")