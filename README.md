# ShaDe-Fi

> **The first private exchange on Ethereum.**

ShaDe-Fi uses Zama's technology to keep your trades private. Every pool balance is encrypted. This means bots cannot see your trades and cannot front-run you.

---

## How it works

```solidity
// Normal Exchange — Everyone can see the balance
uint256 public balance; 

// ShaDe-Fi — Private balance, invisible to bots
euint128 internal _privateBalance; 
```

By hiding the balances, we make sure that your trades are safe and private.

---

## Quick Start

### 1. Run the App

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Network Info

The app runs on the **Zama Sepolia** testnet.
- **Network:** `https://ethereum-sepolia-rpc.publicnode.com`
- **Chain ID:** `11155111`

---

## Technology

- **Smart Contracts**: Solidity and Zama fhEVM.
- **Frontend**: Next.js and Simple CSS.
- **Privacy**: Hidden balances and secure trade execution.
- **Design**: Black and Yellow Brutalist Theme.

---

## Protocol Features

- **Private Swap:** Trade tokens without exposing your buy/sell amounts.
- **Private Pools:** Add liquidity without revealing your position size.
- **Simple Stats:** View network health in real-time.
- **Token Faucet:** Get free test tokens to try the app.

---

## Contract Addresses

| Contract | Address |
|---|---|
| Main Factory | `0xd36b3657c2e3795e32f07a2f135ba51f8306521d` |
| Trade Router | `0x97d23f400fcccc7ba0ed53014ee83fab89563749` |
| shUSDC Token | `0x19b9cc9a2eac8d5275765e1584045258e6bc544a` |
| shETH Token | `0x3b636e4ce4d4991115cba54f57ec451702371179` |

---

*ShaDe-Fi · Private Exchange · Black & Yellow #FFE500*
