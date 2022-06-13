const fs = require("fs");
const { ethers } = require("hardhat");

async function deploy(name) {
  const Contract = await ethers.getContractFactory(name);
  const contract = await Contract.deploy();
  console.log(`Successfully deployed "${name}" contract. Address: ${contract.address}`);

  return contract;
}

function storeContractAddress(name, address) {
  fs.writeFileSync(
    `./artifacts/contracts/${name}.sol/${name}.address.json`,
    JSON.stringify(address)
  );
}

async function main() {
  const better = await deploy("Better");
  storeContractAddress("Better", better.address);
}

main();
