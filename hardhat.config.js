require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "ganache",
  networks: {
    ganache:{
      url: "HTTP://127.0.0.1:7545",
      chainId: 1337,
      // ganache private keys
      accounts: [
        process.env.PRIVATE_KEY
      ]
    }
  }
};
