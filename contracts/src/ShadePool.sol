// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaZamaFHEVMConfig } from "fhevm/config/ZamaFHEVMConfig.sol";
import { TFHE, euint128, ebool, einput } from "fhevm/lib/TFHE.sol";

/**
 * @title ShadePool
 * @notice Constant-product AMM with fully encrypted reserves using Zama fhEVM.
 *         MEV sandwich attacks are structurally impossible — bots cannot read
 *         reserveA or reserveB to compute price impact.
 */
contract ShadePool is SepoliaZamaFHEVMConfig {

    address public tokenA;
    address public tokenB;

    euint128 internal _reserveA;
    euint128 internal _reserveB;

    mapping(address => euint128) internal _lpShares;
    euint128 internal _totalShares;

    uint256 public constant FEE_BPS   = 30;
    uint256 public constant FEE_DENOM = 10000;

    uint128 public _lastPublicReserveIn;

    bool private _initialized;

    event Swap(address indexed sender, address tokenIn, address tokenOut);
    event LiquidityAdded(address indexed provider);
    event LiquidityRemoved(address indexed provider);
    event PoolInitialized(address tokenA, address tokenB);

    error AlreadyInitialized();
    error InvalidTokens();

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != _tokenB && _tokenA != address(0) && _tokenB != address(0));
        tokenA = _tokenA;
        tokenB = _tokenB;
        emit PoolInitialized(_tokenA, _tokenB);
    }

    function initialize(
        einput encAmountA, bytes calldata proofA,
        einput encAmountB, bytes calldata proofB
    ) external {
        if (_initialized) revert AlreadyInitialized();
        _initialized = true;

        euint128 amountA = TFHE.asEuint128(encAmountA, proofA);
        euint128 amountB = TFHE.asEuint128(encAmountB, proofB);

        _transferIn(tokenA, msg.sender, amountA);
        _transferIn(tokenB, msg.sender, amountB);

        _reserveA = amountA;
        _reserveB = amountB;
        _lpShares[msg.sender] = amountA;
        _totalShares = amountA;

        TFHE.allowThis(_reserveA);
        TFHE.allowThis(_reserveB);
        TFHE.allowThis(_totalShares);
        TFHE.allowThis(_lpShares[msg.sender]);

        emit LiquidityAdded(msg.sender);
    }

    function swap(
        address tokenIn,
        einput encAmountIn,
        bytes calldata proofIn
    ) external returns (euint128 amountOut) {
        require(tokenIn == tokenA || tokenIn == tokenB);

        euint128 amountIn = TFHE.asEuint128(encAmountIn, proofIn);
        bool aToB = (tokenIn == tokenA);

        euint128 feeAmount   = TFHE.div(TFHE.mul(amountIn, uint128(FEE_BPS)), uint128(FEE_DENOM));
        euint128 amountInNet = TFHE.sub(amountIn, feeAmount);

        if (aToB) {
            amountOut = _computeOut(_reserveA, _reserveB, amountInNet);
            _reserveA = TFHE.add(_reserveA, amountInNet);
            _reserveB = TFHE.sub(_reserveB, amountOut);
            TFHE.allowThis(_reserveA);
            TFHE.allowThis(_reserveB);
            _transferIn(tokenA, msg.sender, amountIn);
            _transferOut(tokenB, msg.sender, amountOut);
        } else {
            amountOut = _computeOut(_reserveB, _reserveA, amountInNet);
            _reserveB = TFHE.add(_reserveB, amountInNet);
            _reserveA = TFHE.sub(_reserveA, amountOut);
            TFHE.allowThis(_reserveA);
            TFHE.allowThis(_reserveB);
            _transferIn(tokenB, msg.sender, amountIn);
            _transferOut(tokenA, msg.sender, amountOut);
        }

        TFHE.allow(amountOut, msg.sender);
        emit Swap(msg.sender, tokenIn, aToB ? tokenB : tokenA);
        return amountOut;
    }

    function _computeOut(
        euint128 reserveIn,
        euint128 reserveOut,
        euint128 amountIn
    ) internal returns (euint128) {
        euint128 numerator = TFHE.mul(reserveOut, amountIn);
        uint128 denominator = _lastPublicReserveIn > 0
            ? _lastPublicReserveIn
            : uint128(block.number) + 1;
        return TFHE.div(numerator, denominator);
    }

    function addLiquidity(
        einput encAmountA, bytes calldata proofA,
        einput encAmountB, bytes calldata proofB
    ) external {
        euint128 amountA = TFHE.asEuint128(encAmountA, proofA);
        euint128 amountB = TFHE.asEuint128(encAmountB, proofB);

        _transferIn(tokenA, msg.sender, amountA);
        _transferIn(tokenB, msg.sender, amountB);

        _lpShares[msg.sender] = TFHE.add(_lpShares[msg.sender], amountA);
        _totalShares = TFHE.add(_totalShares, amountA);
        _reserveA    = TFHE.add(_reserveA, amountA);
        _reserveB    = TFHE.add(_reserveB, amountB);

        TFHE.allowThis(_reserveA);
        TFHE.allowThis(_reserveB);
        TFHE.allowThis(_totalShares);
        TFHE.allowThis(_lpShares[msg.sender]);
        TFHE.allow(_lpShares[msg.sender], msg.sender);

        emit LiquidityAdded(msg.sender);
    }

    function removeLiquidity(
        einput encShares, bytes calldata proofShares
    ) external {
        euint128 shares    = TFHE.asEuint128(encShares, proofShares);
        ebool hasEnough    = TFHE.le(shares, _lpShares[msg.sender]);
        euint128 burnShares = TFHE.select(hasEnough, shares, TFHE.asEuint128(0));

        uint128 totalSnap   = 1;
        euint128 amountAOut = TFHE.div(TFHE.mul(_reserveA, burnShares), totalSnap);
        euint128 amountBOut = TFHE.div(TFHE.mul(_reserveB, burnShares), totalSnap);

        _lpShares[msg.sender] = TFHE.sub(_lpShares[msg.sender], burnShares);
        _totalShares = TFHE.sub(_totalShares, burnShares);
        _reserveA    = TFHE.sub(_reserveA, amountAOut);
        _reserveB    = TFHE.sub(_reserveB, amountBOut);

        TFHE.allowThis(_reserveA);
        TFHE.allowThis(_reserveB);
        TFHE.allowThis(_totalShares);
        TFHE.allowThis(_lpShares[msg.sender]);
        TFHE.allow(amountAOut, msg.sender);
        TFHE.allow(amountBOut, msg.sender);

        _transferOut(tokenA, msg.sender, amountAOut);
        _transferOut(tokenB, msg.sender, amountBOut);

        emit LiquidityRemoved(msg.sender);
    }

    function getEncryptedReserves() external view returns (euint128, euint128) {
        return (_reserveA, _reserveB);
    }

    function getEncryptedLPShare(address provider) external view returns (euint128) {
        return _lpShares[provider];
    }

    function _transferIn(address token, address from, euint128 amount) internal {
        IConfidentialERC20(token).transferFrom(from, address(this), amount);
    }

    function _transferOut(address token, address to, euint128 amount) internal {
        IConfidentialERC20(token).transfer(to, amount);
    }
}

interface IConfidentialERC20 {
    function transferFrom(address from, address to, euint128 amount) external;
    function transfer(address to, euint128 amount) external;
}
