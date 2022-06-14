const { ethers } = require("hardhat");
const inquirer = require("inquirer");
const { getCurrentEvents, setBid } = require("../util/contracts");
const { printEvents, getEvent } = require("../util/events");

async function takeOutcomesInput(outputs) {
  console.log("Possible outcomes: ", outputs);
  const questions = [
    {
      type: "number",
      name: "outcomeNumber",
      message: "Choose outcome to bid on (number)",
      validate: (input) => {
        return !isNaN(parseInt(input)) && input <= outputs.length;
      },
    },
    {
      type: "number",
      name: "bidAmount",
      message: "Bid amount (in USD)",
      validate: (input) => {
        return !isNaN(parseFloat(input));
      },
    },
  ];
  return await inquirer.prompt(questions).then((input) => {
    return [input.outcomeNumber, input.bidAmount];
  });
}

async function takeBidEventInput() {
  const questions = [
    {
      type: "input",
      name: "eventID",
      message: "Event's ID: (the number part only)",
      validate: (input) => {
        return !isNaN(parseInt(input));
      },
    },
    {
      type: "input",
      name: "eventName",
      message: "Event's name",
    },
  ];
  await inquirer.prompt(questions).then(async (input) => {
    const event = await getEvent(parseInt(input.eventID), input.eventName);
    if (event) {
      const outcomes = event.outcomes.map((val, i) => {
        const entry = {};
        entry[i + 1] = val;
        return entry;
      });
      const [outcomeNumber, bidAmount] = await takeOutcomesInput(outcomes);
      await setBid(event.ID, outcomeNumber, bidAmount);
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
