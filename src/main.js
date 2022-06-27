const inquirer = require("inquirer");
const { registerUser } = require("./user/login");
const { registerSystem } = require("./system/login");
const { userActions } = require("./user/actions");
const { systemActions } = require("./system/actions");

function getLoginInfo() {
  const questions = [
    {
      type: "list",
      name: "type",
      message: "Login as",
      choices: ["User", "System Admin"],
    },
  ];
  inquirer.prompt(questions).then(async (input) => {
    if (input.type === "User") {
      await registerUser();
      await userActions();
    } else if (input.typo === "System Admin") {
      await registerSystem();
      await systemActions();
    }
  });
}

getLoginInfo();
