'use client'

import { useState, useCallback } from 'react'
import { encrypt128 } from '@/lib/fhevm'

export function useEncrypt() {
  const [isEncrypting, setIsEncrypting] = useState(false)

  const encrypt = useCallback(async (value: bigint, contractAddress: string, userAddress: string) => {
    setIsEncrypting(true)
    try {
      const result = await encrypt128(value, contractAddress, userAddress)
      return result
    } finally {
      setIsEncrypting(false)
    }
  }, [])

  return { encrypt, isEncrypting }
}
