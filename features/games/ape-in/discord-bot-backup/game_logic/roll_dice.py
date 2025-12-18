import random
from utils.dice_config import DICE_SIDES

def roll_dice():
    """Rolls a die using the configured sides in DICE_SIDES."""
    return random.choice(DICE_SIDES)
