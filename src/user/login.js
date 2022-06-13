const prompt = require("prompt");
const { getJsonConfig, writeKeypair } = require("../util/config.js");

function validateKey(key) {} // VALIDATE IF KEY IS VALID PUBLIC/PRIVATE KEY

function loginUser() {
  const jsonConfig = getJsonConfig();
  if (Object.keys(jsonConfig).length === 0) {
    console.log("Login as a user.");
    prompt.start();
    prompt.get(["Public key", "Private key"], (err, res) => {
      writeKeypair(res["Public key"], res["Private key"]);
    });
  } else {
    const PUBLIC_KEY = jsonConfig["PUBLIC_KEY"];
    console.log(`Logged in with wallet address "${PUBLIC_KEY}"`);
  }
}

loginUser();
