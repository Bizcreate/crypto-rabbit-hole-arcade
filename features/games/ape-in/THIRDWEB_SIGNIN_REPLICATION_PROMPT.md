# 🔐 Thirdweb Wallet Sign-In Replication Guide

Complete code and setup instructions to replicate the functional wallet sign-in method used in Ape In! game.

---

## 📦 Step 1: Installation

```bash
npm install thirdweb@^5.108.13
```

---

## 🔧 Step 2: Environment Setup

Create a `.env` file in your project root:

```env
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

**Get your Client ID:**
1. Go to [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
2. Sign in or create an account
3. Create a new project or select existing one
4. Copy your **Client ID** from the project settings

---

## 📁 Step 3: Create Thirdweb Client Configuration

Create `src/lib/thirdweb.ts`:

```typescript
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

/**
 * Get Thirdweb Client ID from environment variable
 */
function getThirdwebClientId(): string {
  const envClientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  
  if (envClientId) {
    console.log('✅ Using Thirdweb Client ID from environment variable');
    return envClientId;
  }
  
  console.warn('⚠️ No Thirdweb Client ID found, using placeholder');
  return "placeholder-client-id-replace-me";
}

// Create the ThirdWeb client
const clientId = getThirdwebClientId();

export const client = createThirdwebClient({
  clientId,
});

// Define primary wallet (MetaMask)
export const wallet = createWallet("io.metamask");

// Export all supported wallets
export const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];
```

---

## 🎯 Step 4: Setup Provider in Main App

Update your `src/main.tsx` (or `src/index.tsx`):

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from 'thirdweb/react';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
);
```

---

## 🎨 Step 5: Create Wallet Connection Component

Create `src/components/WalletConnection.tsx`:

```typescript
import { ConnectButton, useActiveAccount, useDisconnect } from 'thirdweb/react';
import { client, wallet, wallets } from '../lib/thirdweb';
import { createWallet } from 'thirdweb/wallets';
import { useState } from 'react';

export default function WalletConnection() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect(wallet);
    setShowAccountMenu(false);
  };

  return (
    <div className="wallet-connection">
      {account ? (
        <div className="account-display">
          {/* Account Info */}
          <div className="account-info">
            <div className="connection-indicator">
              <div className="green-dot"></div>
            </div>
            <div className="wallet-details">
              <span className="wallet-label">Connected</span>
              <span className="wallet-address">{formatAddress(account.address)}</span>
            </div>
          </div>

          {/* Disconnect Button */}
          <button 
            onClick={handleDisconnect}
            className="disconnect-button"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <ConnectButton
          client={client}
          wallets={[
            wallet,
            createWallet('io.metamask'),
            createWallet('com.coinbase.wallet'),
            createWallet('me.rainbow'),
          ]}
          theme="dark"
          connectButton={{
            label: 'Connect Wallet',
            className: 'custom-connect-button',
          }}
          connectModal={{
            size: 'compact',
            title: 'Connect Your Wallet',
            titleIcon: '🔐',
            showThirdwebBranding: false,
          }}
        />
      )}
    </div>
  );
}
```

---

## 📝 Step 6: Use Wallet in Your Components

### Basic Usage Example

```typescript
import { useActiveAccount } from 'thirdweb/react';

function MyComponent() {
  const account = useActiveAccount();
  const walletAddress = account?.address;

  if (!account) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <h2>Welcome!</h2>
      <p>Your wallet: {walletAddress}</p>
      {/* Your component logic here */}
    </div>
  );
}
```

### Advanced Usage with Game Logic

```typescript
import { useActiveAccount } from 'thirdweb/react';
import { useState, useEffect } from 'react';

function GameComponent() {
  const account = useActiveAccount();
  const [playerName, setPlayerName] = useState('');
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    // Load player profile when wallet connects
    if (account?.address) {
      const savedProfile = localStorage.getItem(`profile_${account.address}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setPlayerName(profile.name || 'Player');
      }
    }
  }, [account]);

  const createGame = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'sandy',
          playerName: playerName,
          walletAddress: account.address,
        }),
      });

      const game = await response.json();
      setGameData(game);
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  if (!account) {
    return <div>Please connect your wallet to play</div>;
  }

  return (
    <div>
      <h2>Player: {playerName}</h2>
      <p>Wallet: {account.address}</p>
      <button onClick={createGame}>Start Game</button>
      {gameData && <div>{/* Game UI */}</div>}
    </div>
  );
}
```

---

## 🎨 Step 7: Optional CSS Styling

Add to your `src/index.css`:

```css
/* Wallet Connection Styles */
.wallet-connection {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.account-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.75rem;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.connection-indicator {
  position: relative;
}

.green-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.wallet-details {
  display: flex;
  flex-direction: column;
}

.wallet-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.wallet-address {
  font-size: 0.875rem;
  font-family: monospace;
  color: #10b981;
  font-weight: 600;
}

.disconnect-button {
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #fca5a5;
  cursor: pointer;
  transition: all 0.2s;
}

.disconnect-button:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

/* ThirdWeb Connect Button Customization */
.custom-connect-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-connect-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}
```

---

## 🔄 Step 8: Complete Example App

Create `src/App.tsx`:

```typescript
import { useActiveAccount } from 'thirdweb/react';
import WalletConnection from './components/WalletConnection';

function App() {
  const account = useActiveAccount();

  return (
    <div className="app">
      <header>
        <h1>My DApp</h1>
        <WalletConnection />
      </header>

      <main>
        {account ? (
          <div className="connected-content">
            <h2>Welcome! 🎉</h2>
            <p>Your wallet is connected:</p>
            <p className="wallet-address">{account.address}</p>
            
            {/* Your app content here */}
            <div className="features">
              <button onClick={() => alert('Feature 1')}>Feature 1</button>
              <button onClick={() => alert('Feature 2')}>Feature 2</button>
            </div>
          </div>
        ) : (
          <div className="not-connected">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to continue</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

---

## 🎯 Key Features Replicated

✅ **Multi-wallet support**: MetaMask, Coinbase, Rainbow, Rabby  
✅ **Clean UI**: ConnectButton with custom styling  
✅ **Account state management**: `useActiveAccount()` hook  
✅ **Disconnect functionality**: `useDisconnect()` hook  
✅ **Address formatting**: Display as `0x1234...5678`  
✅ **Connection indicator**: Visual feedback when connected  
✅ **Session persistence**: Wallet stays connected on refresh  

---

## 📚 Available Hooks

```typescript
// Get connected account
const account = useActiveAccount();
// Returns: { address: string, ... } | undefined

// Disconnect wallet
const { disconnect } = useDisconnect();
disconnect(wallet);

// Check connection status
const isConnected = account !== undefined;
const walletAddress = account?.address;
```

---

## 🚀 Usage in API Calls

```typescript
import { useActiveAccount } from 'thirdweb/react';

function ApiComponent() {
  const account = useActiveAccount();

  const sendTransaction = async () => {
    if (!account) {
      alert('Wallet not connected');
      return;
    }

    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: account.address,
        // ... other data
      }),
    });

    return response.json();
  };

  return (
    <button onClick={sendTransaction} disabled={!account}>
      Send Transaction
    </button>
  );
}
```

---

## 🔍 Troubleshooting

**Issue: "No Thirdweb Client ID found"**
- Make sure `.env` file exists with `VITE_THIRDWEB_CLIENT_ID`
- Restart your dev server after adding env variables

**Issue: Wallet not connecting**
- Make sure wallet extension is installed
- Check browser console for errors
- Verify Client ID is correct in Thirdweb Dashboard

**Issue: Account is undefined**
- Wait for wallet connection to complete
- Check that `ThirdwebProvider` wraps your app
- Verify wallet extension is unlocked

---

## 📖 Additional Resources

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Thirdweb React SDK](https://portal.thirdweb.com/react)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)

---

## ✅ Checklist

- [ ] Install `thirdweb` package
- [ ] Create `.env` file with Client ID
- [ ] Create `src/lib/thirdweb.ts` configuration
- [ ] Wrap app with `ThirdwebProvider`
- [ ] Add `ConnectButton` component
- [ ] Use `useActiveAccount()` in components
- [ ] Test wallet connection
- [ ] Test disconnect functionality
- [ ] Verify wallet address is accessible
- [ ] Test session persistence (refresh page)

---

**That's it!** You now have a fully functional wallet sign-in system identical to the one used in Ape In! game. 🎉

