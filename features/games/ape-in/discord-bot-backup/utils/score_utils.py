# utils/score_utils.py

def update_score(player, score_to_add):
    """
    Add sats to the player's total score.

    :param player: The player object or dictionary
    :param score_to_add: Integer value of sats to add
    :return: Updated total score
    """
    player["score"] += score_to_add
    return player["score"]


def check_win_condition(score, target=300):
    """
    Check if a player's score meets the win condition.

    :param score: Current score of the player
    :param target: Target score to win (default is 300)
    :return: Boolean indicating win condition
    """
    return score >= target


def format_score(player_name, score):
    """
    Format the player's score for messaging.

    :param player_name: String name of the player
    :param score: Integer score value
    :return: Formatted string
    """
    return f"💰 {player_name} now has **{score} sats**!"


def format_score_message(player_name, player_score, opponent_name, opponent_score, winner=None):
    """
    Generate a game summary message with scores and result.

    :param player_name: Name of the player
    :param player_score: Final score of the player
    :param opponent_name: Name of the opponent (AI or another player)
    :param opponent_score: Final score of the opponent
    :param winner: Optional name of the winner
    :return: Formatted summary string
    """
    lines = [
        "🏁 **Game Over!**",
        f"🧑 {player_name}: **{player_score} sats**",
        f"🤖 {opponent_name}: **{opponent_score} sats**",
    ]

    if winner:
        if winner.lower() == player_name.lower():
            lines.append("🎉 **You win!** Great job stacking sats!")
        elif winner.lower() == opponent_name.lower():
            lines.append(f"💥 **{opponent_name} wins!** Better luck next time.")
        else:
            lines.append(f"🤝 It's a draw between **{player_name}** and **{opponent_name}**!")
    else:
        lines.append("⚠️ No winner determined.")

    return "\n".join(lines)
