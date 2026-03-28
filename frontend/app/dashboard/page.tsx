'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import {
  FACTORY_ADDRESS, ROUTER_ADDRESS,
  SHADE_USDC_ADDRESS, SHADE_ETH_ADDRESS
} from '@/lib/contracts'
import { useTotalPools } from '@/hooks/useShadePool'

const CONTRACTS = [
  { label: 'ShadeFactory',  addr: FACTORY_ADDRESS },
  { label: 'ShadeRouter',   addr: ROUTER_ADDRESS },
  { label: 'shadeUSDC',     addr: SHADE_USDC_ADDRESS },
  { label: 'shadeETH',      addr: SHADE_ETH_ADDRESS },
]

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { data: totalPools } = useTotalPools()

  return (
    <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 24px' }}>

      {/* Header */}
      <p className="hero-eyebrow">// DASHBOARD</p>
      <h1 style={{ fontSize: '42px', color: 'var(--yellow)', marginBottom: '8px' }}>
        ShaDe-Fi PROTOCOL
      </h1>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray)', marginBottom: '40px' }}>
        Ethereum Sepolia · Zama fhEVM · Chain ID 11155111
      </p>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--border-yellow)', marginBottom: '32px' }}>
        {[
          { label: 'Active Pools', value: totalPools?.toString() ?? '—' },
          { label: 'Fee Rate', value: '0.30%' },
          { label: 'MEV Extracted', value: '$0.00' },
        ].map(({ label, value }, i) => (
          <div key={i} style={{
            padding: '24px 28px',
            borderRight: i < 2 ? '1px solid var(--border-yellow)' : 'none'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--yellow)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', color: 'var(--white)', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
        {[
          { href: '/swap', label: 'SWAP', desc: 'Execute a confidential swap' },
          { href: '/pool', label: 'POOL', desc: 'Add or remove liquidity' },
          { href: '/faucet', label: 'FAUCET', desc: 'Mint test tokens' },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href} style={{
            display: 'block',
            border: '1px solid var(--border-yellow)',
            padding: '24px',
            textDecoration: 'none',
            transition: 'background 0.1s',
          }}
            className="dashboard-card"
          >
            <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '16px', color: 'var(--yellow)', marginBottom: '8px' }}>{label} →</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gray)' }}>{desc}</div>
          </Link>
        ))}
      </div>

      {/* Connected wallet */}
      <div style={{ border: '1px solid var(--border-yellow)', padding: '28px', marginBottom: '28px' }}>
        <h3 className="section-heading" style={{ marginTop: 0 }}>CONNECTED WALLET</h3>
        {isConnected ? (
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Address</span>
              <span className="info-value mono">
                <a href={`https://sepolia.etherscan.io/address/${address}`} target="_blank" rel="noreferrer"
                  style={{ color: 'var(--yellow)', textDecoration: 'none' }}>
                  {address} ↗
                </a>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Network</span>
              <span className="network-badge">SEPOLIA</span>
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray)' }}>
            No wallet connected. <Link href="/swap" style={{ color: 'var(--yellow)' }}>Connect via swap page →</Link>
          </p>
        )}
      </div>

      {/* Contract addresses */}
      <div style={{ border: '1px solid var(--border-yellow)', padding: '28px' }}>
        <h3 className="section-heading" style={{ marginTop: 0 }}>DEPLOYED CONTRACTS (SEPOLIA)</h3>
        <div className="info-grid">
          {CONTRACTS.map(({ label, addr }) => (
            <div className="info-row" key={label}>
              <span className="info-label">{label}</span>
              <span className="info-value mono">
                <a
                  href={`https://sepolia.etherscan.io/address/${addr}`}
                  target="_blank" rel="noreferrer"
                  style={{ color: 'var(--yellow)', textDecoration: 'none', fontSize: '12px' }}
                >
                  {addr} ↗
                </a>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
