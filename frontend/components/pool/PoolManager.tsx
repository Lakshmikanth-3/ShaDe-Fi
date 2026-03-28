'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { ROUTER_ADDRESS, SHADE_USDC_ADDRESS, SHADE_ETH_ADDRESS, SHADE_ROUTER_ABI } from '@/lib/contracts'
import { useEncrypt } from '@/hooks/useEncrypt'
import { usePoolAddress, useTotalPools } from '@/hooks/useShadePool'
import { EncryptedValue } from '@/components/ui/EncryptedValue'

type Tab = 'add' | 'remove'

export function PoolManager() {
  const { isConnected, address } = useAccount()
  const { encrypt, isEncrypting } = useEncrypt()
  const { writeContract, isPending } = useWriteContract()
  const { data: poolAddress } = usePoolAddress()
  const { data: totalPools } = useTotalPools()

  const [activeTab, setActiveTab] = useState<Tab>('add')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [removeShares, setRemoveShares] = useState('')

  const shortPool = poolAddress
    ? `${(poolAddress as string).slice(0, 6)}...${(poolAddress as string).slice(-4)}`
    : '—'

  const handleAddLiquidity = async () => {
    if (!isConnected || !amountA || !amountB) return
    const valA = BigInt(Math.floor(parseFloat(amountA) * 1e6))
    const valB = BigInt(Math.floor(parseFloat(amountB) * 1e18))
    const encA = await encrypt(valA)
    const encB = await encrypt(valB)
    if (!encA || !encB) return

    writeContract({
      address: ROUTER_ADDRESS,
      abi: SHADE_ROUTER_ABI,
      functionName: 'addLiquidity',
      args: [
        SHADE_USDC_ADDRESS,
        SHADE_ETH_ADDRESS,
        encA.handle as unknown as `0x${string}`,
        encA.proof as unknown as `0x${string}`,
        encB.handle as unknown as `0x${string}`,
        encB.proof as unknown as `0x${string}`,
      ],
    })
  }

  return (
    <div className="pool-card">
      {/* Tabs */}
      <div className="tab-row">
        <button
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          ADD LIQUIDITY
        </button>
        <button
          className={`tab-btn ${activeTab === 'remove' ? 'active' : ''}`}
          onClick={() => setActiveTab('remove')}
        >
          REMOVE LIQUIDITY
        </button>
      </div>

      {activeTab === 'add' && (
        <>
          <h2 className="section-title">ADD LIQUIDITY</h2>
          <div className="section-rule" />

          <div className="dual-input-row">
            <div className="token-panel">
              <div className="panel-label">TOKEN A</div>
              <select className="token-select">
                <option>shadeUSDC ▼</option>
              </select>
              <input
                className="amount-input"
                type="number"
                placeholder="0"
                value={amountA}
                onChange={e => setAmountA(e.target.value)}
              />
              <div className="balance-row">Balance: <span className="enc-tag">[encrypted]</span></div>
            </div>

            <div className="token-panel">
              <div className="panel-label">TOKEN B</div>
              <select className="token-select">
                <option>shadeETH ▼</option>
              </select>
              <input
                className="amount-input"
                type="number"
                placeholder="0"
                value={amountB}
                onChange={e => setAmountB(e.target.value)}
              />
              <div className="balance-row">Balance: <span className="enc-tag">[encrypted]</span></div>
            </div>
          </div>

          <button
            className="btn-primary btn-full"
            onClick={handleAddLiquidity}
            disabled={!isConnected || isPending || isEncrypting}
          >
            {isPending || isEncrypting ? 'ENCRYPTING...' : 'ADD LIQUIDITY'}
          </button>
        </>
      )}

      {activeTab === 'remove' && (
        <>
          <h2 className="section-title">REMOVE LIQUIDITY</h2>
          <div className="section-rule" />
          <div className="token-panel">
            <div className="panel-label">LP SHARES TO BURN</div>
            <input
              className="amount-input"
              type="number"
              placeholder="0"
              value={removeShares}
              onChange={e => setRemoveShares(e.target.value)}
            />
          </div>
          <button
            className="btn-primary btn-full"
            disabled={!isConnected || isPending || !removeShares}
          >
            REMOVE LIQUIDITY
          </button>
        </>
      )}

      {/* Your Position */}
      <div className="section-rule" style={{ marginTop: '2rem' }} />
      <h3 className="section-heading">YOUR POSITION</h3>
      <div className="info-grid">
        <div className="info-row">
          <span className="info-label">LP shares</span>
          <span><EncryptedValue showDecryptButton={true} /> </span>
        </div>
        <div className="info-row">
          <span className="info-label">Pool share %</span>
          <span className="enc-tag">[encrypted]</span>
        </div>
        <div className="info-row">
          <span className="info-label">shUSDC claimable</span>
          <span><EncryptedValue showDecryptButton={true} /></span>
        </div>
        <div className="info-row">
          <span className="info-label">shETH claimable</span>
          <span><EncryptedValue showDecryptButton={true} /></span>
        </div>
      </div>

      {/* Pool Info */}
      <div className="section-rule" />
      <h3 className="section-heading">POOL INFO</h3>
      <div className="info-grid">
        <div className="info-row">
          <span className="info-label">Total pools</span>
          <span className="info-value">{totalPools?.toString() ?? '—'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Pool address</span>
          <span className="info-value mono">{shortPool}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Reserve A</span>
          <span className="enc-tag">[encrypted]</span>
        </div>
        <div className="info-row">
          <span className="info-label">Reserve B</span>
          <span className="enc-tag">[encrypted]</span>
        </div>
      </div>
    </div>
  )
}
