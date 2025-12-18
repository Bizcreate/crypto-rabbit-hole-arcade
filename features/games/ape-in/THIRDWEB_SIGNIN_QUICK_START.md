# 🚀 Thirdweb Wallet Sign-In - Quick Start

## Installation
```bash
npm install thirdweb@^5.108.13
```

## 1. Environment (.env)
```env
VITE_THIRDWEB_CLIENT_ID=your_client_id_here
```

## 2. Client Config (src/lib/thirdweb.ts)
```typescript
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

export const wallet = createWallet("io.metamask");

export const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];
```

## 3. Provider (src/main.tsx)
```typescript
import { ThirdwebProvider } from 'thirdweb/react';

<ThirdwebProvider>
  <App />
</ThirdwebProvider>
```

## 4. Connect Button Component
```typescript
import { ConnectButton, useActiveAccount, useDisconnect } from 'thirdweb/react';
import { client, wallet } from '../lib/thirdweb';
import { createWallet } from 'thirdweb/wallets';

function WalletButton() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();

  if (account) {
    return (
      <div>
        <span>{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
        <button onClick={() => disconnect(wallet)}>Disconnect</button>
      </div>
    );
  }

  return (
    <ConnectButton
      client={client}
      wallets={[wallet, createWallet('io.metamask'), createWallet('com.coinbase.wallet')]}
      theme="dark"
    />
  );
}
```

## 5. Use in Components
```typescript
import { useActiveAccount } from 'thirdweb/react';

function MyComponent() {
  const account = useActiveAccount();
  const walletAddress = account?.address;

  if (!account) return <div>Connect wallet first</div>;

  return <div>Wallet: {walletAddress}</div>;
}
```

Done! ✅

