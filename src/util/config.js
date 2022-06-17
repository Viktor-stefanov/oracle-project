const fs = require("fs");
const path = require("path");

function getJsonConfig() {
  const fileData = fs.readFileSync(configPath);
  if (fileData.length > 0) return JSON.parse(fileData);
  return {};
}

function writeKeypair(pub, priv) {
  const jsonConfig = getJsonConfig();
  if (jsonConfig["PUBLIC_KEY"] === pub) console.log("PUB KEY ALREADY EXISTS");
  const keypair = {
    PUBLIC_KEY: pub,
    PRIVATE_KEY: priv,
  };
  fs.writeFileSync(configPath, JSON.stringify(keypair));
}

function saveCredentials(pubKey, wallet) {
  const jsonConfig = getJsonConfig();
  const walletJSON = JSON.stringify(wallet);
  if (!jsonConfig["wallet"]) {
    jsonConfig["wallet"] = walletJSON;
  }
  if (!jsonConfig["pubKey"]) {
    jsonConfig["pubKey"] = pubKey;
  }
  fs.writeFileSync(configPath, JSON.stringify(jsonConfig));
}

function getWallet() {
  const jsonConfig = getJsonConfig();
  if (jsonConfig["wallet"]) {
    return JSON.parse(jsonConfig["wallet"]);
  }
  return null;
}

const configPath = path.join(__dirname, "..", "..", "config.json");

module.exports = { getJsonConfig, writeKeypair, saveCredentials, getWallet };
