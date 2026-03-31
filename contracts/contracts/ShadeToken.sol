// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { ConfidentialERC20 } from "fhevm-contracts/contracts/token/ERC20/ConfidentialERC20.sol";

/**
 * @title ShadeToken
 * @notice Confidential ERC20 token for SHADE pools.
 */
contract ShadeToken is SepoliaZamaFHEVMConfig, ConfidentialERC20 {

    address public owner;
    uint8 private _decimals;

    // Use a conservative FAUCET_AMOUNT that fits in uint64 (~1.8e19)
    // 10 units with 18 decimals = 10 * 10^18 = 1e19 (Safe)
    uint256 public constant FAUCET_AMOUNT = 10 * 10**18;
    uint256 public constant COOLDOWN = 24 hours;
    mapping(address => uint256) public lastClaim;

    constructor(string memory _name, string memory _symbol, uint8 decimals_) ConfidentialERC20(_name, _symbol) {
        owner = msg.sender;
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function faucet() external {
        require(block.timestamp > lastClaim[msg.sender] + COOLDOWN, "Cooldown active");
        lastClaim[msg.sender] = block.timestamp;
        
        // Use _mint from ConfidentialERC20. It handles the euint64 conversion internally if provided as uint256.
        // Or manually ensure safe uint64 cast.
        _mint(msg.sender, uint64(FAUCET_AMOUNT));
    }

    function mint(address to, uint256 amount) external {
        _unsafeMint(to, uint64(amount));
    }
}
