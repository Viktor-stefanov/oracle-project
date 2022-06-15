const { ethers } = require("hardhat");
const inquirer = require("inquirer");
const { createEvent, closeEvent, getEvent } = require("../util/contracts");

//async function takePriceChangeInput() {
//  const questions = [
//    {
//      type: "input",
//      name: "eventGoal",
//      message:
//        "Asset price change in percent (e.g. -2% means 'reach price goal of -2% from current price or lower')",
//      validate: (input) => {
//        return input.slice(-1) === "%" && !isNaN(parseInt(input.slice(0, -1)));
//      },
//    },
//    {
//      type: "datetime",
//      format: ["DD", " ", "HH", ":", "mm"],
//      name: "closeDate",
//      message: "Close event date",
//    },
//    {
//      type: "input",
//      name: "oracle",
//      message: "Asset price's oracle / data feed address",
//    },
//  ];

//  return await inquirer.prompt(questions).then((input) => {
//    return [input.oracle, input.closeDate, input.eventGoal];
//  });
//}

//async function takeCreateEventInput() {
//  const questions = [
//    {
//      type: "input",
//      name: "eventName",
//      message:
//        "Event's name (e.g. BTC price change, Manchester v Liverpool, Tuesday Weather Forecast...)",
//    },
//    {
//      type: "input",
//      name: "eventDescription",
//      message: "Event's description",
//    },
//    {
//      type: "list",
//      name: "outcomeType",
//      choices: ["Asset Price Change", "Sports Game Outcome"],
//      message: "Select the type of bet",
//    },
//  ];

//  return inquirer.prompt(questions).then(async (input) => {
//    let event = {};
//    event.name = input.name;
//    event.description = input.description;
//    event.outcomeType = "priceChange";
//    if (input.outcomeType === "Asset Price Change") {
//      const [oracle, closeDate, goal] = await takePriceChangeInput();
//      event.oracle = oracle;
//      event.closeDate = closeDate;
//      event.goal = goal;
//    } else if (input.outcomeType === "Sports Game Outcome") {
//      null;
//    }

//    await storeEvent(event);
//  });
//}

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
      type: "datetime",
      name: "closeBidsDate",
      format: ["HH", ":", "mm"],
      message: "Prohibit bids after",
    },
    {
      type: "datetime",
      format: ["DD", "/", "MM", " ", "HH", ":", "mm"],
      name: "closeDate",
      message: "Close date of event",
    },
  ];
  return await inquirer.prompt(questions).then(async (input) => {
    return {
      name: input.name,
      description: input.description,
      assetName: input.assetName,
      closeDate: new Date(input.closeDate).getTime(),
      closeBidsDate: new Date(input.closeBidsDate).getTime(),
      oracle: input.oracle,
      priceGoal: parseInt(input.priceGoal.slice(0, -1)),
    };
  });
}

async function takeCloseEventInput() {
  const question = [
    {
      type: "number",
      name: "eventID",
      message: "Event's ID (number part only):",
      validate: (input) => {
        return !isNaN(parseInt(input));
      },
    },
  ];
  await inquirer.prompt(question).then(async (input) => {
    const event = await getEvent(input.eventID);
    if (event) await closeEvent(event.ID);
  });
}

async function takeActionInput() {
  console.log("What do you wish to do?");
  const question = [
    {
      type: "list",
      name: "action",
      message: "What do you wish to do?",
      choices: ["Create event", "Close event", "Quit"],
    },
  ];

  inquirer.prompt(question).then(async (input) => {
    if (input.action === "Create event") {
      const event = await takeCreateEventInput();
      await createEvent(event);
    } else if (input.action === "Close event") {
      await takeCloseEventInput();
    } else if (input.action === "Quit") return;
    await takeActionInput();
  });
}

inquirer.registerPrompt("datetime", require("inquirer-datepicker"));
takeActionInput();
