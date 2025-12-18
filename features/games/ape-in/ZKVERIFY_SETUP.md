# 🔐 zkVerify Integration Setup Guide

## Overview
Ape In! now features **trustless game verification** using zkVerify's zero-knowledge proof system! Every victory is cryptographically verified without revealing your game strategy.

## 🚀 Quick Start

### 1. Add zkVerify Environment Variables

Create or update your `.env.local` file in the `frontend/` directory:

```bash
# zkVerify Configuration
VITE_ZKVERIFY_API_KEY=your_zkverify_api_key_here
VITE_USE_ZKVERIFY=false
```

### 2. Environment Variable Options

#### Development Mode (Recommended for Testing)
```bash
VITE_USE_ZKVERIFY=false
```
- Fast mock verification
- No API key required
- Perfect for development and testing
- All game rules still enforced

#### Production Mode (Real zkVerify)
```bash
VITE_ZKVERIFY_API_KEY=your_actual_api_key
VITE_USE_ZKVERIFY=true
```
- Real zero-knowledge proofs
- On-chain verification
- Trustless validation
- Cryptographic guarantees

## 🔧 Getting a zkVerify API Key

1. Visit [zkVerify Documentation](https://docs.zkverify.io/)
2. Sign up for testnet access
3. Generate an API key from your dashboard
4. Copy the API key to your `.env.local` file

## 🎮 How It Works

### Game Completion Verification Flow

1. **Player wins game** → Victory condition detected
2. **zkVerify submission** → Game state sent to zkVerify testnet
3. **Proof generation** → zkVerify generates zero-knowledge proof (~3-7 seconds)
4. **Verification** → Proof is verified on-chain
5. **Result displayed** → Victory screen shows "✓ Verified!" or error message

### What Gets Verified

- **Game State Integrity** - All moves were valid
- **Score Calculation** - Final score matches game rules  
- **Randomness Proof** - Dice rolls were fair
- **Win Condition** - Player legitimately reached winning score
- **Move Consistency** - Card draws and dice rolls match recorded moves

## 🎯 User Experience

### Before zkVerify
- Complete game → Instant victory
- No proof of valid completion
- Trust-based verification

### After zkVerify
1. Complete game
2. **"Verifying Victory..."** loading screen
3. zkVerify generates zero-knowledge proof
4. **"✓ Verified via zkVerify"** badge
5. Proof ID displayed for transparency
6. Victory with cryptographic guarantee

## 🔧 Technical Details

### Verification Process

```typescript
import { verifyApeInGameWithZkVerify, mockVerifyApeInGame } from '@/lib/zkverify'

// Automatic verification on game completion
const result = await verifyApeInGameWithZkVerify(gameState)

if (result.isValid) {
  console.log('Victory verified!', result.proofId)
} else {
  console.error('Verification failed:', result.error)
}
```

### API Endpoints

- **Testnet RPC**: `https://testnet-rpc.zkverify.io`
- **Proof Submission**: `/submit-proof`
- **Status Check**: `/proof-status/:proofId`

### Proof Format

The system verifies the complete game state:
- Game ID and player information
- All moves (card draws, dice rolls, sats stacking)
- Final score and winning condition
- Round count and game progression
- Wallet address for leaderboard integrity

## 🧪 Testing

### Mock Mode Testing (Recommended)
```bash
VITE_USE_ZKVERIFY=false
```
- Instant verification
- Perfect for development
- All validation rules enforced

### Real zkVerify Testing
```bash
VITE_ZKVERIFY_API_KEY=your_api_key
VITE_USE_ZKVERIFY=true
```
- Real zero-knowledge proofs
- ~3-7 second verification time
- Full cryptographic validation

### Manual Testing Steps

1. Start a new game
2. Play through to victory
3. Watch for "Verifying Victory..." loading
4. Check victory screen for proof ID
5. Verify console logs for verification details

## 🛠️ Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ZKVERIFY_API_KEY` | For production | zkVerify testnet API key |
| `VITE_USE_ZKVERIFY` | No | Toggle real verification (default: false) |

### Verification Behavior

```bash
# Force mock mode (development)
VITE_USE_ZKVERIFY=false

# Use real zkVerify (production)
VITE_USE_ZKVERIFY=true
VITE_ZKVERIFY_API_KEY=abc123...
```

## 🎯 Features

### ✅ Implemented
- Zero-knowledge proof generation for game victories
- Automatic verification on win
- Loading states and error handling
- Proof ID display in victory screen
- Mock mode for development
- Move tracking for complete game state
- Comprehensive validation

### 🔜 Future Enhancements
- Store proofs on-chain
- Leaderboard with verified scores only
- Proof verification on blockchain
- Historical proof lookup
- Multi-proof aggregation
- Advanced zkVerify features

## 🐛 Troubleshooting

### "API key not configured"
**Solution:** Add `VITE_ZKVERIFY_API_KEY` to `.env.local` or use mock mode

### "Verification timeout"
**Solution:** 
- Check network connection
- zkVerify testnet may be slow
- Use mock mode: `VITE_USE_ZKVERIFY=false`

### "Invalid game state format"
**Solution:**
- Ensure all game moves are properly tracked
- Check console for validation errors
- Verify game completion logic

## 📚 Resources

- [zkVerify Documentation](https://docs.zkverify.io/)
- [zkVerify Relayer Guide](https://docs.zkverify.io/overview/getting-started/relayer)
- [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)
- [zkVerify Testnet](https://testnet.zkverify.io/)

## 🔒 Security

### Zero-Knowledge Guarantees
- ✅ Game strategy privacy preserved
- ✅ No solving process revealed
- ✅ Cryptographic validity proof
- ✅ Trustless verification
- ✅ Immutable proof records

### Best Practices
- API keys in environment variables
- Never commit `.env.local`
- Use HTTPS for all requests
- Validate all inputs
- Handle errors gracefully

## 💡 Development Tips

1. **Start with mock mode** - Fast iteration
2. **Test edge cases** - Invalid games, timeouts
3. **Check console logs** - Detailed verification info
4. **Use TypeScript** - Catch errors early
5. **Test both modes** - Mock and real verification

## 🎉 Success!

Your Ape In! game now has **trustless verification** powered by zkVerify! Every victory is cryptographically proven valid without revealing how you achieved it. 🚀🔐✨

## 🔗 Integration Points

### Game Completion Flow
When a player wins:
1. Game checks victory condition
2. **zkVerify verification triggered**
3. Loading state shows "Verifying Victory..."
4. On success: Victory screen with proof ID
5. On failure: Error message with details

### UI Feedback
- 🔄 "Verifying Victory..." - During proof generation
- ✅ "Victory Verified!" - Successful verification
- ❌ "Verification Failed" - Invalid game or error
- 🔗 Proof ID displayed for transparency

This creates a seamless, trustworthy gaming experience where every victory is cryptographically guaranteed! 🎮🔐
