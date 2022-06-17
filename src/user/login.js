const inquirer = require("inquirer");
const { ethers } = require("hardhat");
const { saveCredentials } = require("../util/config.js");

function loginUser() {
  let wallet;
  const questions = [
    {
      type: "input",
      name: "pubKey",
      message: "Enter your public key",
      validate: (pubKey) => {
        return ethers.utils.isAddress(pubKey);
      },
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
  inquirer.prompt(questions).then((input) => {
    saveCredentials(input.pubKey, wallet);
  });
}

loginUser();
