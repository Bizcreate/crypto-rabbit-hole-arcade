from collections import namedtuple

# === Define a named tuple for card structure === #
Card = namedtuple('Card', ['name', 'type', 'value'])

# === Cipher Cards === #
CIPHER_CARDS = [
    Card("Cipher_1pt", "Cipher", 1),
    Card("Cipher_2pt", "Cipher", 2),
    Card("Cipher_3pt", "Cipher", 3),
    Card("Cipher_5pt", "Cipher", 5),
    Card("Cipher_8pt", "Cipher", 8),
]

# === Oracle Cards === #
ORACLE_CARDS = [
    Card("Oracle_Aida", "Oracle", 13),
    Card("Oracle_Gann", "Oracle", 13),
    Card("Oracle_Lana", "Oracle", 13),
    Card("Oracle_Sats", "Oracle", 13),
    Card("Oracle_Wyckoff", "Oracle", 13),
]

# === Historacle Cards === #
HISTORACLE_CARDS = [
    Card("Historacle_Elliott", "Historacle", 21),
    Card("Historacle_Fibonacci", "Historacle", 21),
    Card("Historacle_Dow", "Historacle", 21),
    Card("Historacle_Wyckoff", "Historacle", 21),
    Card("Historacle_Gann", "Historacle", 21),
    Card("Historacle_Sats", "Historacle", 21),
]

# === Bearish Cards === #
BEARISH_CARDS = [
    Card("Bear_Minus_10", "Bearish", -10),
    Card("Bear_Reset", "Bearish", 0),
]

# === Weight Mapping (draw chance per card name) === #
CARD_DRAW_WEIGHTS = {
    # Cipher
    "Cipher_1pt": 6,
    "Cipher_2pt": 8,
    "Cipher_3pt": 9,
    "Cipher_5pt": 10,
    "Cipher_8pt": 10,

    # Oracles
    "Oracle_Aida": 2,
    "Oracle_Gann": 2,
    "Oracle_Lana": 2,
    "Oracle_Sats": 2,
    "Oracle_Wyckoff": 2,

    # Historacles
    "Historacle_Elliott": 1,
    "Historacle_Fibonacci": 1,
    "Historacle_Dow": 1,
    "Historacle_Wyckoff": 1,
    "Historacle_Gann": 1,
    "Historacle_Sats": 1,

    # Bearish
    "Bear_Minus_10": 5,
    "Bear_Reset": 4,
}

# === Master Card List === #
ALL_CARDS = CIPHER_CARDS + ORACLE_CARDS + HISTORACLE_CARDS + BEARISH_CARDS

# === Lookup Function === #
def get_card_by_name(name):
    return next((card for card in ALL_CARDS if card.name == name), None)

# === Weighted Card Pool === #
card_pool = [
    {"card": card, "weight": CARD_DRAW_WEIGHTS.get(card.name, 1)}
    for card in ALL_CARDS
]
