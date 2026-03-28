'use client'

import { useReadContract, useReadContracts } from 'wagmi'
import { FACTORY_ADDRESS, SHADE_USDC_ADDRESS, SHADE_ETH_ADDRESS, SHADE_FACTORY_ABI, SHADE_POOL_ABI } from '@/lib/contracts'

export function usePoolAddress() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: SHADE_FACTORY_ABI,
    functionName: 'getPool',
    args: [SHADE_USDC_ADDRESS, SHADE_ETH_ADDRESS],
  })
}

export function useTotalPools() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: SHADE_FACTORY_ABI,
    functionName: 'totalPools',
  })
}

export function useEncryptedReserves(poolAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: SHADE_POOL_ABI,
    functionName: 'getEncryptedReserves',
    query: { enabled: !!poolAddress },
  })
}

export function useEncryptedLPShare(poolAddress: `0x${string}` | undefined, provider: `0x${string}` | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: SHADE_POOL_ABI,
    functionName: 'getEncryptedLPShare',
    args: provider ? [provider] : undefined,
    query: { enabled: !!poolAddress && !!provider },
  })
}
