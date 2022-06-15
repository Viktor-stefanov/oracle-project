const { ethers } = require("hardhat");
const inquirer = require("inquirer");
const { getCurrentEvents, setBid, getEvent } = require("../util/contracts");
const { printEvents } = require("../util/events");

async function takeBidInput(event) {
  const questions = [
    {
      type: "list",
      name: "bid",
      message: "Choose outcome to bid on",
      choices: [
        `Price of ${event.assetName} will fluctuate ${event.priceGoal}% (or more) by ${event.closeDate}`,
        `Price of ${event.assetName} will NOT fluctuate ${event.priceGoal}% (or more) by ${event.closeDate}`,
      ],
    },
    {
      type: "number",
      name: "bidAmount",
      message: "Bid amount (in BNB)",
      validate: (input) => {
        return !isNaN(parseFloat(input));
      },
    },
  ];
  return await inquirer.prompt(questions).then((input) => {
    const position = input.bid.includes("will NOT") ? 0 : 1;
    const bidAmount = ethers.utils.parseEther(input.bidAmount.toString());
    return [position, bidAmount];
  });
}

async function takeBidEventInput() {
  const questions = [
    {
      type: "number",
      name: "eventID",
      message: "Event's ID: (the number part only)",
      validate: (input) => {
        return !isNaN(parseInt(input));
      },
    },
  ];
  await inquirer.prompt(questions).then(async (input) => {
    let event = await getEvent(input.eventID);
    if (event) {
      const [position, bidAmount] = await takeBidInput(event);
      await setBid(event.ID, position, bidAmount);
    }
  });
}

async function takeActionInput() {
  console.log("What do you wish to do?");
  const question = [
    {
      type: "list",
      name: "action",
      message: "What do you wish to do?",
      choices: ["List events", "Bid on event", "Quit"],
    },
  ];

  await inquirer.prompt(question).then(async (input) => {
    if (input.action === "List events") {
      const events = await getCurrentEvents();
      printEvents(events);
    } else if (input.action === "Bid on event") {
      await takeBidEventInput();
    } else if (input.action === "Quit") {
      return;
    }

    takeActionInput();
  });
}

takeActionInput();
