// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "account-abstraction/contracts/core/BaseAccount.sol";
import "account-abstraction/contracts/interfaces/UserOperation.sol";
import "hardhat/console.sol";

/**
 * Minimal smart wallet allowing an owner key to be swapped.
 * This implementation shows how a minimum viable smart wallet can be done, with as few external
 * dependencies as possible.
 */
contract KeySwapWallet is BaseAccount {
    using ECDSA for bytes32;

    address public owner;
    IEntryPoint private immutable _entryPoint;

    constructor(address _owner, IEntryPoint _entryPointSingleton) {
        owner = _owner;
        _entryPoint = _entryPointSingleton;
    }

    // Allows BaseAccount to call entryPoint
    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }

    // Swaps the owner key
    function swapKey(address newOwner) external {
        // require(msg.sender == owner, "Not owner");
        console.log("???");

        owner = newOwner;
    }

    // Validation logic, here if owner is signer of userOperation.
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();

        if (owner != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        return 0;
    }
}
