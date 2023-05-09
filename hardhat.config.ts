import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

const CONTRACT_DIR = "./contracts";

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  paths: {
    sources: `${CONTRACT_DIR}/src/`,
    tests: `${CONTRACT_DIR}/test`,
    cache: `${CONTRACT_DIR}/cache`,
    artifacts: `${CONTRACT_DIR}/artifacts`,
  },
  solidity: "0.8.18",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    }
  }
};


export default config;