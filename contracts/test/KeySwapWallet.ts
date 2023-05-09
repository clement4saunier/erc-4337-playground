import { expect } from "chai";
import { UserOperation } from "account-abstraction/test/UserOperation";
import { ethers } from "hardhat";
import { fillAndSignUserOp } from "./UserOpUtils";

// interface UserOperation {
//     sender: typ.address
//     nonce: typ.uint256
//     initCode: typ.bytes
//     callData: typ.bytes
//     callGasLimit: typ.uint256
//     verificationGasLimit: typ.uint256
//     preVerificationGas: typ.uint256
//     maxFeePerGas: typ.uint256
//     maxPriorityFeePerGas: typ.uint256
//     paymasterAndData: typ.bytes
//     signature: typ.bytes
// }

describe("KeySwapWallet", function() {
  async function deployWalletAndContext(ownerAddress) {
    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    const entryPoint = await EntryPoint.deploy();

    const Wallet = await ethers.getContractFactory("KeySwapWallet");
    const wallet = await Wallet.deploy(ownerAddress, entryPoint.address);

    return { wallet, entryPoint };
  }

  describe("Deployment", function() {
    it("Should set the right owner & entryPoint", async function() {
      const [owner] = await ethers.getSigners();
      const { wallet, entryPoint } = await deployWalletAndContext(owner.address);

      expect(await wallet.owner()).to.equal(owner.address);
      expect(await wallet.entryPoint()).to.equal(entryPoint.address);
    });
  });

  describe("UserOperation Handling", function() {
    it("Should receive and validate UserOperation", async function() {
      const [owner, alt] = await ethers.getSigners();
      const { wallet, entryPoint } = await deployWalletAndContext(owner.address);
      const swapOwnerCall = wallet.interface.encodeFunctionData("swapKey", [alt.address]);

      const userOp = await fillAndSignUserOp({
        sender: wallet.address,
        callData: swapOwnerCall
      }, owner, entryPoint.address);

      console.log("before owner?", await wallet.owner());
      const txn = await entryPoint.handleOps([userOp], owner.address);
      console.log("owner?", await wallet.owner());
      

      expect(await wallet.owner()).to.equal(alt.address);
    });
  });
});
