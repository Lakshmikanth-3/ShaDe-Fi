import { parseAbi } from 'viem'

export const DEV_MODE = false // Real implementation mode

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

// Real Sepolia fhEVM Contract Addresses
const REAL_FACTORY_ADDRESS: `0x${string}` = '0x2e72DB6D15186caea378C623CEb8A82221564969'
const REAL_ROUTER_ADDRESS: `0x${string}` = '0x9f99E9E0b264D6344c656b9aC9B604d9f319375e'
const REAL_SHADE_USDC_ADDRESS: `0x${string}` = '0x246dC774887A4BD70e5B0A9A92E8b0065ba854aD'
const REAL_SHADE_ETH_ADDRESS: `0x${string}` = '0x0c16DE61e9cAFD9fCB5DF1cd468c5FEA04E12910'
const REAL_POOL_ADDRESS: `0x${string}` = '0xd0d50cD3c074457770e62828A9509256abB3E48f'

// Zama fhEVM Sepolia Infrastructure
export const SEPOLIA_FHEVM_GATEWAY_URL = 'https://fhevm-gateway.zama.ai'
export const SEPOLIA_KMS_CONTRACT_ADDRESS: `0x${string}` = '0x9D6891A6240D6130c54ae243d8005063D05fE14b'
export const SEPOLIA_ACL_CONTRACT_ADDRESS: `0x${string}` = '0xFee8407e2f5e3Ee68ad77cAE98c434e637f516EC'

// Helper to get address from deployed environment configuration
const getAddress = (envVar: string, deployedAddress: `0x${string}`): `0x${string}` => {
  const envVal = process.env[envVar] as `0x${string}` | undefined
  if (envVal && envVal !== ZERO_ADDR) {
    return envVal
  }
  return deployedAddress
}

// Export getter functions — binding directly to production deployments
export const getFactoryAddress = (): `0x${string}` => 
  getAddress('NEXT_PUBLIC_FACTORY_ADDRESS', REAL_FACTORY_ADDRESS)
export const getRouterAddress = (): `0x${string}` => 
  getAddress('NEXT_PUBLIC_ROUTER_ADDRESS', REAL_ROUTER_ADDRESS)
export const getShadeUsdcAddress = (): `0x${string}` => 
  getAddress('NEXT_PUBLIC_SHADE_USDC_ADDRESS', REAL_SHADE_USDC_ADDRESS)
export const getShadeEthAddress = (): `0x${string}` => 
  getAddress('NEXT_PUBLIC_SHADE_ETH_ADDRESS', REAL_SHADE_ETH_ADDRESS)
export const getKnownPoolAddress = (): `0x${string}` =>
  getAddress('NEXT_PUBLIC_POOL_ADDRESS', REAL_POOL_ADDRESS)

export const getAddressForToken = (symbol: string): `0x${string}` => {
  if (symbol === 'USDC') return getShadeUsdcAddress()
  if (symbol === 'ETH' || symbol === 'WETH') return getShadeEthAddress()
  return ZERO_ADDR as `0x${string}`
}

export const ERC20_ABI = parseAbi([
  "function approve(address spender, uint64 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint64)",
  "function balanceOf(address account) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
])

export const SHADE_POOL_ABI = parseAbi([
  "function addLiquidity(bytes32 encAmountA, bytes calldata proofA, bytes32 encAmountB, bytes calldata proofB)",
  "function swap(address tokenIn, bytes32 encAmountIn, bytes calldata proofIn)",
  "function getEncryptedReserves() view returns (bytes32, bytes32)",
  "function lpShares(address) view returns (bytes32)",
])

export const SHADE_ROUTER_ABI = parseAbi([
  "function swap(address tokenIn, address tokenOut, bytes32 encAmountIn, bytes calldata proofIn)",
  "function addLiquidity(address tokenA, address tokenB, bytes32 encAmountA, bytes calldata proofA, bytes32 encAmountB, bytes calldata proofB)"
])

export const SHADE_FACTORY_ABI = parseAbi([
  "function getPool(address tokenA, address tokenB) view returns (address)",
  "function totalPools() view returns (uint256)",
  "function createPool(address tokenA, address tokenB) returns (address)"
])
