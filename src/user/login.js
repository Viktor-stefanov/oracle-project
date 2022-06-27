const inquirer = require("inquirer");
const { ethers } = require("hardhat");
const { saveCredentials } = require("../util/config.js");

async function registerUser() {
  let wallet;
  const questions = [
    {
      type: "input",
      name: "pubKey",
      message: "Enter your public key",
      //validate: (pubKey) => {
      //  return ethers.utils.isAddress(pubKey);
      //},
    },
    {
      type: "input",
      name: "privKey",
      message: "Enter your private key",
      validate: (privKey) => {
        try {
          wallet = new ethers.Wallet(privKey);
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
    },
  ];
  await inquirer.prompt(questions).then(async (input) => {
    saveCredentials(input.pubKey, input.privKey);
  });
}

registerUser();
module.exports = { registerUser };
