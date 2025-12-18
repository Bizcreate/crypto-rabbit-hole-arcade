# 🎮 Complete Game Logic Specification

## ✅ What's Currently Working:
- Backend server running on port 8000
- Frontend UI with 3D cards and particles
- Basic draw/roll/stack functionality
- Card images available (41 cards)
- Database tracking games

## 🔧 What Needs to be Implemented:

### 1. **Card Display with Images**
- [x] Card images located in `/assets/cards/`
- [x] Cardback placeholder created
- [ ] Show cardback on deck before draw
- [ ] Flip animation from cardback → card face
- [ ] Display correct card image based on card drawn

### 2. **Proper Turn Flow**
- [ ] Draw Card → Shows card image
- [ ] Roll Dice button only enabled after draw
- [ ] Roll 2-6 → Add sats to Turn Score
- [ ] After successful roll → Enable "Draw Again" OR "Stack Sats"
- [ ] Roll 1 → BUST → Reset turn score → Pass turn
- [ ] Stack Sats → Add turn to total → Pass turn

### 3. **Score Display**
- [ ] Show **Total Sats** (permanent score)
- [ ] Show **Turn Sats** (current turn accumulation)
- [ ] Update both properly

### 4. **Bearish Card Logic**
- [ ] Draw Bearish → Must roll to dodge
- [ ] Roll EVEN (2,4,6) → Dodge penalty, can continue
- [ ] Roll ODD (1,3,5) → Penalty applies, turn ends
- [ ] Penalties: Reset (0), Half (÷2), Minus 10 (-10)
- [ ] Track used bearish cards (can't redraw)

### 5. **Ape In! Logic**
- [ ] Draw Ape In → Auto-draw next card immediately
- [ ] If next card is value card + successful roll → DOUBLE sats
- [ ] If next card is Bearish → Normal bearish logic, Ape In negated
- [ ] Prevent Ape In! twice in a row
- [ ] Exciting message when Ape In activates

### 6. **Bot AI Turn**
- [ ] After player stacks or busts → Sandy plays
- [ ] Sandy uses same rules
- [ ] Sandy has AI decision logic (when to stack)
- [ ] Display Sandy's actions

### 7. **Player Profile**
- [ ] Name input modal on first game
- [ ] Store name in localStorage
- [ ] Display player name in game
- [ ] Use in leaderboard

### 8. **Win Conditions**
- [ ] Sandy: First to 150 sats
- [ ] Other modes: First to 300 sats
- [ ] Or highest after max rounds
- [ ] Victory screen with scores

---

## 📊 Implementation Priority:

1. **HIGH**: Fix turn flow (draw → roll → stack)
2. **HIGH**: Show card images  
3. **HIGH**: Bearish card logic
4. **MEDIUM**: Ape In! logic
5. **MEDIUM**: Bot turn display
6. **LOW**: Player name modal
7. **LOW**: Polish & animations

---

## ⏱️ Estimated Time:

- Backend logic: 30 minutes
- Frontend updates: 30 minutes
- Testing: 15 minutes
- **Total: ~75 minutes**

---

**Starting implementation now!** 🚀

I'll work through these systematically and keep you updated on progress.

























