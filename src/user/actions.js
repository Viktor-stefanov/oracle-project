const inquirer = require("inquirer");
const { getCurrentEvents } = require("../util/contracts");
const { printEvents } = require("../util/events");

function takeActionInput() {
  console.log("What do you wish to do?");
  const question = [
    {
      type: "list",
      name: "action",
      message: "What do you wish to do?",
      choices: ["List events", "Bid on event", "Quit"],
    },
  ];

  inquirer.prompt(question).then(async (input) => {
    if (input.action === "List events") {
      const events = await getCurrentEvents();
      printEvents(events);
    } else if (input.action === "Bid on event") {
    } else if (input.action === "Quit") {
      return;
    }

    takeActionInput();
  });
}

takeActionInput();
