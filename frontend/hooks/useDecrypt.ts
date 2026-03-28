'use client'

import { useState, useCallback } from 'react'
import { decryptValue } from '@/lib/fhevm'

export function useDecrypt(handle: bigint | undefined) {
  const [value, setValue] = useState<bigint | undefined>(undefined)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const decrypt = useCallback(async () => {
    if (!handle) return
    setIsDecrypting(true)
    setError(null)
    try {
      const result = await decryptValue(handle)
      if (result !== null) {
        setValue(result)
      } else {
        setError('Decryption failed or fhEVM not available')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setIsDecrypting(false)
    }
  }, [handle])

  return { decrypt, value, isDecrypting, error }
}
