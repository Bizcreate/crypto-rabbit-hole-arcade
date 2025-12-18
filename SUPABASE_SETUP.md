# Supabase Setup Guide

## Environment Variables

Add these environment variables to your Vercel project:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://wsqaapqabtwczmvxtgxp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWFhcHFhYnR3Y3ptdnh0Z3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMzM0MDYsImV4cCI6MjA3NzcwOTQwNn0.sloOJkmuvWxrzQwbJ90VZIc6qgL_K7_JUdFyGQCCBO8
\`\`\`

## Database Setup

1. Go to your Supabase project: https://wsqaapqabtwczmvxtgxp.supabase.co
2. Navigate to the SQL Editor
3. Execute the SQL scripts in order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-rls-policies.sql`
   - `scripts/03-functions.sql`
   - `scripts/04-seed-data.sql` (optional, for testing)

## Authentication Setup

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)
4. Set up redirect URLs:
   - Site URL: `https://arcade.thecryptorabbithole.io`
   - Redirect URLs: `https://arcade.thecryptorabbithole.io/**`

## Features Enabled

### Profile Management
- User profiles with wallet addresses
- APE balance, tickets, and points tracking
- Game statistics (wins, losses, streaks)
- Level and experience system

### Card Battle
- Card inventory management
- Upgrade inventory system
- PvP matchmaking with real-time updates
- Match history tracking

### Game Integration
- Unified game session tracking
- Points and rewards system
- Leaderboards by game type
- Transaction history

### Social Features
- Social raids tracking
- Achievements system
- Global leaderboards

## Services Available

- `ProfileService` - User profile operations
- `CardService` - Card inventory management
- `PvPService` - PvP matchmaking and real-time updates
- `GameService` - Game session tracking

## Next Steps

1. Add environment variables to Vercel
2. Run SQL scripts in Supabase
3. Test authentication flow
4. Integrate services into existing components
5. Enable real-time PvP features
