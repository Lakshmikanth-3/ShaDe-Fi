// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { ConfidentialERC20 } from "fhevm-contracts/contracts/token/ERC20/ConfidentialERC20.sol";

/**
 * @title ShadeToken
 * @notice Production-ready Confidential ERC20 for SHADE.
 */
contract ShadeToken is SepoliaZamaFHEVMConfig, ConfidentialERC20 {

    address public immutable owner;
    uint8 private immutable _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ConfidentialERC20(name_, symbol_) {
        owner = msg.sender;
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external {
        _unsafeMint(to, uint64(amount));
    }
}
