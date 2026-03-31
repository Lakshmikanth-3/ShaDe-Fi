"use client"

import { useReadContract } from 'wagmi'
import { FACTORY_ADDRESS } from '@/lib/constants'

// Simplified ABI for FH_EVM AMM
const SHADE_FACTORY_ABI = [
  {
    name: 'allPools',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  {
     name: 'totalPools',
     type: 'function',
     stateMutability: 'view',
     inputs: [],
     outputs: [{ type: 'uint256' }],
  }
] as const

export function useShadeFactory() {
  const { data: poolCount, isLoading: isCountLoading } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: SHADE_FACTORY_ABI,
    functionName: 'totalPools',
  })

  return {
    poolCount: poolCount?.toString() || '0',
    isLoading: isCountLoading,
  }
}

// Additional hooks for ShadePool (encrypted reserves) would go here
// They would use fhevm.decrypt() after a successful read
