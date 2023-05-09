require("@nomicfoundation/hardhat-toolbox");

const CONTRACT_DIR = "./contracts";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    sources: `${CONTRACT_DIR}/src/`,
    tests: `${CONTRACT_DIR}/test`,
    cache: `${CONTRACT_DIR}/cache`,
    artifacts: `${CONTRACT_DIR}/artifacts`,
  },
};
