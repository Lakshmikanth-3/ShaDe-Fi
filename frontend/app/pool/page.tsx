import type { Metadata } from 'next'
import { PoolManager } from '@/components/pool/PoolManager'

export const metadata: Metadata = {
  title: 'Pool — ShaDe-Fi Confidential AMM',
  description: 'Add or remove liquidity from ShaDe-Fi encrypted pools. Your LP position remains fully confidential.',
}

export default function PoolPage() {
  return (
    <div className="pool-page">
      <PoolManager />
    </div>
  )
}
