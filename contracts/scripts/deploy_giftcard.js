// scripts/deploy_giftcard.js
const hre = require("hardhat");

async function main() {
  // Deploy GiftCard contract
  const GiftCard = await hre.ethers.getContractFactory("GiftCard");
  
  // 1% fee (100 basis points) - can be adjusted as needed
  const feePercentage = 100;
  // Deployer will be the initial fee collector - update this in production
  const [deployer] = await hre.ethers.getSigners();
  const feeCollector = deployer.address;

  console.log(`Deploying GiftCard with fee: ${feePercentage} bps, fee collector: ${feeCollector}`);
  
  const giftCard = await GiftCard.deploy(feePercentage, feeCollector);
  await giftCard.deployed();

  console.log(`GiftCard deployed to: ${giftCard.address}`);

  // Verify the contract on Etherscan/Polygonscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await giftCard.deployTransaction.wait(6);
    
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: giftCard.address,
      constructorArguments: [feePercentage, feeCollector],
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
