import json
import os
import tempfile
import time
from datetime import datetime, timezone
import asyncio
from typing import Dict, Any, List, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
DB_PATH = os.path.join(DATA_DIR, "leaderboard.json")

# One global async lock to serialize writes
_write_lock = asyncio.Lock()

# -------------- Low-level helpers --------------

def _now_iso() -> str:
    """Returns the current UTC time in ISO 8601 format."""
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

def _ensure_data_dir():
    """Ensures the data directory exists."""
    os.makedirs(DATA_DIR, exist_ok=True)

def _default_db() -> Dict[str, Any]:
    """Returns the default structure for the leaderboard database."""
    return {"version": 1, "players": {}, "games": []}

def _atomic_write(path: str, data_str: str) -> None:
    """Writes data atomically to a file."""
    dir_name = os.path.dirname(path)
    fd, tmp_path = tempfile.mkstemp(prefix=".lb_", dir=dir_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as tmp:
            tmp.write(data_str)
            tmp.flush()
            os.fsync(tmp.fileno())
        os.replace(tmp_path, path)
    finally:
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass

def _load_db_sync() -> Dict[str, Any]:
    """Loads the leaderboard database synchronously."""
    _ensure_data_dir()
    if not os.path.exists(DB_PATH):
        return _default_db()
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def _save_db_sync(db: Dict[str, Any]) -> None:
    """Saves the leaderboard database synchronously."""
    _ensure_data_dir()
    # Tiny backup rotation (keep 1 copy)
    if os.path.exists(DB_PATH):
        try:
            os.replace(DB_PATH, DB_PATH + ".bak")
        except Exception:
            pass
    data_str = json.dumps(db, ensure_ascii=False, indent=2)
    _atomic_write(DB_PATH, data_str)

# -------------- Public async API --------------

async def load_db() -> Dict[str, Any]:
    """Loads the leaderboard database asynchronously."""
    return _load_db_sync()

async def save_db(db: Dict[str, Any]) -> None:
    """Saves the leaderboard database asynchronously."""
    async with _write_lock:
        _save_db_sync(db)

async def upsert_player(db: Dict[str, Any], user_id: str, name: str) -> None:
    """Adds or updates a player's information in the database."""
    p = db["players"].get(user_id)
    if p is None:
        db["players"][user_id] = {
            "name": name,
            "score": 0,
            "games_played": 0,
            "wins": 0,
            "losses": 0,
            "last_seen": _now_iso(),
        }
    else:
        # Keep the latest display name & timestamp
        p["name"] = name
        p["last_seen"] = _now_iso()

async def record_game_result(
    *,
    winner_id: Optional[str],
    winner_name: str,
    score: int,
    mode: str,
    participant_ids: List[str],
    participant_names: List[str],
    duration_sec: Optional[int] = None,
    game_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Records the result of a game in the leaderboard database."""
    try:
        print("DEBUG: record_game_result called with the following parameters:")
        print(f"  Winner ID: {winner_id}")
        print(f"  Winner Name: {winner_name}")
        print(f"  Score: {score}")
        print(f"  Mode: {mode}")
        print(f"  Participant IDs: {participant_ids}")
        print(f"  Participant Names: {participant_names}")
        print(f"  Duration (sec): {duration_sec}")
        print(f"  Game ID: {game_id}")

        db = await load_db()

        # Ensure all participants exist in players map
        for uid, name in zip(participant_ids, participant_names):
            await upsert_player(db, uid, name)

        # Update winner stats
        if winner_id:
            wp = db["players"][winner_id]
            wp["score"] = int(wp.get("score", 0)) + int(score)
            wp["wins"] = int(wp.get("wins", 0)) + 1
            wp["games_played"] = int(wp.get("games_played", 0)) + 1

        # Update other participants as losses
        for uid in participant_ids:
            if uid == winner_id:
                continue
            pp = db["players"][uid]
            pp["losses"] = int(pp.get("losses", 0)) + 1
            pp["games_played"] = int(pp.get("games_played", 0)) + 1

        # Append game record
        ts = _now_iso()
        if not game_id:
            game_id = f"{ts}"  # Include timestamp to make it unique

        db["games"].append({
            "id": game_id,
            "winner_id": winner_id,
            "winner_name": winner_name,
            "score": score,
            "mode": mode,
            "players": participant_ids,
            "timestamp": ts,
            "duration_sec": duration_sec,
        })

        await save_db(db)
        return db

    except Exception as e:
        print(f"❌ Error in record_game_result: {e}")
        raise

async def get_top_players(limit: int = 20) -> List[Dict[str, Any]]:
    """Returns the top players sorted by score, wins, and games played."""
    db = await load_db()
    # Sort by score desc, then wins desc, then games_played asc
    players = list(db["players"].items())
    players.sort(key=lambda kv: (-kv[1].get("score", 0), -kv[1].get("wins", 0), kv[1].get("games_played", 0)))
    top = []
    for uid, pdata in players[:limit]:
        row = {"user_id": uid}
        row.update(pdata)
        top.append(row)
    return top

async def get_player_stats(user_id: str) -> Optional[Dict[str, Any]]:
    """Returns the stats for a specific player."""
    db = await load_db()
    p = db["players"].get(user_id)
    if not p:
        return None
    out = {"user_id": user_id}
    out.update(p)
    return out