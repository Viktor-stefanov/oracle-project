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

const configPath = path.join(__dirname, "..", "..", "config.json");

module.exports = { getJsonConfig, writeKeypair };
