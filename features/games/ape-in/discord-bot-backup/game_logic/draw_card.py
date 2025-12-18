import random
from utils.card_config import card_pool, Card as BaseCard

class Card(BaseCard):
    def __new__(cls, name, type, value, image_url=None, penalty=None):
        obj = super(Card, cls).__new__(cls, name, type, value)
        obj.image_url = image_url
        obj.penalty = penalty
        return obj

    def __repr__(self):
        return f"<Card name={self.name} value={self.value} type={self.type}>"

def draw_card():
    """
    Randomly draws a card from the weighted card pool.
    Returns a Card object (extended with image_url and penalty if applicable).
    """
    weighted_pool = [
        entry["card"]
        for entry in card_pool
        for _ in range(entry.get("weight", 1))
    ]

    selected = random.choice(weighted_pool)

    # Optional image URL logic could be expanded here
    image_url = f"https://thecryptorabbithole.io/cards/{selected.name}.png"

    # Set penalty if it's a Bearish card
    penalty = abs(selected.value) if selected.type == "Bearish" and selected.value < 0 else None

    return Card(
        name=selected.name,
        type=selected.type,
        value=selected.value,
        image_url=image_url,
        penalty=penalty
    )
