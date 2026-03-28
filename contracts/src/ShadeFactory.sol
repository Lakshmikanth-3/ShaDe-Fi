// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { ShadePool } from "./ShadePool.sol";

contract ShadeFactory is SepoliaZamaFHEVMConfig {

    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    event PoolCreated(address indexed tokenA, address indexed tokenB, address pool, uint256 totalPools);

    error PoolExists();
    error IdenticalTokens();
    error ZeroAddress();

    function createPool(address tokenA, address tokenB) external returns (address pool) {
        require(tokenA != tokenB);
        require(tokenA != address(0) && tokenB != address(0));

        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(getPool[token0][token1] == address(0));

        pool = address(new ShadePool(token0, token1));
        getPool[token0][token1] = pool;
        getPool[token1][token0] = pool;
        allPools.push(pool);

        emit PoolCreated(token0, token1, pool, allPools.length);
    }

    function totalPools() external view returns (uint256) {
        return allPools.length;
    }
}
