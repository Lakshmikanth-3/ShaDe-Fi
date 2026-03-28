'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { maxUint256 } from 'viem'
import { 
  FACTORY_ADDRESS, 
  SHADE_USDC_ADDRESS, 
  SHADE_ETH_ADDRESS, 
  SHADE_FACTORY_ABI,
  SHADE_POOL_ABI,
  ERC20_ABI
} from '@/lib/contracts'
import { useEncrypt } from '@/hooks/useEncrypt'
import { EncryptedValue } from '@/components/ui/EncryptedValue'

const TOKENS = [
  { symbol: 'shadeUSDC', address: SHADE_USDC_ADDRESS, label: 'shUSDC' },
  { symbol: 'shadeETH', address: SHADE_ETH_ADDRESS, label: 'shETH' },
]

const SEPOLIA_ID = 11155111

type SwapStep = 'idle' | 'approving' | 'approved' | 'encrypting' | 'swapping' | 'done' | 'error'

export function SwapBox() {
  const { address: userAddress, isConnected } = useAccount()
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { encrypt, isEncrypting } = useEncrypt()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [tokenInIdx, setTokenInIdx] = useState(0)
  const [amountIn, setAmountIn] = useState('')
  const [swapResult, setSwapResult] = useState<bigint | undefined>(undefined)
  const [step, setStep] = useState<SwapStep>('idle')

  const tokenIn  = TOKENS[tokenInIdx]
  const tokenOut = TOKENS[tokenInIdx === 0 ? 1 : 0]
  const parsedAmount = amountIn ? BigInt(Math.floor(parseFloat(amountIn) * 1e6)) : 0n

  const isWrongChain = isConnected && currentChainId !== SEPOLIA_ID

  // 1. Get Pool Address
  const { data: poolAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: SHADE_FACTORY_ABI,
    functionName: 'getPool',
    args: [tokenIn.address, tokenOut.address],
    query: { enabled: !!tokenIn.address && !!tokenOut.address }
  })

  // 2. Refresh Allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress && poolAddress ? [userAddress, (poolAddress as `0x${string}`)] : undefined,
    query: { enabled: !!userAddress && !!poolAddress }
  })

  const needsApproval = allowance !== undefined && allowance < parsedAmount

  // 3. Contracts
  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { isSuccess: txConfirmed, isError: txFailed } = useWaitForTransactionReceipt({ hash: txHash })

  // 4. Listeners
  useEffect(() => {
    if (txConfirmed) {
      if (step === 'approving') {
        setStep('approved')
        refetchAllowance()
      } else if (step === 'swapping') {
        setStep('done')
      }
    }
    if (txFailed) {
      setStep('error')
    }
  }, [txConfirmed, txFailed, step, refetchAllowance])

  const handleFlip = () => {
    setTokenInIdx(i => (i === 0 ? 1 : 0))
    setAmountIn('')
    setStep('idle')
    setSwapResult(undefined)
  }

  const handleAction = async () => {
    if (isWrongChain) {
      switchChain({ chainId: SEPOLIA_ID })
      return
    }

    if (!isConnected || !amountIn || !userAddress || !poolAddress) return

    if (needsApproval) {
      setStep('approving')
      writeContract({
        address: tokenIn.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [poolAddress as `0x${string}`, maxUint256],
      })
      return
    }

    setStep('encrypting')
    const enc = await encrypt(parsedAmount, (poolAddress as `0x${string}`), userAddress)
    if (!enc) {
      setStep('error')
      return
    }

    setStep('swapping')
    writeContract(
      {
        address: (poolAddress as `0x${string}`),
        abi: SHADE_POOL_ABI,
        functionName: 'swap',
        args: [
          tokenIn.address,
          enc.handle as unknown as `0x${string}`,
          enc.proof as unknown as `0x${string}`,
        ],
      },
      {
        onSuccess(data) {
          setSwapResult(BigInt(data as unknown as string))
        },
        onError() {
          setStep('error')
        }
      }
    )
  }

  if (!mounted) return null

  const getButtonLabel = () => {
    if (isWrongChain) return 'SWITCH TO SEPOLIA'
    if (step === 'approving') return 'APPROVING...'
    if (step === 'approved') return 'APPROVED! SWAP?'
    if (step === 'encrypting') return 'ENCRYPTING...'
    if (step === 'swapping') return 'SWAPPING...'
    if (step === 'done') return '✓ SUCCESS'
    if (isPending) return 'PENDING...'
    if (step === 'error') return 'RETRY SWAP'
    return needsApproval ? 'APPROVE TKN' : 'SWAP'
  }

  return (
    <div className="swap-card">
      <h1 className="swap-title">SWAP</h1>

      {isWrongChain && (
        <div className="network-warning" style={{ color: '#ffd700', fontSize: '0.8rem', padding: '10px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', marginBottom: '1rem', border: '1px solid currentColor', textAlign: 'center' }}>
          Wrong Network: Please switch to Sepolia
        </div>
      )}

      {/* YOU PAY */}
      <div className="token-panel">
        <div className="panel-label">YOU PAY</div>
        <div className="panel-rule" />
        <div className="panel-row">
          <select
            className="token-select"
            value={tokenInIdx}
            onChange={e => { setTokenInIdx(Number(e.target.value)); setStep('idle'); }}
          >
            <option value={0}>{TOKENS[0].symbol}</option>
            <option value={1}>{TOKENS[1].symbol}</option>
          </select>
          <input
            className="amount-input"
            type="number"
            placeholder="0"
            value={amountIn}
            onChange={e => { setAmountIn(e.target.value); setStep('idle'); }}
            disabled={step !== 'idle' && step !== 'approved' && step !== 'error'}
          />
        </div>
        <div className="balance-row">
          Balance: <span className="enc-tag">[encrypted]</span>
        </div>
      </div>

      {/* Direction toggle */}
      <div className="flip-row">
        <button className="btn-flip" onClick={handleFlip} title="Flip tokens">⇅</button>
      </div>

      {/* YOU RECEIVE */}
      <div className="token-panel">
        <div className="panel-label">YOU RECEIVE</div>
        <div className="panel-rule" />
        <div className="panel-row">
          <span className="token-badge">{tokenOut.symbol}</span>
          <span className="enc-tag receive-enc">
            {step === 'done' ? (
              <EncryptedValue handle={swapResult} showDecryptButton={true} />
            ) : (
              '[encrypted]'
            )}
          </span>
        </div>
        <div className="balance-row">
          Balance: <span className="enc-tag">[encrypted]</span>
        </div>
      </div>

      {/* Stats */}
      <div className="swap-stats">
        <div className="stat-row">
          <span className="stat-label">Route</span>
          <span className="stat-value">{tokenIn.symbol} → {tokenOut.symbol}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Fee</span>
          <span className="stat-value">0.30%</span>
        </div>
      </div>

      {/* CTA */}
      <button
        className={`btn-primary btn-full ${isWrongChain ? 'btn-warn' : ''}`}
        onClick={handleAction}
        disabled={!isConnected || isPending || isEncrypting || !amountIn || (step !== 'idle' && step !== 'approved' && step !== 'error' && !needsApproval && !isWrongChain)}
      >
        {getButtonLabel()}
      </button>

      {step === 'done' && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p className="decrypt-note">Click <span className="enc-tag">[Decrypt →]</span> above to reveal amount.</p>
          <a 
            href={`https://explorer.zama.ai/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="explorer-link"
            style={{ fontSize: '0.7rem', color: 'var(--primary)', opacity: 0.8, textDecoration: 'underline' }}
          >
            View on Zama Explorer ↗
          </a>
        </div>
      )}

      {step === 'error' && (
        <p className="error-note" style={{ color: '#ff4b4b', textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
          Transaction failed or rejected.
        </p>
      )}

      {!isConnected && (
        <p className="connect-note">Connect your wallet to swap.</p>
      )}
    </div>
  )
}
