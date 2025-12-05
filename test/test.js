const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Escrow", function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  const deposit = ethers.utils.parseEther("1");

  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);

    const Escrow = await ethers.getContractFactory("Escrow");
    
    // ❗ Constructor now only takes (arbiter, beneficiary)
    contract = await Escrow.deploy(
      await arbiter.getAddress(),
      await beneficiary.getAddress(),
      { value: deposit }
    );

    await contract.deployed();
  });

  /* -------------------------------------------------------
   * 1.  Constructor & Initial State
   * ------------------------------------------------------ */
  it("should be funded initially", async function () {
    const balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.equal(deposit);
  });

  it("should set deadline to 60 minutes from deployment", async function () {
    const contractDeadline = await contract.deadline();
    const block = await ethers.provider.getBlock("latest");

    expect(contractDeadline).to.equal(block.timestamp + 3600);
  });

  /* -------------------------------------------------------
   * 2. Approval Logic
   * ------------------------------------------------------ */
  describe("after approval from an address other than the arbiter", () => {
    it("should revert", async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe("after approval from the arbiter", () => {
    it("should transfer balance to the beneficiary", async () => {
      const before = await ethers.provider.getBalance(await beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(await beneficiary.getAddress());
      expect(after.sub(before)).to.equal(deposit);
    });

    it("should mark contract as approved", async () => {
      await contract.connect(arbiter).approve();
      const approved = await contract.isApproved();
      expect(approved).to.equal(true);
    });
  });

  /* -------------------------------------------------------
   * 3. Refund Logic
   * ------------------------------------------------------ */
  it("should revert refund before deadline", async () => {
    await expect(contract.connect(depositor).refund()).to.be.revertedWith(
      "Deadline not passed"
    );
  });

  it("should refund depositor after deadline passes", async () => {
    // Forward time by 3601 seconds
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    const before = await ethers.provider.getBalance(await depositor.getAddress());
    const refundTxn = await contract.connect(depositor).refund();
    await refundTxn.wait();
    const after = await ethers.provider.getBalance(await depositor.getAddress());

    expect(after).to.be.gt(before);
  });

  /* -------------------------------------------------------
   * 4. Approve vs Refund: Mutual Exclusivity
   * ------------------------------------------------------ */
  it("should not allow refund after approval", async () => {
    await contract.connect(arbiter).approve();

    await expect(contract.connect(depositor).refund()).to.be.revertedWith(
      "Deadline not passed"
    );
  });

  it("should not allow approval after refund", async () => {
    // Move past deadline
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    await contract.connect(depositor).refund();

    await expect(contract.connect(arbiter).approve()).to.be.revertedWith(
      "Deadline passed"
    );
  });
});
