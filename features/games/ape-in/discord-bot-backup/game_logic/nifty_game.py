import random
import time
import discord
from utils.ape_in_effect import ApeInEffect  # Import the ApeInEffect utility
from utils.post_results import post_results_to_channel
from views import DeleteThreadView  # Import the DeleteThreadView for thread deletion

class Card:
    def __init__(self, name, card_type, point_value, filename=None, penalty_type=None):
        self.name = name
        self.type = card_type
        self.value = point_value
        self.penalty = penalty_type
        self.filename = filename

    def __repr__(self):
        if self.type == "Bearish":
            return f"{self.name} ({self.type}) - {self.penalty}"
        else:
            return f"{self.name} ({self.type}) - {self.value} sats"


class NiftyGame:
    def __init__(self, bot, interaction, thread, player_name, round_limit=10, winning_score=150):
        """
        Initializes the NiftyGame instance.
        """
        self.bot = bot
        self.interaction = interaction
        self.thread = thread
        self.round_limit = round_limit
        self.winning_score = winning_score

        self.player_user = interaction.user  # Full user object
        self.player_name = self.get_display_name(player_name)

        self.ape_in_effect = ApeInEffect()  # Initialize the "Ape In!" utility
        self.reset_game()

    def get_display_name(self, player_name):
        """
        Returns the display name of the player.
        """
        if hasattr(player_name, "display_name"):
            return player_name.display_name
        elif hasattr(player_name, "name"):
            return player_name.name
        elif isinstance(player_name, str):
            return player_name
        return "Unknown Player"

    def reset_game(self):
        """
        Resets the game state.
        """
        self.player_score = 0
        self.nifty_score = 0
        self.used_bearish_flags = set()
        self.rounds_played = 0
        self.start_time = time.time()
        self.player_turn_score = 0
        self.nifty_turn_score = 0
        self.bearish_pending = False
        self.pending_card = None
        self.round_count = 0
        self.ape_in_active = False  # Tracks if "Ape In!" is active
        self.last_card_was_ape_in = False  # Tracks if the last card was "Ape In!"
        self.ape_in_effect = ApeInEffect()  # Reset the "Ape In!" utility

    def roll_die(self):
        """
        Rolls a weighted die for the player.
        """
        roll = random.choices([1, 2, 3, 4, 5, 6], weights=[12.5, 17.5, 17.5, 17.5, 17.5, 17.5])[0]
        return roll

    def nifty_roll_die(self):
        """
        Rolls a weighted die for Nifty.
        """
        roll = random.choices([1, 2, 3, 4, 5, 6], weights=[16.67, 16.67, 16.67, 16.67, 16.67, 16.67])[0]
        return roll

    def draw_weighted_card(self):
        """
        Draws a weighted card from the deck.
        """
        cipher_cards = [
            Card("Abbie", "Cipher", 1, "Cipher_1pt_Abbie.jpg"),
            Card("Alita", "Cipher", 1, "Cipher_1pt_Alita.jpg"),
            Card("EnJ1n", "Cipher", 1, "Cipher_1pt_EnJ1n.jpg"),
            Card("Jakey", "Cipher", 1, "Cipher_1pt_Jakey.jpg"),
            Card("Ace", "Cipher", 2, "Cipher_2pt_Ace.jpg"),
            Card("Beats", "Cipher", 2, "Cipher_2pt_Beats.jpg"),
            Card("Dash", "Cipher", 2, "Cipher_2pt_Dash.jpg"),
            Card("Ray", "Cipher", 2, "Cipher_2pt_Ray.jpg"),
            Card("Jazzy", "Cipher", 3, "Cipher_3pt_Jazzy.jpg"),
            Card("Meemo", "Cipher", 3, "Cipher_3pt_Meemo.jpg"),
            Card("Sabrina", "Cipher", 3, "Cipher_3pt_Sabrina.jpg"),
            Card("Thea", "Cipher", 3, "Cipher_3pt_Thea.jpg"),
            Card("Nero", "Cipher", 5, "Cipher_5pt_Nero.jpg"),
            Card("Saul", "Cipher", 5, "Cipher_5pt_Saul.jpg"),
            Card("Somi", "Cipher", 5, "Cipher_5pt_Somi.jpg"),
            Card("Wick", "Cipher", 5, "Cipher_5pt_Wick.jpg"),
            Card("Sandy", "Cipher", 8, "Cipher_8pt_Sandy.jpg"),
            Card("Tala", "Cipher", 8, "Cipher_8pt_Tala.jpg"),
            Card("Tulip", "Cipher", 8, "Cipher_8pt_Tulip.jpg"),
            Card("Zacky", "Cipher", 8, "Cipher_8pt_Zacky.jpg"),
        ]

        oracle_cards = [
            Card(name, "Oracle", 13, f"Oracle_{name.replace(' ', '_')}.jpg")
            for name in [
                "Aida 1", "Aida 2", "Aida 3",
                "Lana 1", "Lana 2", "Lana 3",
                "Nifty 1", "Nifty 2", "Nifty 3",
                "Sats 1", "Sats 2", "Sats 3"
            ]
        ]

        historacle_cards = [
            Card(name, "Historacle", 21, f"Historacle_{i+1}_{name}.jpg")
            for i, name in enumerate(["Sats", "Fibonacci", "Gann", "Dow", "Elliott"])
        ]

        bearish_cards = []
        # Add 1 Bear Reset card for Nifty
        if "Reset" not in self.used_bearish_flags:
            bearish_cards.append(Card("Reset", "Bearish", 0, "Bear_Reset.jpg", "Reset"))
        # Add 3 Bear Half cards for Nifty (no round limit)
        if "Half" not in self.used_bearish_flags:
            for _ in range(3):
                bearish_cards.append(Card("Half", "Bearish", 0, "Bear_Half.jpg", "Half"))
        # Add 4 Bear -10 cards for Nifty
        if "Minus10" not in self.used_bearish_flags:
            for _ in range(4):
                bearish_cards.append(Card("Minus10", "Bearish", 0, "Bear_Minus_10.jpg", "Minus10"))

        # Add the "Ape In!" cards (50/50 chance between Ape_In and Ape_In_MAYC)
        special_cards = [
            Card("Ape In!", "Special", 0, "Ape_In.jpg"),
            Card("Ape In!", "Special", 0, "Ape_In_MAYC.jpg")
        ]

        # Exclude "Ape In!" if the last card was "Ape In!"
        if self.last_card_was_ape_in:
            special_cards = []  # Temporarily exclude "Ape In!" for the next draw

        all_cards = cipher_cards + oracle_cards + historacle_cards + bearish_cards + special_cards
        weights = (
            [6]*4 + [8]*4 + [9]*4 + [15]*4 + [15]*4 +   # Cipher cards
            [10]*len(oracle_cards) +                  # Oracle cards
            [4]*len(historacle_cards) +               # Historacle cards
            [4]*len(bearish_cards) +                  # Bearish cards (increased weight)
            [15]*len(special_cards)                   # Special cards (e.g., "Ape In!")
        )

        return random.choices(all_cards, weights=weights, k=1)[0]

    def handle_bearish(self, card, is_player=True):
        """
        Handles the effects of a bearish card.
        """
        roll = self.roll_die() if is_player else self.sandy_roll_die()
        dodged = roll % 2 == 0

        if dodged:
            return True, roll, "Dodged the bearish penalty!"
        else:
            self.used_bearish_flags.add(card.penalty)
            if card.penalty == "Reset":
                if is_player:
                    self.player_score = 0
                else:
                    self.nifty_score = 0
            elif card.penalty == "Half":
                if is_player:
                    self.player_score //= 2
                else:
                    self.nifty_score //= 2
            elif card.penalty == "Minus10":
                if is_player:
                    self.player_score = max(0, self.player_score - 10)
                else:
                    self.nifty_score = max(0, self.nifty_score - 10)
            return False, roll, "Bearish penalty applied!"

    def player_draw(self):
        """
        Handles the player's card draw.
        """
        card = self.draw_weighted_card()
        self.pending_card = card

        if card.name == "Ape In!":
            self.ape_in_effect.activate()  # Activate the "Ape In!" effect
            return card, "ape_in"

        if card.type == "Bearish":
            self.bearish_pending = True

        return card, "normal"

    def player_roll(self):
        """
        Handles the player's dice roll.
        """
        if self.bearish_pending:
            success, roll, phrase = self.handle_bearish(self.pending_card, is_player=True)
            self.bearish_pending = False
            self.pending_card = None
            if not success:
                self.player_turn_score = 0
                return "rekt!", roll, phrase
            return "dodged", roll, phrase

        roll = self.roll_die()
        if roll == 1:
            self.player_turn_score = 0
            return "bust", roll
        else:
            if self.ape_in_active:  # Apply "Ape In!" effect if active
                self.pending_card = self.ape_in_effect.apply_effect(self.pending_card)
                self.ape_in_active = False  # Reset the "Ape In!" effect

            self.player_turn_score += self.pending_card.value
            return "success", roll

    def player_stack(self):
        """
        Handles the player's decision to stack their sats.
        """
        self.player_score += self.player_turn_score
        self.player_turn_score = 0
        self.rounds_played += 1
        return self.player_score >= self.winning_score

    def nifty_play_turn(self):
        """
        Handles Nifty's turn logic.
        """
        self.nifty_turn_score = 0
        actions = []

        while True:
            card = self.draw_weighted_card()

            if card.type == "Bearish":
                success, roll, phrase = self.handle_bearish(card, is_player=False)
                if not success:
                    actions.append(f"Nifty drew a {card.name} (Bearish) and rolled a {roll} → {phrase}. Turn ends.")
                    self.nifty_turn_score = 0
                    break
                else:
                    actions.append(f"Nifty drew a {card.name} (Bearish) and rolled a {roll} → {phrase}.")
                    continue

            roll = self.nifty_roll_die()

            if roll == 1:
                actions.append(f"Nifty drew {card.name} ({card.value} pts) and rolled a 1 → Rekt! Turn ends.")
                self.nifty_turn_score = 0
                break
            else:
                self.nifty_turn_score += card.value
                actions.append(f"Nifty drew {card.name} ({card.value} pts) and rolled a {roll} → Turn score: {self.nifty_turn_score}")

                behind_by = self.player_score - self.nifty_score
                if self.nifty_turn_score >= 50:
                    if behind_by >= 20:
                        continue  # Ultra aggressive: continue if behind
                    else:
                        self.nifty_score += self.nifty_turn_score
                        actions.append("Nifty stacks her sats.")
                        break

        return actions, self.nifty_score >= self.winning_score

    def is_game_over(self):
        """
        Checks if the game is over.
        """
        return (
            self.player_score >= self.winning_score or
            self.nifty_score >= self.winning_score or
            self.round_count >= self.round_limit
        )

    def get_winner(self):
        """
        Determines the winner of the game.
        """
        if self.player_score > self.nifty_score:
            return "player", "You win!"
        elif self.nifty_score > self.player_score:
            return "nifty", "Nifty wins!"
        else:
            return "tie", "It's a tie!"

    async def conclude_game(self):
        """
        Concludes the game and displays the 'Delete Thread' button.
        """
        winner, phrase = self.get_winner()
        result_message = (
            f"🎉 {self.player_name} wins!" if winner == "player" else
            f"🤖 Nifty wins! {phrase}" if winner == "nifty" else
            "🤝 It's a tie!"
        )

        # Send the result message
        await self.thread.send(result_message)

         # Post results to the general chat channel
        try:
            await post_results_to_channel(
                bot=self.bot,
                winner_name=self.player_name if winner == "player" else "Nifty",
                total_score=max(self.player_score, self.nifty_score),
                game_mode="Nifty",
                player_names=[self.player_name, "Nifty"],
                player_name=self.player_name
            )
        except Exception as e:
            print(f"❌ Error posting results to general chat: {e}")

        if not isinstance(self.thread, discord.Thread):
            print("The channel is not a thread. Cannot add delete button.")
            return

        # Add the 'Delete Thread' button
        delete_thread_view = DeleteThreadView(self.thread)
        await self.thread.send("🗑️ Use the button below to delete this thread:", view=delete_thread_view)