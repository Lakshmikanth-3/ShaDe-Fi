// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { ConfidentialERC20 } from "fhevm-contracts/contracts/token/ERC20/ConfidentialERC20.sol";

/**
 * @title ShadeToken
 * @notice Test tokens for SHADE pools (shadeUSDC / shadeETH).
 *         Deploy two instances and use them to seed the demo pool.
 */
contract ShadeToken is SepoliaZamaFHEVMConfig, ConfidentialERC20 {

    address public owner;

    constructor(string memory name, string memory symbol) ConfidentialERC20(name, symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function mint(address to, uint64 amount) external onlyOwner {
        _unsafeMint(to, amount);
    }
}
