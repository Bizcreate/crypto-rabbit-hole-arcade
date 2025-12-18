-- =====================================================
-- SEED DATA (OPTIONAL)
-- =====================================================
-- This script adds initial data for testing
-- Only run this in development/testing environments

-- =====================================================
-- SEED SOCIAL RAIDS
-- =====================================================
INSERT INTO social_raids (raid_name, raid_type, raid_url, raid_description, ape_reward, points_reward, is_active, expires_at)
VALUES
  ('Follow on Twitter', 'twitter', 'https://twitter.com/cryptorabbithole', 'Follow our official Twitter account', 50, 100, true, NOW() + INTERVAL '30 days'),
  ('Join Discord', 'discord', 'https://discord.gg/cryptorabbithole', 'Join our Discord community', 75, 150, true, NOW() + INTERVAL '30 days'),
  ('Join Telegram', 'telegram', 'https://t.me/cryptorabbithole', 'Join our Telegram group', 50, 100, true, NOW() + INTERVAL '30 days'),
  ('Retweet Launch', 'twitter', 'https://twitter.com/cryptorabbithole/status/123', 'Retweet our launch announcement', 100, 200, true, NOW() + INTERVAL '7 days'),
  ('Share on Reddit', 'reddit', 'https://reddit.com/r/cryptorabbithole', 'Share on Reddit', 75, 150, true, NOW() + INTERVAL '14 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- TEST PROFILES (OPTIONAL - REMOVE IN PRODUCTION)
-- =====================================================
-- Uncomment to create test profiles
/*
INSERT INTO profiles (wallet_address, username, ape_balance, tickets, points)
VALUES
  ('0x1111111111111111111111111111111111111111', 'TestPlayer1', 5000, 10, 1500),
  ('0x2222222222222222222222222222222222222222', 'TestPlayer2', 3000, 5, 800),
  ('0x3333333333333333333333333333333333333333', 'TestPlayer3', 10000, 20, 3000)
ON CONFLICT DO NOTHING;
*/
