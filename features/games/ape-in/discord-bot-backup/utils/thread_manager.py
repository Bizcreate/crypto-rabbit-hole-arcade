import discord
from datetime import datetime

async def create_game_thread(ctx, thread_title: str = None, game_mode: str = "game") -> discord.Thread | None:
    """
    Creates a new public thread for the game in the current channel with formatting and intro message.

    Args:
        ctx: The command context from Discord.
        thread_title: Optional custom title for the thread.
        game_mode: Identifier like 'sandy', 'pvp', 'tournament' to include in the thread name.

    Returns:
        The created thread object or None if creation failed.
    """
    user = ctx.author
    timestamp = datetime.utcnow().strftime('%H%M')
    clean_name = user.name.lower().replace(" ", "-")

    # Thread name format: sandy-vs-alice-1422 or pvp-alice-vs-bob-1328
    default_title = f"{game_mode}-vs-{clean_name}-{timestamp}" if game_mode != "pvp" else f"pvp-match-{timestamp}"
    thread_name = thread_title or default_title

    try:
        thread = await ctx.channel.create_thread(
            name=thread_name,
            type=discord.ChannelType.public_thread,
            reason="New Risk-Reward game started"
        )

        # Optional intro embed
        embed = discord.Embed(
            title="🎮 New Game Thread Started!",
            description=f"Welcome to a **{game_mode.upper()}** match!\nLet the sats stacking begin.",
            color=discord.Color.gold()
        )
        embed.set_footer(text="Risk-Reward: Stack Those Sats!")
        await thread.send(embed=embed)

        return thread

    except discord.Forbidden:
        await ctx.send("❌ I don't have permission to create threads in this channel.")
    except discord.HTTPException as e:
        await ctx.send(f"⚠️ Failed to create thread: {e}")
    return None


async def close_game_thread(thread: discord.Thread, message: str = None, reason: str = "Game ended"):
    """
    Archives the thread after a game finishes, with an optional final message.

    Args:
        thread: The thread to close.
        message: A closing message to send in the thread before archiving.
        reason: Reason for archiving the thread.
    """
    try:
        if message:
            await thread.send(message)
        await thread.edit(archived=True, reason=reason)
    except discord.HTTPException as e:
        print(f"⚠️ Error closing thread: {e}")
