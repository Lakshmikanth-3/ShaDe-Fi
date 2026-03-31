"use client"

import { useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { encrypt64, EncryptResult } from "@/lib/fhevm"

export interface EncryptionData {
  handle: `0x${string}`
  proof: `0x${string}`
}

export function useEncrypt() {
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>("")
  const { address } = useAccount()

  const encrypt = useCallback(async (
    value: bigint, 
    contractAddress: string,
    stepLabel?: string
  ): Promise<EncryptionData> => {
    if (!contractAddress) {
      throw new Error('[useEncrypt] contractAddress is REQUIRED')
    }
    
    if (!address) {
      throw new Error('[useEncrypt] User wallet not connected')
    }

    if (stepLabel) {
      setCurrentStep(stepLabel)
    }
    
    setIsEncrypting(true)
    
    try {
      const result: EncryptResult = await encrypt64(value, contractAddress, address)
      
      if (!result || !result.handle || !result.proof) {
        throw new Error('[useEncrypt] Encryption returned invalid result')
      }

      return {
        handle: result.handle,
        proof: result.proof,
      }
    } catch (error) {
      console.error('[useEncrypt] Encryption failed:', error)
      throw error
    } finally {
      setIsEncrypting(false)
      setCurrentStep("")
    }
  }, [address])

  return {
    isReady: !!address,
    encrypt,
    isEncrypting,
    currentStep,
  }
}
