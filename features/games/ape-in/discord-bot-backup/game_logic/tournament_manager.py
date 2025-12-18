import random
from collections import deque

class TournamentManager:
    """
    Manages a 6-player single-elimination tournament with semifinals and a final.
    Handles player sign-up, match queueing, round advancement, and bracket summaries.
    """
    def __init__(self):
        self.players = []
        self.rounds = []
        self.current_round = 0
        self.match_queue = deque()
        self.tournament_active = False
        self.bye_player = None  # Track the player who gets a semifinal bye

    def add_player(self, user_id, name):
        if self.tournament_active:
            return False, "Tournament already in progress."
        if any(uid == user_id for uid, _ in self.players):
            return False, "You have already joined the tournament."
        if len(self.players) >= 6:
            return False, "Tournament is full (6 players)."
        self.players.append((user_id, name))
        return True, f"{name} joined the tournament! ({len(self.players)}/6)"

    def is_ready(self):
        return len(self.players) == 6

    def start_tournament(self):
        if not self.is_ready():
            return False, "Need exactly 6 players to start the tournament."

        self.tournament_active = True
        random.shuffle(self.players)

        # Round 1 – 3 matches
        round1 = [(self.players[i], self.players[i + 1]) for i in range(0, 6, 2)]
        self.rounds = [round1, [], []]  # round1, semifinals, final
        self.match_queue = deque(round1)
        self.current_round = 0
        self.bye_player = None
        return True, "🏆 Tournament started! Round 1 matchups are ready."

    def get_next_match(self):
        if self.match_queue:
            return self.match_queue.popleft()
        return None

    def report_match_winner(self, winner_user_id, winner_name):
        if not self.tournament_active:
            return "❌ No tournament is currently running."

        round_matches = self.rounds[self.current_round]
        # Store winner for next round
        self.rounds[self.current_round + 1].append((winner_user_id, winner_name))

        # If all matches in current round are done, queue the next round
        if len(self.rounds[self.current_round + 1]) == len(round_matches):
            self.current_round += 1

            if self.current_round == 1:
                # Semifinal: 3 winners, 1 random gets bye to final
                all_winners = self.rounds[1]
                self.bye_player = random.choice(all_winners)
                others = [p for p in all_winners if p != self.bye_player]
                if len(others) == 2:
                    semifinal = [(others[0], others[1])]
                else:
                    semifinal = []
                self.rounds[1] = semifinal
                self.rounds[2] = [self.bye_player]  # Advance bye to final
                self.match_queue = deque(semifinal)
                return f"🎯 Semifinal ready! {self.bye_player[1]} receives a bye to the final."

            elif self.current_round == 2:
                # Final: match the semifinal winner vs the bye
                final_players = self.rounds[2]
                # Add the semifinal winner to the final
                semifinal_winner = self.rounds[1][0][0] if self.rounds[1] else None
                if semifinal_winner and semifinal_winner not in final_players:
                    final_players.append(semifinal_winner)
                if len(final_players) == 2:
                    self.match_queue = deque([tuple(final_players)])
                    return "🔥 Final match is ready!"
                else:
                    self.tournament_active = False
                    return "❌ Error: Not enough players for the final."

            elif self.current_round == 3:
                self.tournament_active = False
                champion = winner_name
                return f"🏅 {champion} is the TOURNAMENT CHAMPION!"

        return f"✅ {winner_name} advances to the next round!"

    def get_bracket_summary(self):
        summary = []
        labels = ["🔹 Round 1", "🔸 Semifinal", "🏁 Final"]
        for i, round_matches in enumerate(self.rounds[:3]):
            summary.append(f"**{labels[i]}**")
            if i == 1 and self.bye_player:
                summary.append(f"• {self.bye_player[1]} (bye to final)")
            for match in round_matches:
                if isinstance(match, tuple) and len(match) == 2 and isinstance(match[0], tuple):
                    p1 = match[0][1]
                    p2 = match[1][1]
                    summary.append(f"• {p1} vs {p2}")
                elif isinstance(match, tuple):
                    summary.append(f"• {match[1]}")
        return "\n".join(summary)

    def reset_tournament(self):
        self.players = []
        self.rounds = []
        self.current_round = 0
        self.match_queue = deque()
        self.tournament_active = False
        self.bye_player = None