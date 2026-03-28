import type { Metadata } from 'next'
import { SwapBox } from '@/components/swap/SwapBox'

export const metadata: Metadata = {
  title: 'Swap — ShaDe-Fi Confidential AMM',
  description: 'Execute confidential token swaps with fully encrypted amounts. MEV is structurally impossible on ShaDe-Fi.',
}

export default function SwapPage() {
  return (
    <div className="swap-page">
      <SwapBox />
    </div>
  )
}
