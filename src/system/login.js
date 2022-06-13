const prompt = require("prompt");
const { getJsonConfig } = require("../util/config.js");

function getInput() {
  prompt.get(["Master password"], (err, res) => {
    const userPass = res["Master password"];
    const masterPass = getJsonConfig()["MASTER_PASS"];
    if (userPass === masterPass) return;
    console.log("Wrong password!");
    getInput();
  });
}

function login() {
  prompt.start();
  console.log("Login as a system administrator.");
  getInput();
}

login();
