import { ethers } from "hardhat";

async function main() {
  const Aetherial = await ethers.getContractFactory("Aetherial");
  const aetherial = await Aetherial.deploy();

    const contractAddress = await aetherial.getAddress();
  console.log("Aetherial deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

