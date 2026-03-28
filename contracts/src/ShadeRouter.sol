// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { TFHE, euint128, einput } from "fhevm/lib/TFHE.sol";
import { ShadeFactory } from "./ShadeFactory.sol";
import { ShadePool } from "./ShadePool.sol";

contract ShadeRouter is SepoliaZamaFHEVMConfig {

    ShadeFactory public immutable factory;

    constructor(address _factory) {
        factory = ShadeFactory(_factory);
    }

    function swap(
        address tokenIn,
        address tokenOut,
        einput encAmountIn,
        bytes calldata proofIn
    ) external returns (euint128 amountOut) {
        address poolAddr = factory.getPool(tokenIn, tokenOut);
        require(poolAddr != address(0), "Pool not found");
        return ShadePool(poolAddr).swap(tokenIn, encAmountIn, proofIn);
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        einput encAmountA, bytes calldata proofA,
        einput encAmountB, bytes calldata proofB
    ) external {
        address poolAddr = factory.getPool(tokenA, tokenB);
        if (poolAddr == address(0)) {
            poolAddr = factory.createPool(tokenA, tokenB);
            ShadePool(poolAddr).initialize(encAmountA, proofA, encAmountB, proofB);
        } else {
            ShadePool(poolAddr).addLiquidity(encAmountA, proofA, encAmountB, proofB);
        }
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        einput encShares,
        bytes calldata proofShares
    ) external {
        address poolAddr = factory.getPool(tokenA, tokenB);
        require(poolAddr != address(0), "Pool not found");
        ShadePool(poolAddr).removeLiquidity(encShares, proofShares);
    }
}
