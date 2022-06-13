const inquirer = require("inquirer");
const { getCurrentEvents, storeEvent } = require("../util/contracts");

async function takeCreateEventInput() {
  const event = {};
  const questions = [
    {
      type: "input",
      name: "eventName",
      message: "Event's name:",
    },
    {
      type: "input",
      name: "eventDescription",
      message: "Event's description (detailed)",
    },
    {
      type: "input",
      name: "datafeedAddress",
      message: "Chainlink data feed oracle's address",
    },
    {
      type: "datetime",
      name: "startDate",
      message: "Event will be valid from",
      format: ["Y", "/", "MM", "/", "DD", " ", "HH", ":", "mm", ":", "ss"],
    },
    {
      type: "datetime",
      name: "endDate",
      message: "Event will be closed at",
      format: ["Y", "/", "MM", "/", "DD", " ", "HH", ":", "mm", ":", "ss"],
    },
    {
      type: "number",
      name: "outcomes",
      message: "Number of possible outcomes",
    },
  ];

  return inquirer.prompt(questions).then(async (input) => {
    event.name = input.eventName;
    event.description = input.eventDescription;
    event.dfAddress = input.datafeedAddress;
    event.from = new Date(input.startDate).getTime();
    event.until = new Date(input.endDate).getTime();
    event.outcomes = [];
    for (let i = 1; i < input.outcomes + 1; i++) {
      event.outcomes.push(await takeOutcomeInput(i));
    }

    return event;
  });
}

async function takeOutcomeInput(num) {
  const question = [
    {
      type: "input",
      name: "outcome",
      message: `Outcome #${num} description`,
    },
  ];

  return inquirer.prompt(question).then((input) => {
    return input.outcome;
  });
}

async function takeCloseEventInput() {
  const question = [
    {
      type: "input",
      name: "eventName",
      message: "Name of event to close:",
    },
  ];
  await inquirer.prompt(question).then(async (input) => {
    const events = getCurrentEvents();
    for (const event of events) {
      if (event.name === input.eventName) {
        // delete event from events AND call distribute smart contract
      }
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
      choices: ["Create event", "Close event", "Quit"],
    },
  ];

  inquirer.prompt(question).then(async (input) => {
    if (input.action === "Create event") {
      const event = await takeCreateEventInput();
      await storeEvent(event);
    } else if (input.action === "Close event") {
      await takeCloseEventInput();
    } else if (input.action === "Quit") return;
    await takeActionInput();
  });
}

inquirer.registerPrompt("datetime", require("inquirer-datepicker"));
takeActionInput();
