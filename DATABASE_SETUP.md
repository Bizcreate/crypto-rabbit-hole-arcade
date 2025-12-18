# Crypto Rabbit Hole Arcade - Database Setup Guide

## Overview
This guide will help you set up the Supabase database for the Crypto Rabbit Hole Arcade platform.

## Prerequisites
- Supabase account (sign up at https://supabase.com)
- Access to Supabase SQL Editor

## Setup Instructions

### Step 1: Create a New Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: crypto-rabbit-arcade (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (~2 minutes)

### Step 2: Execute SQL Scripts
Execute the SQL scripts in order using the Supabase SQL Editor:

1. **Navigate to SQL Editor**
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar

2. **Execute scripts in this order:**

   **Script 1: Create Tables** (`01-create-tables.sql`)
   - Copy the entire contents of `scripts/01-create-tables.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter
   - Verify: You should see "Success. No rows returned"

   **Script 2: Row Level Security** (`02-rls-policies.sql`)
   - Copy the entire contents of `scripts/02-rls-policies.sql`
   - Paste into the SQL Editor
   - Click "Run"
   - Verify: You should see "Success. No rows returned"

   **Script 3: Helper Functions** (`03-functions.sql`)
   - Copy the entire contents of `scripts/03-functions.sql`
   - Paste into the SQL Editor
   - Click "Run"
   - Verify: You should see "Success. No rows returned"

   **Script 4: Seed Data (Optional)** (`04-seed-data.sql`)
   - Copy the entire contents of `scripts/04-seed-data.sql`
   - Paste into the SQL Editor
   - Click "Run"
   - This adds initial social raids and optional test data

### Step 3: Verify Database Setup

1. **Check Tables**
   - Click "Table Editor" in the left sidebar
   - You should see all tables: profiles, card_inventory, upgrades_inventory, etc.

2. **Check Functions**
   - Click "Database" → "Functions" in the left sidebar
   - You should see: get_or_create_profile, add_card_to_inventory, update_user_balance, etc.

3. **Check RLS Policies**
   - Click "Authentication" → "Policies" in the left sidebar
   - Each table should have policies listed

### Step 4: Get Your Connection Details

1. **Get API Keys**
   - Click "Settings" → "API" in the left sidebar
   - Copy these values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: `eyJhbGc...` (this is safe for client-side)
     - **service_role key**: `eyJhbGc...` (keep this secret! server-side only)

2. **Add to Your Environment Variables**
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Server-side only
   \`\`\`

## Database Schema Overview

### Core Tables

**profiles**
- User accounts with wallet addresses
- Game currency (APE, tickets, points)
- Stats (wins, losses, playtime)

**card_inventory**
- User's card collection
- Card stats and staking status

**upgrades_inventory**
- Purchased upgrades not yet used
- Tracks purchase and usage

**game_sessions**
- All game session records
- Tracks duration, results, rewards

**pvp_matches**
- PvP card battle matches
- Match status and game state

**match_history**
- Detailed match history
- Damage dealt/taken, upgrades used

**transactions**
- All currency transactions
- APE, tickets, points tracking

**leaderboard**
- Player rankings
- Game-specific high scores

**achievements**
- User achievements
- Rewards for milestones

**social_raids**
- Available social tasks
- Rewards for completion

**raid_participation**
- User raid completion tracking

**pack_openings**
- Pack opening history
- Cards pulled tracking

### Helper Functions

**get_or_create_profile(wallet_address, username)**
- Gets existing profile or creates new one
- Updates last login timestamp

**add_card_to_inventory(user_id, card_number, ...)**
- Adds card to user's inventory
- Prevents duplicates

**update_user_balance(user_id, ape_change, tickets_change, points_change, ...)**
- Updates user balances
- Records transactions automatically

**record_game_session(user_id, game_type, ...)**
- Records game session
- Updates stats and rewards

**purchase_upgrade(user_id, upgrade_type, ...)**
- Purchases upgrade
- Deducts APE and adds to inventory

**get_leaderboard(limit)**
- Returns ranked leaderboard
- Includes user details

**find_pvp_opponent(user_id)**
- Finds or creates PvP match
- Matchmaking logic

## Security Notes

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Leaderboard and profiles are publicly readable
- PvP matches visible to both players

### Authentication
- Use Supabase Auth or custom wallet authentication
- Set `app.current_user_id` and `app.current_user_wallet` for RLS
- Never expose service_role key to client

## Testing the Database

### Test Profile Creation
\`\`\`sql
SELECT get_or_create_profile('0xYourWalletAddress', 'YourUsername');
\`\`\`

### Test Adding a Card
\`\`\`sql
SELECT add_card_to_inventory(
  'user-uuid-here',
  33,
  'Indy',
  'rare',
  45,
  30
);
\`\`\`

### Test Balance Update
\`\`\`sql
SELECT update_user_balance(
  'user-uuid-here',
  100,  -- +100 APE
  2,    -- +2 tickets
  50,   -- +50 points
  'test_reward',
  'Test reward'
);
\`\`\`

### View Leaderboard
\`\`\`sql
SELECT * FROM get_leaderboard(10);
\`\`\`

## Troubleshooting

### "relation does not exist" error
- Make sure you ran script 01 first
- Check that you're in the correct project

### "permission denied" error
- Check RLS policies (script 02)
- Verify you're setting user context correctly

### Functions not working
- Make sure script 03 was executed successfully
- Check function definitions in Database → Functions

## Next Steps

1. ✅ Database is set up
2. Connect your Next.js app to Supabase
3. Implement authentication
4. Test CRUD operations
5. Build PvP matchmaking
6. Add real-time subscriptions for live matches

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify all scripts executed successfully
3. Check RLS policies are correctly applied
4. Review the Supabase documentation: https://supabase.com/docs
