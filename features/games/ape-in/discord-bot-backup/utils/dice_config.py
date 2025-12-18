# utils/dice_config.py

# === Used for basic random.choice() rolls ===
DICE_SIDES = [1, 2, 3, 4, 5, 6]

# Each bot/player profile maps a dice face (1-6) to a weight
# Higher weights = more likely to roll that number

# === Default (balanced) roll used for PvP & Multiplayer ===
BALANCED_ROLL_WEIGHTS = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

# === Sandy's roll profile (slightly tutorial-friendly) ===
SANDY_ROLL_WEIGHTS = {
    1: 1,  # Normal chance of bust
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

# === Aida — Equal weighting (fair dice) ===
AIDA_ROLL_WEIGHTS = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

# === Lana — Equal weighting (fair dice) ===
LANA_ROLL_WEIGHTS = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

# === En-J1n — Equal weighting (fair dice) ===
ENJ1N_ROLL_WEIGHTS = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

# === Nifty — Equal weighting (fair dice) ===
NIFTY_ROLL_WEIGHTS = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

# === Easy access dictionary ===
DICE_PROFILES = {
    "balanced": BALANCED_ROLL_WEIGHTS,
    "sandy": SANDY_ROLL_WEIGHTS,
    "aida": AIDA_ROLL_WEIGHTS,
    "lana": LANA_ROLL_WEIGHTS,
    "enj1n": ENJ1N_ROLL_WEIGHTS,
    "nifty": NIFTY_ROLL_WEIGHTS,
}
