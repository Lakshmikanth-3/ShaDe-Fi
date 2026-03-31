import { getFactoryAddress, getRouterAddress, getShadeUsdcAddress, getShadeEthAddress, getKnownPoolAddress } from './contracts'

export const FACTORY_ADDRESS = getFactoryAddress()
export const ROUTER_ADDRESS = getRouterAddress()

export const TOKENS = {
  USDC: getShadeUsdcAddress(),
  WETH: getShadeEthAddress(),
  ETH: getShadeEthAddress(),
}

export const POOLS = [
  { pair: "WETH / USDC", address: getKnownPoolAddress() },
]

export const RPC_URL = "https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950"
export const CHAIN_ID = 11155111
