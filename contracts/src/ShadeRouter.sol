// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { TFHE, euint64, einput } from "fhevm/lib/TFHE.sol";
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
    ) external returns (euint64 amountOut) {
        address poolAddr = factory.getPool(tokenIn, tokenOut);
        require(poolAddr != address(0), "Pool not found");
        
        // Step 1: convert einput -> euint64 HERE in the router
        euint64 amount = TFHE.asEuint64(encAmountIn, proofIn);
        
        // Step 2: grant the pool permission to use this encrypted value
        TFHE.allow(amount, poolAddr);
        
        // Step 3: grant the caller (user) permission too
        TFHE.allow(amount, msg.sender);
        
        // Step 4: call pool with already-converted euint64
        return ShadePool(poolAddr).swap(tokenIn, amount);
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
