'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function Navbar() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">ShaDe-Fi</Link>

        <div className="navbar-links">
          <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
            DASHBOARD
          </Link>
          <Link href="/swap" className={`nav-link ${pathname === '/swap' ? 'active' : ''}`}>
            SWAP
          </Link>
          <Link href="/pool" className={`nav-link ${pathname === '/pool' ? 'active' : ''}`}>
            POOL
          </Link>
          <Link href="/faucet" className={`nav-link ${pathname === '/faucet' ? 'active' : ''}`}>
            FAUCET
          </Link>
        </div>

        <div className="navbar-actions">
          {!mounted ? (
            <button className="btn-ghost" disabled>
              LOADING...
            </button>
          ) : isConnected ? (
            <>
              <span className="wallet-badge">{shortAddr}</span>
              <span className="network-badge">SEPOLIA</span>
              <button className="btn-ghost btn-sm" onClick={() => disconnect()}>
                DISCONNECT
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-ghost"
                onClick={() => connect({ connector: injected() })}
              >
                CONNECT WALLET
              </button>
              <Link href="/swap" className="btn-primary">
                LAUNCH APP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
