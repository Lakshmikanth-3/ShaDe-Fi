'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseAbi } from 'viem'
import { SHADE_USDC_ADDRESS, SHADE_ETH_ADDRESS } from '@/lib/contracts'

const SHADE_TOKEN_ABI = parseAbi([
  'function mint(address to, uint64 amount) external',
  'function name() view returns (string)',
])

export default function FaucetPage() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [minting, setMinting] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const { writeContract, isPending } = useWriteContract()

  if (!mounted) return null

  const mint = async (token: 'USDC' | 'ETH') => {
    if (!address) return
    setMinting(token)

    const contractAddr = token === 'USDC' ? SHADE_USDC_ADDRESS : SHADE_ETH_ADDRESS
    // Mint 10,000 USDC or 5 ETH equivalent (uint64 amounts)
    const amount = token === 'USDC' ? 10_000_000_000n : 5_000_000_000_000n

    writeContract(
      {
        address: contractAddr,
        abi: SHADE_TOKEN_ABI,
        functionName: 'mint',
        args: [address, amount],
      },
      {
        onSuccess: () => {
          setDone(prev => [...prev, token])
          setMinting(null)
        },
        onError: (e) => {
          console.error(e)
          setMinting(null)
        },
      }
    )
  }

  return (
    <div className="swap-page">
      <div className="swap-card">
        <h1 className="swap-title">FAUCET</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray)', marginBottom: '24px' }}>
          // Mint test tokens to your connected wallet. Deployer only — testnet use only.
        </p>

        <div className="section-rule" />

        {/* shadeUSDC */}
        <div className="token-panel" style={{ marginBottom: '16px' }}>
          <div className="panel-label">shadeUSDC</div>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray)' }}>
              Mint 10,000 shUSDC → {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'no wallet'}
            </span>
            <button
              className="btn-primary btn-sm"
              onClick={() => mint('USDC')}
              disabled={!isConnected || isPending || minting === 'USDC'}
            >
              {minting === 'USDC' ? 'MINTING...' : done.includes('USDC') ? '✓ MINTED' : 'MINT'}
            </button>
          </div>
        </div>

        {/* shadeETH */}
        <div className="token-panel" style={{ marginBottom: '24px' }}>
          <div className="panel-label">shadeETH</div>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray)' }}>
              Mint 5 shETH → {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'no wallet'}
            </span>
            <button
              className="btn-primary btn-sm"
              onClick={() => mint('ETH')}
              disabled={!isConnected || isPending || minting === 'ETH'}
            >
              {minting === 'ETH' ? 'MINTING...' : done.includes('ETH') ? '✓ MINTED' : 'MINT'}
            </button>
          </div>
        </div>

        {/* Contract addresses */}
        <div className="section-rule" />
        <h3 className="section-heading">CONTRACT ADDRESSES</h3>
        <div className="info-grid">
          {[
            { label: 'shUSDC', addr: SHADE_USDC_ADDRESS },
            { label: 'shETH', addr: SHADE_ETH_ADDRESS },
          ].map(({ label, addr }) => (
            <div className="info-row" key={label}>
              <span className="info-label">{label}</span>
              <span className="info-value mono">
                <a
                  href={`https://sepolia.etherscan.io/address/${addr}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--yellow)', textDecoration: 'none' }}
                >
                  {addr.slice(0, 10)}...{addr.slice(-6)} ↗
                </a>
              </span>
            </div>
          ))}
        </div>

        {!isConnected && (
          <p className="connect-note" style={{ marginTop: '16px' }}>
            Connect wallet to mint tokens.
          </p>
        )}
      </div>
    </div>
  )
}
