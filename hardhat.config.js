require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config({ path: '.env' });

const { PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    sepolia: {
      url: ALCHEMY_API_KEY,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
