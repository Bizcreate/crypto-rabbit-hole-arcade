class ApeInEffect:
    def __init__(self):
        self.active = False  # Tracks if "Ape In!" is active
        self.last_card_was_ape_in = False  # Tracks if the last card was "Ape In!"

    def activate(self):
        """Activate the 'Ape In!' effect."""
        self.active = True
        self.last_card_was_ape_in = True

    def reset(self):
        """Reset the 'Ape In!' effect."""
        self.active = False

    def apply_effect(self, card):
        """Apply the 'Ape In!' effect to a card."""
        if self.active and card.type in ["Cipher", "Oracle", "Historacle"]:
            card.value *= 2  # Double the value of the card
            self.reset()  # Reset the effect after applying it
        return card