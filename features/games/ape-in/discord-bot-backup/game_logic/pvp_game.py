import random
import time
from game_logic.sandy_game import Card


class PvpGame:
    """Handles the logic for a PvP Risk-Reward game session."""

    def __init__(self, player1, player2):
        self.player1 = player1  # discord.Member
        self.player2 = player2
        self.current_player_index = 0  # 0 for Player 1, 1 for Player 2
        self.round_count = 1  # Start with round 1
        self.scores = {self.player1.id: 0, self.player2.id: 0}
        self.turn_scores = {self.player1.id: 0, self.player2.id: 0}
        self.used_bearish_flags = set()
        self.round_limit = 18
        self.pending_card = None
        self.bearish_pending = False
        self.start_time = time.time()
        self.thread = None

    @property
    def current_player(self):
        """Returns the current player based on the current_player_index."""
        return self.player1 if self.current_player_index == 0 else self.player2

    def get_current_player(self):
        """Alias for current_player property."""
        return self.current_player

    def get_opponent(self, player):
        """Returns the opponent of the given player."""
        return self.player2 if player.id == self.player1.id else self.player1

    def get_score(self, player):
        """Returns the score of the given player."""
        return self.scores[player.id]

    def get_current_score(self):
        """Returns the score of the current player."""
        return self.scores[self.current_player.id]

    def get_player_by_id(self, user_id):
        """Returns the player object based on their user ID."""
        return self.player1 if self.player1.id == user_id else self.player2

    def draw_card(self):
        """Draws a card for the current player."""
        card = self.draw_weighted_card()
        self.pending_card = card
        self.bearish_pending = (card.type == "Bearish")
        print(f"{self.get_current_player().display_name} drew card: {card.name}")
        return card

    def roll_dice(self):
        """Handles dice rolling logic for the current player."""
        if self.bearish_pending:
            success, roll = self.handle_bearish(self.pending_card)
            self.bearish_pending = False
            self.pending_card = None
            if not success:
                self.turn_scores[self.current_player.id] = 0
                return "penalty", roll
            return "dodged", roll

        roll = self.roll_die()
        if roll == 1:
            self.turn_scores[self.current_player.id] = 0
            return "bust", roll
        else:
            self.turn_scores[self.current_player.id] += self.pending_card.value
            print(f"Dice roll successful: {roll}. Turn sats: {self.turn_scores[self.current_player.id]}")
            return "success", roll

    def stack_sats(self):
        """Stacks the current player's turn score into their total score."""
        uid = self.current_player.id
        turn_score = self.turn_scores.get(uid, 0)  # Get the turn score for the current player
        print(f"Stacking sats for {self.get_current_player().display_name}: Turn score = {turn_score}, Total score before = {self.scores[uid]}")
        self.scores[uid] += turn_score  # Add turn score to total score
        self.turn_scores[uid] = 0  # Reset turn score
        print(f"Total score after stacking = {self.scores[uid]}")

    def check_game_end(self) -> bool:
        """Checks if the game has ended based on scores or round limit."""
        return (
            self.scores[self.player1.id] >= 260 or
            self.scores[self.player2.id] >= 260 or
            self.round_count > self.round_limit
        )

    def get_winner(self):
        """Determines the winner of the game."""
        score1 = self.scores[self.player1.id]
        score2 = self.scores[self.player2.id]
        if score1 > score2:
            return self.player1
        elif score2 > score1:
            return self.player2
        else:
            return None  # Tie

    def advance_turn(self):
        """Centralized function to handle turn transitions."""
        self.switch_turn()
        print(f"Turn advanced. Current player: {self.get_current_player().display_name}, Round: {self.round_count}")

    def switch_turn(self):
        """Alternates between Player 1 and Player 2."""
        print(f"Switching turn. Current player index before: {self.current_player_index}")
        self.current_player_index = (self.current_player_index + 1) % 2
        # Increment round count only when Player 1 starts their turn
        if self.current_player_index == 0:
            self.round_count += 1
        print(f"Switching turn. Current player index after: {self.current_player_index}, Round: {self.round_count}")

    def roll_die(self) -> int:
        """Simulates a dice roll with weighted probabilities."""
        return random.choices([1, 2, 3, 4, 5, 6], weights=[16, 16.8, 16.8, 16.8, 16.8, 16.8])[0]

    def draw_weighted_card(self) -> Card:
        """Draws a card based on weighted probabilities."""
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
            for name in ["Aida 1", "Aida 2", "Aida 3", "Lana 1", "Lana 2", "Lana 3", "Nifty 1", "Nifty 2", "Nifty 3", "Sats 1", "Sats 2", "Sats 3"]
        ]

        historacle_cards = [
            Card(name, "Historacle", 21, f"Historacle_{i+1}_{name}.jpg")
            for i, name in enumerate(["Sats", "Fibonacci", "Gann", "Dow", "Elliott"])
        ]

        bearish_cards = []
        if "Reset" not in self.used_bearish_flags:
            bearish_cards.append(Card("Reset", "Bearish", 0, "Bear_Reset.jpg", "Reset"))
        if "Half" not in self.used_bearish_flags:
            bearish_cards.append(Card("Half", "Bearish", 0, "Bear_Half.jpg", "Half"))
        if "Minus10" not in self.used_bearish_flags:
            bearish_cards.append(Card("Minus10", "Bearish", 0, "Bear_Minus_10.jpg", "Minus10"))

        all_cards = cipher_cards + oracle_cards + historacle_cards + bearish_cards
        weights = (
            [6]*4 + [8]*4 + [9]*4 + [11]*4 + [12]*4 +
            [11]*12 + [6]*5 + [4]*len(bearish_cards)
        )

        return random.choices(all_cards, weights=weights, k=1)[0]

    def handle_bearish(self, card):
        """Handles the effects of a Bearish card."""
        roll = self.roll_die()
        dodged = roll % 2 == 0

        if dodged:
            return True, roll
        else:
            self.used_bearish_flags.add(card.penalty)
            uid = self.current_player.id
            if card.penalty == "Reset":
                self.scores[uid] = 0
            elif card.penalty == "Half":
                self.scores[uid] //= 2
            elif card.penalty == "Minus10":
                self.scores[uid] = max(0, self.scores[uid] - 10)
            return False, roll