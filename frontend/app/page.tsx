import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShaDe-Fi — DeFi Payroll Transactions for Crypto Employers',
  description: 'The pool is blind. ShaDe-Fi encrypts every reserve value using Zama fhEVM. MEV sandwich attacks are structurally impossible. DeFi payroll transactions that help Crypto employers.',
}

// Simulated live swap feed (static for demo — replace with chain events in prod)
const LIVE_SWAPS = [
  { addr: '0x3f...a912', from: 'USDC', to: 'ETH', ago: '2s' },
  { addr: '0x7a...c031', from: 'ETH',  to: 'USDC', ago: '8s' },
  { addr: '0x1b...f220', from: 'USDC', to: 'ETH',  ago: '14s' },
  { addr: '0x9c...e441', from: 'ETH',  to: 'USDC', ago: '28s' },
]

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="hero">
        <p className="hero-eyebrow">// CONFIDENTIAL AMM · fhEVM · ZAMA</p>
        <h1 className="hero-headline">THE POOL<br />IS BLIND.</h1>
        <p className="hero-tagline">DeFi payroll transactions that help Crypto employers.</p>
        <p className="hero-body">
          Every DEX leaks its reserve state. MEV bots read it and extract value from every swap.
          ShaDe-Fi encrypts pool reserves using Zama&#39;s fhEVM. There are no numbers to read.
          No price impact to calculate. No sandwich to construct.
          Your payroll transactions execute at full rate — every time.
        </p>
        <div className="hero-cta">
          <Link href="/swap" className="btn-primary">SWAP NOW →</Link>
        </div>
      </section>

      {/* ── Proof ── */}
      <section className="proof-section">
        <p className="proof-label">// PROOF</p>
        <div className="proof-grid">
          <div className="proof-col">
            <div className="proof-col-title">Standard Uniswap Pool</div>
            <div className="proof-data">
              <div><span className="normal">reserve0:&nbsp;</span>4,821,304 USDC</div>
              <div><span className="normal">reserve1:&nbsp;</span>2,114 ETH</div>
              <div style={{ marginTop: '12px', color: 'var(--gray)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                ← MEV bot reads this now
              </div>
            </div>
          </div>
          <div className="proof-col">
            <div className="proof-col-title">ShaDe-Fi Pool</div>
            <div className="proof-data">
              <div>
                <span className="normal">reserve0:&nbsp;</span>
                <span className="enc-tag">[encrypted]</span>
              </div>
              <div>
                <span className="normal">reserve1:&nbsp;</span>
                <span className="enc-tag">[encrypted]</span>
              </div>
              <div style={{ marginTop: '12px', color: 'var(--gray)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                ← Bot gets ciphertext. Cannot compute.
              </div>
            </div>
          </div>
        </div>
        <p style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray)' }}>
          Open on Etherscan. Verified. Public. Still unreadable.
        </p>
      </section>

      {/* ── Live Swaps ── */}
      <section className="feed-section">
        <p className="feed-title">// LIVE SWAPS</p>
        <hr className="feed-rule" />
        {LIVE_SWAPS.map((s, i) => (
          <div className="feed-row" key={i}>
            <span className="feed-addr">{s.addr}</span>
            <span className="feed-tx">
              swapped&nbsp;
              <span className="enc-tag">[encrypted]</span>
              &nbsp;{s.from}&nbsp;→&nbsp;
              <span className="enc-tag">[encrypted]</span>
              &nbsp;{s.to}
            </span>
            <span className="feed-time">{s.ago} ago</span>
          </div>
        ))}
        <p className="feed-footer">No amounts. No prices. Nothing for MEV to see.</p>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <p className="proof-label">// HOW IT WORKS</p>
        <div className="how-grid">
          <div className="how-card">
            <div className="how-num">01</div>
            <h3>Encrypt Your Amount</h3>
            <p>The fhEVM SDK encrypts your swap amount client-side before it ever leaves your browser. The chain sees only a ciphertext handle.</p>
          </div>
          <div className="how-card">
            <div className="how-num">02</div>
            <h3>FHE Swap Executes</h3>
            <p>ShadePool computes the constant-product formula entirely inside Fully Homomorphic Encryption. Reserves stay encrypted throughout.</p>
          </div>
          <div className="how-card">
            <div className="how-num">03</div>
            <h3>Decrypt Your Output</h3>
            <p>Only you can decrypt your output amount. The ACL ensures no one else — not the protocol, not validators — can read your result.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="footer-strip">
        <span className="footer-brand">ShaDe-Fi</span>
        <span className="footer-meta">
          Zama fhEVM · Ethereum Sepolia · Space Grotesk + Space Mono · Stitch MCP
        </span>
      </div>
    </div>
  )
}
