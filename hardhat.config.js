require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const mnemonic = require("./secrets.json");

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    //hardhat: {},
    testnet: {
      url: "https://data-seed-prebsc-1-s2.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic },
    },
  },
  solidity: {
    version: "0.8.0",
  },
};
