import { expect } from "chai";
import { UserOperation } from "account-abstraction/test/UserOperation";
import { ethers } from "hardhat";
import { fillAndSignUserOp, getUserOpHash } from "./UserOpUtils";
import { arrayify, parseEther } from "ethers/lib/utils";

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

describe("KeySwapWallet", function () {
  async function deployWalletAndContext(ownerAddress: string) {
    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    const entryPoint = await EntryPoint.deploy();

    const Wallet = await ethers.getContractFactory("KeySwapWallet");
    const wallet = await Wallet.deploy(ownerAddress, entryPoint.address);

    return { wallet, entryPoint };
  }

  describe("Deployment", function () {
    it("Should set the right owner & entryPoint", async function () {
      const [owner] = await ethers.getSigners();
      const { wallet, entryPoint } = await deployWalletAndContext(owner.address);

      expect(await wallet.owner()).to.equal(owner.address);
      expect(await wallet.entryPoint()).to.equal(entryPoint.address);
    });
  });

  describe("Direct Handling", function () {
    it("Should be able to execute function from smart wallet directly", async function () {
      const [owner, alt] = await ethers.getSigners();
      const { wallet, entryPoint } = await deployWalletAndContext(owner.address);
      const swapOwnerCall = wallet.interface.encodeFunctionData("swapKey", [alt.address]);

      expect(await wallet.owner()).to.equal(owner.address);

      await wallet.execute(wallet.address, 0, swapOwnerCall);

      expect(await wallet.owner()).to.equal(alt.address);
    });
  });

  describe("UserOperation Handling", function () {
    it("Should execute trough UserOperation", async function () {
      const [owner, alt] = await ethers.getSigners();
      const { wallet, entryPoint } = await deployWalletAndContext(owner.address);
      const chainId = await ethers.provider.getNetwork().then(net => net.chainId);

      const swapOwnerCall = wallet.interface.encodeFunctionData("swapKey", [alt.address]);
      const executeSwapCall = wallet.interface.encodeFunctionData("execute", [
        wallet.address,
        0,
        swapOwnerCall
      ]);

      const userOp = await fillAndSignUserOp(
        {
          sender: wallet.address,
          callData: executeSwapCall
        },
        owner,
        entryPoint.address
      );

      await entryPoint.connect(alt).handleOps([userOp], owner.address);

      expect(await wallet.owner()).to.equal(alt.address);
    });
  });
});
