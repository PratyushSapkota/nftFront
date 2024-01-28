require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    ganache:{
      url: "HTTP://127.0.0.1:7545",
      chainId: 1337,
      // ganache private keys
      accounts: [
        '0x3273c810c65a12e8f2e86abbaa8edd6420ab085869fba4b92352c2de73a0892e',
        '0x0ac003b128876c0101ae628c0dacd20dc52aff813f572048131f1d16867c04f8'
      ]
    }
  }
};
