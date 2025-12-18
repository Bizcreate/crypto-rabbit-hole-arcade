# 🎯 Game Winning Scores by Mode

## Target Scores for Each Game Mode

| Game Mode | Winning Score | Max Rounds | Difficulty |
|-----------|--------------|------------|------------|
| **Sandy** 🟡 | 150 sats | 10 rounds | Tutorial |
| **Aida** 🟣 | 300 sats | 10 rounds | Easy |
| **Lana** 🔵 | 300 sats | 10 rounds | Medium |
| **En-J1n** 🔴 | 300 sats | 10 rounds | Hard |
| **Nifty** 🟠 | 300 sats | 10 rounds | Medium |
| **PvP** ⚔️ | 300 sats | 15 rounds | Varies |
| **Multiplayer** 👥 | 300 sats | 15 rounds | Varies |
| **Tournament** 🏆 | 300 sats | Varies | Varies |

## How to Update Scores

If you want to change the winning scores, edit:

**Backend:** `backend/app/config.py`
```python
class Settings(BaseSettings):
    MAX_SCORE: int = 150  # Change this
    MAX_ROUNDS: int = 10   # Or this
```

**Per-Game Customization:** `backend/app/services/game_service.py`
```python
# In create_game method:
if mode == "sandy":
    winning_score = 150
elif mode in ["aida", "lana", "enj1n", "nifty"]:
    winning_score = 300
```

## Current Generic Text (Works for All)

Frontend now says:
> "Save your score by stacking. Reach the target sats to win!"

This works for all game modes since the target varies!

























