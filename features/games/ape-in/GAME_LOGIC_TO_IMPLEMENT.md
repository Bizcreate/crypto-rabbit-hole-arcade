# 🎮 Complete Game Logic Implementation Plan

## ✅ Requirements Summary

### Turn Flow:
1. Player draws card → Card image displays
2. Player must roll dice
3. Roll 2-6 → Sats added to turn score → Choose: Draw again OR Stack
4. Roll 1 → BUST → Turn score reset → Turn passes to bot
5. Stack sats → Turn score added to total → Turn passes to bot

### Special Cards:
- **Bearish Cards:** Roll to dodge (even=safe, odd=penalty applies)
- **Ape In!:** Auto-draw next card, if value card + successful roll = DOUBLE sats
- **Ape In! Prevention:** Can't draw Ape In! twice in a row

### UI Needs:
- ✅ Card images from /assets/cards/
- ✅ Cardback image for deck
- ✅ Both Total Sats and Turn Sats displayed
- ✅ Player name input
- ✅ Proper button enable/disable states

## 🔧 Implementation Steps:

1. Request cardback image from user
2. Fix backend game logic (proper turn flow)
3. Update frontend with card images
4. Add player name modal
5. Implement proper button states
6. Test complete game flow

























