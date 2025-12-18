import asyncio
import discord
from typing import Callable, Dict, Awaitable, Optional


class TimeoutHandler:
    def __init__(self, idle_turn_threshold: int = 5):
        """
        Initializes the TimeoutHandler.
        :param idle_turn_threshold: Number of idle turns before a player forfeits.
        """
        self.idle_trackers: Dict[int, int] = {}           # Tracks idle turn counts: {user_id: idle_turns}
        self.timeout_tasks: Dict[int, asyncio.Task] = {}  # Tracks running timeout tasks per user
        self.idle_turn_threshold = idle_turn_threshold    # Configurable idle turn threshold

    async def start_turn_timeout(
        self,
        user_id: int,
        thread: Optional[discord.Thread],
        timeout_seconds: int,
        user_mention: str,
        on_timeout_callback: Callable[[int], Awaitable[None]]
    ):
        """
        Starts a timer for a player's turn. If the player doesn't respond in time,
        the provided async callback is triggered.
        """
        # Cancel existing timeout if already running
        if user_id in self.timeout_tasks:
            self.cancel_timeout(user_id)

        async def timeout_coroutine():
            try:
                await asyncio.sleep(timeout_seconds)
                if thread:
                    await thread.send(f"⏰ {user_mention} took too long. Their turn is over.")
                # Increment idle counter and check if the player should forfeit
                if self.increment_idle_counter(user_id):
                    await self.forfeit_player_due_to_idling(
                        thread=thread,
                        user_mention=user_mention,
                        on_forfeit_callback=lambda: on_timeout_callback(user_id)
                    )
                else:
                    await on_timeout_callback(user_id)
            except asyncio.CancelledError:
                pass  # Expected if user interacts in time
            except Exception as e:
                print(f"[TimeoutHandler] Error in timeout coroutine for user {user_id}: {e}")

        task = asyncio.create_task(timeout_coroutine())
        self.timeout_tasks[user_id] = task
        print(f"[TimeoutHandler] Started timeout for user {user_id} ({timeout_seconds}s).")

    def cancel_timeout(self, user_id: int):
        """Cancels an active timeout if the player takes an action in time."""
        if user_id in self.timeout_tasks:
            self.timeout_tasks[user_id].cancel()
            del self.timeout_tasks[user_id]
            print(f"[TimeoutHandler] Canceled timeout for user {user_id}.")

    def reset_idle_counter(self, user_id: int):
        """Reset idle turn counter when a player performs an action."""
        self.idle_trackers[user_id] = 0
        print(f"[TimeoutHandler] Reset idle counter for user {user_id}.")

    def increment_idle_counter(self, user_id: int) -> bool:
        """
        Increment idle counter after each turn. 
        Return True if the player should be auto-forfeited.
        """
        self.idle_trackers[user_id] = self.idle_trackers.get(user_id, 0) + 1
        print(f"[TimeoutHandler] Incremented idle counter for user {user_id}: {self.idle_trackers[user_id]}")
        return self.idle_trackers[user_id] >= self.idle_turn_threshold

    def remove_tracker(self, user_id: int):
        """Fully clean up tracking when the game ends or a player forfeits."""
        self.idle_trackers.pop(user_id, None)
        self.cancel_timeout(user_id)
        print(f"[TimeoutHandler] Removed tracker for user {user_id}.")

    async def forfeit_player_due_to_idling(
        self,
        thread: Optional[discord.Thread],
        user_mention: str,
        on_forfeit_callback: Callable[[], Awaitable[None]]
    ):
        """
        Called after too many idle turns to notify and clean up a player's game.
        """
        try:
            if thread:
                await thread.send(f"🕒 {user_mention} has been idle for too many turns and forfeited the game.")
            await on_forfeit_callback()
            print(f"[TimeoutHandler] User {user_mention} forfeited due to idling.")
        except Exception as e:
            print(f"[TimeoutHandler] Error in forfeit_player_due_to_idling: {e}")