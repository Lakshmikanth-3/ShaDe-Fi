// Contract addresses — set via .env.local after deployment
export const FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
export const ROUTER_ADDRESS  = (process.env.NEXT_PUBLIC_ROUTER_ADDRESS  || '0x0000000000000000000000000000000000000000') as `0x${string}`
export const SHADE_USDC_ADDRESS = (process.env.NEXT_PUBLIC_SHADE_USDC_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
export const SHADE_ETH_ADDRESS  = (process.env.NEXT_PUBLIC_SHADE_ETH_ADDRESS  || '0x0000000000000000000000000000000000000000') as `0x${string}`

// Minimal ABIs for contract interaction
export const SHADE_POOL_ABI = [
  {
    name: 'swap',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'encAmountIn', type: 'bytes32' },
      { name: 'proofIn', type: 'bytes' },
    ],
    outputs: [{ name: 'amountOut', type: 'bytes32' }],
  },
  {
    name: 'addLiquidity',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'encAmountA', type: 'bytes32' },
      { name: 'proofA', type: 'bytes' },
      { name: 'encAmountB', type: 'bytes32' },
      { name: 'proofB', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    name: 'removeLiquidity',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'encShares', type: 'bytes32' },
      { name: 'proofShares', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    name: 'getEncryptedReserves',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'bytes32' },
      { name: '', type: 'bytes32' },
    ],
  },
  {
    name: 'getEncryptedLPShare',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'provider', type: 'address' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    name: 'tokenA',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'tokenB',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'Swap',
    type: 'event',
    inputs: [
      { name: 'sender', type: 'address', indexed: true },
      { name: 'tokenIn', type: 'address', indexed: false },
      { name: 'tokenOut', type: 'address', indexed: false },
    ],
  },
] as const

export const SHADE_FACTORY_ABI = [
  {
    name: 'getPool',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'totalPools',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'createPool',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
    ],
    outputs: [{ name: 'pool', type: 'address' }],
  },
] as const

export const SHADE_ROUTER_ABI = [
  {
    name: 'swap',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'encAmountIn', type: 'bytes32' },
      { name: 'proofIn', type: 'bytes' },
    ],
    outputs: [{ name: 'amountOut', type: 'bytes32' }],
  },
  {
    name: 'addLiquidity',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'encAmountA', type: 'bytes32' },
      { name: 'proofA', type: 'bytes' },
      { name: 'encAmountB', type: 'bytes32' },
      { name: 'proofB', type: 'bytes' },
    ],
    outputs: [],
  },
] as const

export const ERC20_ABI = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner',   type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount',  type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint64' },
    ],
    outputs: [],
  },
] as const

export const SHADE_TOKEN_ABI = [...ERC20_ABI] as const
