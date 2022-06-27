const inquirer = require("inquirer");
const { getJsonConfig } = require("../util/config.js");

async function getInput() {
  const question = [
    {
      type: "input",
      name: "masterPrivKey",
      message: "Enter the private key of the system account",
    },
  ];

  await inquirer.prompt(question).then((input) => {
    const userPrivKey = input.masterPrivKey;
    const masterPrivKey = getJsonConfig()["MASTER_PASS"];
    if (userPrivKey === masterPrivKey) return;
    console.log("Wrong credentials.");
    getInput();
  });
}

async function registerSystem() {
  console.log("Login as a system administrator.");
  await getInput();
}

module.exports = { registerSystem };
