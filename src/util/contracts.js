const betterABI = require("../../artifacts/contracts/Better.sol/Better.json");
const betterAddress = require("../../artifacts/contracts/Better.sol/Better.address.json");
const hre = require("hardhat");

let better = getContractInstance();

async function storeEvent(event) {
  better = await better;
  await better.addEvent(event.name, event.description, event.from, event.until, event.outcomes);
}

async function getCurrentEvents() {
  better = await better;
  let events = [];
  const eventCount = await better.eventCount();
  for (let i = 1; i < eventCount.add(1); i++) {
    let event = await better.getEvent(i);
    events.push({
      name: event[0],
      description: event[1],
      from: new Date(parseInt(event[2])),
      until: new Date(parseInt(event[3])),
      outcomes: event[4],
    });
  }

  return events;
}

async function getContractInstance() {
  const signer = await hre.ethers.getSigner();
  const better = new hre.ethers.Contract(betterAddress, betterABI.abi, signer);
  return better;
}

module.exports = { storeEvent, getCurrentEvents };

getCurrentEvents();
