import random
from game_logic.sandy_game import Card


class PlayerState:
    def __init__(self, user_id, name):
        self.user_id = user_id  # Unique identifier for the player
        self.name = name  # Player's display name
        self.total_score = 0  # Total score accumulated
        self.turn_score = 0  # Score for the current turn
        self.turns_taken = 0  # Number of turns taken
        self.busted = False  # Whether the player busted in the current turn

    def reset_turn(self):
        """Resets the player's turn-specific attributes."""
        self.turn_score = 0
        self.busted = False
        self.turns_taken += 1


class MultiplayerGame:
    def __init__(self, player_tuples, winning_score=150, max_rounds=15, max_players=6):
        """
        :param player_tuples: List of (user_id, name) tuples
        :param winning_score: Score required to win the game
        :param max_rounds: Maximum number of rounds
        :param max_players: Maximum number of players allowed in the game
        """
        self.players = [PlayerState(uid, name) for uid, name in player_tuples]
        self.current_player_index = 0
        self.round_count = 1
        self.winning_score = winning_score
        self.max_rounds = max_rounds
        self.max_players = max_players
        self.current_card = None
        self.current_roll_result = None
        self.finished = False
        self.used_bearish_flags = set()
    
    def add_player(self, user_id: int, name: str):
        """
        Adds a new player to the game.
        :param user_id: The Discord user ID of the player.
        :param name: The display name of the player.
        :raises ValueError: If the player is already in the game or the game is full.
        """
        if any(player.user_id == user_id for player in self.players):
            raise ValueError(f"Player {name} is already in the game.")
        if len(self.players) >= self.max_players:
            raise ValueError("The game is full. Cannot add more players.")
        self.players.append(PlayerState(user_id, name))

    def is_game_full(self) -> bool:
        """Checks if the game has reached the maximum number of players."""
        return len(self.players) >= self.max_players

    def current_player(self):
        """Returns the current player."""
        return self.players[self.current_player_index]

    def draw_card(self):
        """Simulates drawing a card for the current player."""
        if self.finished:
            return None
        card = self.draw_weighted_card()
        self.current_card = card
        return card

    def roll_dice(self):
        """Simulates rolling the dice for the current player."""
        if self.finished:
            return "game_over", None
        if not self.current_card:
            return "no_card_drawn", None

        value = self.roll_die()
        self.current_roll_result = value
        player = self.current_player()

        if self.current_card.type == "Bearish":
            success, roll = self.handle_bearish(self.current_card)
            if not success:
                player.turn_score = 0
                return "penalty", roll
            return "dodged", roll

        if value == 1:
            player.turn_score = 0
            player.busted = True
            return "bust", value

        player.turn_score += self.current_card.value
        return "success", value

    def stack_sats(self):
        """Stacks the current player's turn score into their total score."""
        player = self.current_player()
        player.total_score += player.turn_score
        player.reset_turn()
        self.check_game_over()

    def forfeit_turn(self):
        """Forfeits the current player's turn."""
        if self.finished:
            return
        self.current_player().reset_turn()
        self.advance_turn()

    def advance_turn(self):
        """Advances the turn to the next player."""
        self.current_player_index = (self.current_player_index + 1) % len(self.players)
        if self.current_player_index == 0:
            self.round_count += 1

    def check_game_over(self) -> bool:
        """Checks if the game is over based on scores or rounds."""
        if any(p.total_score >= self.winning_score for p in self.players):
            self.finished = True
            return True
        elif self.round_count > self.max_rounds:
            self.finished = True
            return True
        return False

    def get_winner(self):
        """Determines the winner of the game."""
        if not self.finished:
            return None
        sorted_players = sorted(self.players, key=lambda p: p.total_score, reverse=True)
        top_score = sorted_players[0].total_score
        top_players = [p for p in sorted_players if p.total_score == top_score]

        if len(top_players) == 1:
            return top_players[0]
        return None  # Tie

    def get_scoreboard(self):
        """Returns a list of player names and their scores."""
        return [(p.name, p.total_score) for p in self.players]

    def draw_weighted_card(self):
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

        # Combine all cards into a single list
        all_cards = cipher_cards + oracle_cards + historacle_cards + bearish_cards

        # Assign weights to each type of card
        weights = (
            [6] * len(cipher_cards) +
            [3] * len(oracle_cards) +
            [2] * len(historacle_cards) +
            [4] * len(bearish_cards)
        )

        # Draw a card based on weighted probabilities
        return random.choices(all_cards, weights=weights, k=1)[0]

    def handle_bearish(self, card):
        """Handles the effects of a Bearish card."""
        roll = self.roll_die()
        dodged = roll % 2 == 0

        if dodged:
            return True, roll
        else:
            self.used_bearish_flags.add(card.penalty)
            player = self.current_player()
            if card.penalty == "Reset":
                player.total_score = 0
            elif card.penalty == "Half":
                player.total_score //= 2
            elif card.penalty == "Minus10":
                player.total_score = max(0, player.total_score - 10)
            return False, roll

    def roll_die(self):
        """Simulates a dice roll with weighted probabilities."""
        return random.choices([1, 2, 3, 4, 5, 6], weights=[14.5, 17.1, 17.1, 17.1, 17.1, 17.1])[0]