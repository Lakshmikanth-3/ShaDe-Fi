'use client'

// fhEVM client-side singleton using @zama-fhe/relayer-sdk
// with SepoliaConfig for Zama's hosted Sepolia testnet deployment.

type FhevmInstance = {
  createEncryptedInput: (contractAddress: string, userAddress: string) => {
    add128: (value: bigint) => void
    encrypt: () => Promise<{ handles: Uint8Array[]; inputProof: Uint8Array }>
  }
  decrypt: (handle: bigint) => Promise<bigint>
}

let fhevmInstance: FhevmInstance | null = null

export async function getFhevmInstance(): Promise<FhevmInstance | null> {
  // SSR guard
  if (typeof window === 'undefined') return null
  if (fhevmInstance) return fhevmInstance

  try {
    const { createInstance, SepoliaConfig, initSDK } = await import('@zama-fhe/relayer-sdk/web')

    // Initialize the SDK with WASM files copied to public/
    await initSDK({
      tfheParams: '/tfhe_bg.wasm',
      kmsParams: '/kms_lib_bg.wasm'
    })

    // Use SepoliaConfig with network URL added
    const instance = await createInstance({
      ...SepoliaConfig,
      network: process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-sepolia.public.blastapi.io',
    })
    fhevmInstance = instance as unknown as FhevmInstance
    return fhevmInstance
  } catch (e) {
    console.warn('[SHADE] fhEVM SDK unavailable:', e)
    return null
  }
}

import { toHex } from 'viem'

export async function encrypt128(
  value: bigint,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: `0x${string}`; proof: `0x${string}` } | null> {
  const instance = await getFhevmInstance()
  if (!instance) return null
  try {
    const input = instance.createEncryptedInput(contractAddress, userAddress)
    input.add128(value)
    const { handles, inputProof } = (await (input as any).encrypt()) as { handles: Uint8Array[]; inputProof: Uint8Array }
    
    return {
      handle: toHex(handles[0]),
      proof: toHex(inputProof),
    }
  } catch (e) {
    console.error('[SHADE] encrypt128 failed:', e)
    return null
  }
}

export async function decryptValue(handle: bigint): Promise<bigint | null> {
  const instance = await getFhevmInstance()
  if (!instance) return null
  try {
    return await instance.decrypt(handle)
  } catch (e) {
    console.error('[SHADE] decrypt failed:', e)
    return null
  }
}
