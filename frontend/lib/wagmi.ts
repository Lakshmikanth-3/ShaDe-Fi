import { createConfig, http } from 'wagmi'
import { sepolia } from 'viem/chains'
import { injected, metaMask } from 'wagmi/connectors'

// Use Infura instead of public rpc.sepolia.org (which is timing out)
const SEPOLIA_RPC = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950'

console.log('[WAGMI] Configuring with RPC:', SEPOLIA_RPC.slice(0, 40) + '...')
console.log('[WAGMI] Sepolia chain ID:', sepolia.id)

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC),
  },
})
