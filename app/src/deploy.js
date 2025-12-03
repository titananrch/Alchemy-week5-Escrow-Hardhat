import { ethers } from "ethers";
import EscrowArtifact from "./artifacts/contracts/Escrow.sol/Escrow.json";

export default async function deploy(signer, arbiter, beneficiary, value) {
  const factory = new ethers.ContractFactory(
    EscrowArtifact.abi,
    EscrowArtifact.bytecode,
    signer
  );
  
  return factory.deploy(arbiter, beneficiary, { value });
}
