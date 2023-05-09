// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "account-abstraction/contracts/interfaces/IAccount.sol";
import "account-abstraction/contracts/interfaces/UserOperation.sol";

/**
 * Minimal smart wallet allowing an owner key to be swapped.
 * This implementation shows how a minimum viable smart wallet can be done, with as few external
 * dependencies as possible.
 */
contract KeySwapWallet is IAccount {
    using ECDSA for bytes32;

    address owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function swapKey(address newOwner) external {
        require(msg.sender == owner);

        owner = newOwner;
    }

    function _validateOwnerSignature(
        bytes calldata signature,
        bytes32 userOpHash
    ) internal view returns (bool) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
    
        return owner == hash.recover(signature);
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override returns (uint256 validationData) {
        address sender = UserOperationLib.getSender(userOp);

        require(_validateOwnerSignature(userOp.signature, userOpHash));
        require(sender == owner);
    }
}
