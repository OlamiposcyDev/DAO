const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy CryptoDevsNFT contract
  const CryptoDevsNFT = await hre.ethers.getContractFactory("CryptoDevsNFT");
  const nftContract = await CryptoDevsNFT.deploy();
  await nftContract.deployed();
  console.log("CryptoDevsNFT deployed to:", nftContract.address);

  // Deploy FakeNFTMarketplace contract
  const FakeNFTMarketplace = await hre.ethers.getContractFactory(
    "FakeNFTMarketplace"
  );
  const fakeNftMarketplaceContract = await FakeNFTMarketplace.deploy();
  await fakeNftMarketplaceContract.deployed();
  console.log(
    "FakeNFTMarketplace deployed to:",
    fakeNftMarketplaceContract.address
  );

  // Deploy CryptoDevsDAO contract with value (amount) in Ether
  const amount = hre.ethers.utils.parseEther("0.1");
  const CryptoDevsDAO = await hre.ethers.getContractFactory("CryptoDevsDAO");
  const daoContract = await CryptoDevsDAO.deploy(
    fakeNftMarketplaceContract.address, // Pass the address of FakeNFTMarketplace
    nftContract.address, // Pass the address of CryptoDevsNFT
    { value: amount }
  );
  await daoContract.deployed();
  console.log("CryptoDevsDAO deployed to:", daoContract.address);

  await sleep(30 * 1000);

  // Verify contracts (make sure the contract names match your actual contract names)
  await hre.run("verify:verify", {
    address: nftContract.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: fakeNftMarketplaceContract.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: daoContract.address,
    constructorArguments: [
      fakeNftMarketplaceContract.address,
      nftContract.address,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
