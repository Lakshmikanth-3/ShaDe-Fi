'use client'

import { useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'

const SEPOLIA_ID = 11155111

export function WrongNetworkBanner() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (isConnected && chainId !== SEPOLIA_ID) {
      console.log('[Network] Wrong network detected:', chainId, 'Switching to Sepolia...')
      switchChain({ chainId: SEPOLIA_ID })
    }
  }, [isConnected, chainId, switchChain])

  if (!isConnected) return null

  if (chainId !== SEPOLIA_ID) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        <div style={{
          background: '#1a1a1a',
          padding: '40px',
          borderRadius: '16px',
          border: '3px solid #ff4b4b',
          textAlign: 'center',
          maxWidth: '450px',
        }}>
          <h2 style={{ color: '#ff4b4b', marginBottom: '20px', fontSize: '24px' }}>⚠️ WRONG NETWORK</h2>
          <p style={{ color: '#fff', marginBottom: '20px', fontSize: '16px' }}>
            MetaMask is on <strong>Ethereum Mainnet</strong>.<br />
            You must switch to <strong>Sepolia Testnet</strong> to use this app.
          </p>
          <button
            onClick={() => switchChain({ chainId: SEPOLIA_ID })}
            style={{
              background: '#ff4b4b',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            SWITCH TO SEPOLIA
          </button>
        </div>
      </div>
    )
  }

  return null
}
