// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { TFHE, euint64, einput } from "fhevm/lib/TFHE.sol";
import { ShadeFactory } from "./ShadeFactory.sol";
import { ShadePool } from "./ShadePool.sol";

/**
 * @title ShadeRouter
 * @dev Dynamic Discovery and Execution Router for the SHADE confidential AMM.
 * Implements a strict separation of concerns to allow the frontend to safely 
 * discover, approve, and fund specific pools without approval race conditions.
 */
contract ShadeRouter is SepoliaZamaFHEVMConfig {

    ShadeFactory public immutable factory;

    constructor(address _factory) {
        factory = ShadeFactory(_factory);
    }

    /**
     * @notice Performs a confidential swap between two tokens.
     * @dev The Router acts as the orchestration layer for multi-hop swaps in later versions.
     * For single-pool swaps, it converts handles and authorizes the target pool.
     */
    function swap(
        address tokenIn,
        address tokenOut,
        einput encAmountIn,
        bytes calldata proofIn
    ) external returns (euint64 amountOut) {
        address poolAddr = factory.getPool(tokenIn, tokenOut);
        require(poolAddr != address(0), "Pool not found");
        
        euint64 amount = TFHE.asEuint64(encAmountIn, proofIn);
        TFHE.allow(amount, poolAddr);
        TFHE.allow(amount, msg.sender);
        
        return ShadePool(poolAddr).swap(tokenIn, amount);
    }

    /**
     * @notice Discovery/Deployment helper. Ensures a pool exists before funding.
     * @return pool The address of the discovered or freshly created pool.
     */
    function createPool(address tokenA, address tokenB) external returns (address pool) {
        pool = factory.getPool(tokenA, tokenB);
        if (pool == address(0)) {
            pool = factory.createPool(tokenA, tokenB);
        }
    }
}
