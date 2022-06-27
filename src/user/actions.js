const { ethers } = require("hardhat");
const inquirer = require("inquirer");
const Datepicker = require("inquirer-datepicker");
const {
  getCurrentEvents,
  setBid,
  getEvent,
  createEvent,
} = require("../util/contracts");
const { printEvents } = require("../util/events");

async function takeCreateEventInput() {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Name of event",
    },
    {
      type: "input",
      name: "description",
      message: "Description of event",
    },
    {
      type: "input",
      name: "assetName",
      message: "Name of asset (BTC, S&P500...)",
    },
    {
      type: "input",
      name: "priceGoal",
      message: "Expected change in price (in '%' e.g. +5%, -3%, -10%...)",
      validate: (input) => {
        return input.slice(-1) === "%" && !isNaN(parseInt(input.slice(1, -1)));
      },
    },
    {
      type: "input",
      name: "oracle",
      message: "Chainlink oracle's address",
      validate: (input) => {
        return ethers.utils.isAddress(input);
      },
    },
    {
      type: "datepicker",
      name: "closeBidsDate",
      format: ["HH", ":", "mm"],
      message: "Prohibit bids after",
    },
    {
      type: "datepicker",
      format: ["DD", "/", "MM", " ", "HH", ":", "mm"],
      name: "closeDate",
      message: "Close date of event",
    },
  ];
  return await inquirer.prompt(questions).then((input) => {
    return {
      name: input.name,
      description: input.description,
      assetName: input.assetName,
      closeDate: new Date(input.closeDate).getTime(),
      closeBidsDate: new Date(input.closeBidsDate).getTime(),
      oracle: input.oracle,
      priceGoal: parseInt(input.priceGoal),
    };
  });
}

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

async function userActions() {
  console.log("What do you wish to do?");
  const question = [
    {
      type: "list",
      name: "action",
      message: "What do you wish to do?",
      choices: ["Create event", "List events", "Bid on event", "Quit"],
    },
  ];

  await inquirer.prompt(question).then(async (input) => {
    if (input.action === "List events") {
      const events = await getCurrentEvents();
      printEvents(events);
    } else if (input.action === "Bid on event") {
      await takeBidEventInput();
    } else if (input.action === "Create event") {
      const event = await takeCreateEventInput();
      await createEvent(event);
    } else if (input.action === "Quit") {
      return;
    }
    userActions();
  });
}

inquirer.registerPrompt("datepicker", Datepicker);
userActions();
module.exports = { userActions };
