const betterMetadata = require("../../artifacts/contracts/Better.sol/Better.json");
const betterAddress = require("../../artifacts/contracts/Better.sol/Better.address.json");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

let better;
getContractInstance().then((c) => {
  better = c;
  //test();
});

async function createEvent(event) {
  console.log(better);
  await better.addEvent(
    event.name,
    event.description,
    event.assetName,
    event.closeDate,
    event.closeBidsDate,
    event.priceGoal,
    event.oracle,
    { gasLimit: 10000000 }
  );
}

async function setBid(eventID, position, bidAmount) {
  const signers = await ethers.getSigners();
  const signer = signers[signers.length - 3];
  better = await better.connect(signer);

  try {
    await better.placeBid(eventID, position, { value: bidAmount });
    bidAmount = ethers.utils.formatEther(bidAmount);
    console.log(
      `Successfully placed your bid of ${bidAmount} BNB on Event #${eventID}.`
    );
  } catch (err) {
    console.log("Could not set your bid!");
    console.log(err); // this should be logged to a log file
  }
}

async function closeEvent(eventID) {
  const event = await better.getEvent(eventID),
    endPrice = await better.getEventOutcome(event.name),
    changePercent = ((endPrice - event.startPrice) / event.startPrice) * 100;
  let goalReached = false;
  if (event.goalPrice > 0 && changePercent >= event.goalPrice) {
    goalReached = true;
  }
  let winnersBetAmount = BigNumber.from(0),
    losersBetAmount = BigNumber.from(0),
    winners = [];
  const betters = await better.callStatic.closeEvent(eventID);
  betters.forEach((bet) => {
    if (bet.bid === goalReached) {
      winnersBetAmount = winnersBetAmount.add(bet.amount);
      winners.push(bet);
    } else losersBetAmount = losersBetAmount.add(bet.amount);
  });
  for (let winner of winners) {
    let coefficient =
      Number(winner.amount.mul(100).div(winnersBetAmount)) / 100;
    let wonAmount = losersBetAmount.mul(coefficient * 100).div(100);
    await better.payWinner(winner.account, {
      value: wonAmount.toString(),
    });
  }

  await better.closeEvent(eventID);
}

async function getCurrentEvents() {
  const events = [];
  const contractEvents = await better.getEvents();
  for (const event of contractEvents) {
    events.push({
      name: event[0],
      description: event[1],
      assetName: event[2],
      closeDate: new Date(parseInt(event[3])),
      closeBidsDate: new Date(parseInt(event[4])),
      priceGoal: `${parseInt(event[6])}%`,
      oracle: event[7],
      ID: event[8],
    });
  }

  return events;
}

async function getEvent(eventID) {
  const event = await better.getEvent(eventID);
  return {
    name: event[0],
    description: event[1],
    assetName: event[2],
    closeDate: new Date(parseInt(event[3])),
    closeBidsDate: new Date(parseInt(event[4])),
    priceGoal: `${parseInt(event[6])}%`,
    oracle: event[7],
    ID: event[8],
  };
}

async function getContractInstance() {
  const signer = await ethers.getSigner();
  const better = new ethers.Contract(betterAddress, betterMetadata.abi, signer);
  return better;
}

async function test() {
  await better.getEvent(1);
}

module.exports = {
  createEvent,
  getCurrentEvents,
  setBid,
  closeEvent,
  getEvent,
};
