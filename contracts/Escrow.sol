// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    bool public isApproved;
    bool public isRefunded;

    uint256 public deadline;

    event Approved(uint256 amount);
    event Refunded(uint256 amount);
    event DeadlineSet(uint256 deadline);

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        deadline = block.timestamp + 60 minutes;
        emit DeadlineSet(deadline);
    }

    function approve() external {
        require(block.timestamp <= deadline, "Deadline passed");
        require(msg.sender == arbiter, "Only arbiter can approve");
        require(!isApproved, "Already approved");
        require(!isRefunded, "Already refunded");

        uint256 amount = address(this).balance;

        (bool sent, ) = payable(beneficiary).call{ value: amount }("");
        require(sent, "Failed to send Ether");

        isApproved = true;
        emit Approved(amount);
    }

    function refund() external {
        require(msg.sender == depositor, "Only depositor can refund");
        require(block.timestamp > deadline, "Deadline not passed");
        require(!isApproved, "Already approved");
        require(!isRefunded, "Already refunded");

        uint256 amount = address(this).balance;

        (bool sent, ) = payable(depositor).call{ value: amount }("");
        require(sent, "Failed to send refund");

        isRefunded = true;
        emit Refunded(amount);
    }
}
