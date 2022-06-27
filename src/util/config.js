const fs = require("fs");
const path = require("path");

function getJsonConfig() {
  const fileData = fs.readFileSync(configPath);
  if (fileData.length > 0) return JSON.parse(fileData);
  return {};
}

function saveCredentials(pubKey, privKey) {
  const jsonConfig = getJsonConfig();
  jsonConfig["privKey"] = privKey;
  jsonConfig["pubKey"] = pubKey;
  fs.writeFileSync(configPath, JSON.stringify(jsonConfig));
}

const configPath = path.join(__dirname, "..", "..", "config.json");
module.exports = { getJsonConfig, saveCredentials };
