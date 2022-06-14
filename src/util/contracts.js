const betterABI = require("../../artifacts/contracts/Better.sol/Better.json");
const betterAddress = require("../../artifacts/contracts/Better.sol/Better.address.json");
const { ethers } = require("hardhat");

let better = getContractInstance();

async function storeEvent(event) {
  better = await better;
  await better.addEvent(
    event.name,
    event.description,
    event.dfAddress,
    event.from,
    event.until,
    event.outcomes
  );
}

async function setBid(eventID, position, bidAmount) {
  better = await better;
  try {
    await better.placeBid(eventID, position, bidAmount);
    console.log(
      `Successfully placed your bid of ${bidAmount}$ on Event #${eventID} with bid position ${position}.`
    );
  } catch (err) {
    console.log("Could not set your bid!");
    console.log(err); // this should be logged to a log file
  }
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
      oracleAddress: event[2],
      from: new Date(parseInt(event[3])),
      until: new Date(parseInt(event[4])),
      outcomes: event[5],
      ID: i,
    });
  }

  return events;
}

async function getContractInstance() {
  const signer = await ethers.getSigner();
  const better = new ethers.Contract(betterAddress, betterABI.abi, signer);
  return better;
}

async function test() {
  better = await better;
  const address = await better.feeAccount();
  console.log(address);
  console.log(await ethers.provider.getBalance(address));
}

//test();
module.exports = { storeEvent, getCurrentEvents, setBid };
