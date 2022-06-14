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

async function deployAndStore(name) {
  const contract = await deploy(name);
  storeContractAddress(name, contract.address);
}

async function deployMock(name) {
  const DECIMALS = "18";
  const INITIAL_PRICE = "200000000000000000000";
  const Contract = await ethers.getContractFactory(name);
  const contract = await Contract.deploy(DECIMALS, INITIAL_PRICE);
  console.log(`Successfully deployed "${name}" contract. Address: ${contract.address}`);

  return contract.address;
}

async function deployDF(name) {
  const Contract = await ethers.getContractFactory(name);
  const contract = await Contract.deploy();
  storeContractAddress(name, contract.address);
  console.log(`Successfully deployed "${name}" contract. Address: ${contract.address}`);
}

deployAndStore("Better");
//const address = deployMock("MockV3Aggregator");
deployDF("DataFeed"); // deploy only if there are changes
