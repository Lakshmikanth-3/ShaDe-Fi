# ShaDe-Fi

> **DeFi payroll transactions that help Crypto employers.**

ShaDe-Fi is the first confidential AMM on Ethereum using Zama's fhEVM. Every pool reserve is an encrypted `euint128` ciphertext. MEV sandwich attacks are not mitigated — they are **structurally impossible**.

---

## The stunt

```solidity
// Normal Uniswap pool — public state, full MEV surface
uint256 public reserve0;  // 4,821,304 — everyone can read this

// ShaDe-Fi pool — encrypted state, zero MEV surface
euint128 internal _reserveA;  // [encrypted] — nobody reads this
```

Two variable declarations. Structurally different security guarantees.

---

## Quick start

### 1. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Fill in your RPC URL and deployed contract addresses
npm install
npm run dev
# → http://localhost:3000
```

### 2. Contracts

```bash
cd contracts
npm install
cp ../.env.local.example .env  # add your DEPLOYER_PRIVATE_KEY and RPC_URL
npm run deploy
# Copy printed addresses to frontend/.env.local

# Mint test tokens to your wallet
npm run mint
```

---

## Stack

| Layer | Technology |
|---|---|
| Smart contracts | Solidity 0.8.24 · Zama fhEVM (`euint128`, TFHE operators, ACL) |
| Test tokens | ConfidentialERC20 (`ShaDe-USDC`, `ShaDe-ETH`) |
| Frontend | Next.js 16 · TypeScript · Wagmi · Viem |
| Encryption | fhEVM.js SDK (client-side encrypt/decrypt) |
| Design | Space Grotesk + Space Mono · Brutalist Minimalist |
| UI generation | **Stitch MCP Server** |
| Network | Ethereum Sepolia with Zama fhEVM executor |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, proof section, live swap feed |
| `/dashboard` | Protocol stats, contract addresses, quick actions |
| `/swap` | Execute confidential swaps with fhEVM encryption |
| `/pool` | Add/remove liquidity, view encrypted LP position |
| `/faucet` | Mint test tokens to your wallet |

---

## Deployed Contracts (Sepolia)

| Contract | Address |
|---|---|
| ShadeFactory | `0xd36b3657c2e3795e32f07a2f135ba51f8306521d` |
| ShadeRouter | `0x97d23f400fcccc7ba0ed53014ee83fab89563749` |
| ShaDe-USDC | `0x19b9cc9a2eac8d5275765e1584045258e6bc544a` |
| ShaDe-ETH | `0x3b636e4ce4d4991115cba54f57ec451702371179` |

---

## Sponsors

| Sponsor | Usage |
|---|---|
| **Zama** | fhEVM is the core — `euint128` reserves, TFHE operators, ACL, ConfidentialERC20 |
| **Starknet** | Privacy DeFi track — private swaps, hidden positions |
| **Filecoin / Protocol Labs** | Encrypted swap event archival to FVM |
| **Ethereum Foundation** | Runs on Ethereum Sepolia — no new chain required |

---

## How MEV is structurally impossible

1. Bot queries `ShadePool.getEncryptedReserves()`
2. Gets `(euint128(0x4a3f...), euint128(0x8c2d...))`
3. Cannot decrypt — no ACL permission
4. Cannot compute price impact
5. Cannot construct a profitable sandwich
6. **Game over.**

---

*ShaDe-Fi · fhEVM · Brutalist Minimalist · Yellow #FFE500 + Black #0A0A0A*
