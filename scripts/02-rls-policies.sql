-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================
-- This script sets up RLS policies to protect user data
-- Execute after creating tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE upgrades_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_openings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
-- Users can read all profiles (for leaderboards, PvP matching)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (wallet_address = current_setting('app.current_user_wallet', true));

-- =====================================================
-- CARD INVENTORY POLICIES
-- =====================================================
-- Users can only see their own cards
CREATE POLICY "Users can view own cards"
  ON card_inventory FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

-- Users can insert their own cards
CREATE POLICY "Users can insert own cards"
  ON card_inventory FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

-- Users can update their own cards
CREATE POLICY "Users can update own cards"
  ON card_inventory FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- UPGRADES INVENTORY POLICIES
-- =====================================================
CREATE POLICY "Users can view own upgrades"
  ON upgrades_inventory FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own upgrades"
  ON upgrades_inventory FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own upgrades"
  ON upgrades_inventory FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- GAME SESSIONS POLICIES
-- =====================================================
CREATE POLICY "Users can view own game sessions"
  ON game_sessions FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own game sessions"
  ON game_sessions FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- PVP MATCHES POLICIES
-- =====================================================
-- Users can view matches they're involved in
CREATE POLICY "Users can view own matches"
  ON pvp_matches FOR SELECT
  USING (
    player1_id::text = current_setting('app.current_user_id', true) OR
    player2_id::text = current_setting('app.current_user_id', true)
  );

-- Users can create matches
CREATE POLICY "Users can create matches"
  ON pvp_matches FOR INSERT
  WITH CHECK (
    player1_id::text = current_setting('app.current_user_id', true) OR
    player2_id::text = current_setting('app.current_user_id', true)
  );

-- Users can update matches they're involved in
CREATE POLICY "Users can update own matches"
  ON pvp_matches FOR UPDATE
  USING (
    player1_id::text = current_setting('app.current_user_id', true) OR
    player2_id::text = current_setting('app.current_user_id', true)
  );

-- =====================================================
-- MATCH HISTORY POLICIES
-- =====================================================
CREATE POLICY "Users can view own match history"
  ON match_history FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own match history"
  ON match_history FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- TRANSACTIONS POLICIES
-- =====================================================
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- LEADERBOARD POLICIES
-- =====================================================
-- Everyone can view leaderboard
CREATE POLICY "Leaderboard is viewable by everyone"
  ON leaderboard FOR SELECT
  USING (true);

-- Users can insert their own leaderboard entry
CREATE POLICY "Users can insert own leaderboard entry"
  ON leaderboard FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

-- Users can update their own leaderboard entry
CREATE POLICY "Users can update own leaderboard entry"
  ON leaderboard FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- ACHIEVEMENTS POLICIES
-- =====================================================
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- SOCIAL RAIDS POLICIES
-- =====================================================
-- Everyone can view active raids
CREATE POLICY "Active raids are viewable by everyone"
  ON social_raids FOR SELECT
  USING (is_active = true);

-- =====================================================
-- RAID PARTICIPATION POLICIES
-- =====================================================
CREATE POLICY "Users can view own raid participation"
  ON raid_participation FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own raid participation"
  ON raid_participation FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own raid participation"
  ON raid_participation FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- PACK OPENINGS POLICIES
-- =====================================================
CREATE POLICY "Users can view own pack openings"
  ON pack_openings FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own pack openings"
  ON pack_openings FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));
