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
        '0x6a1c7991840dda83d5b24165f785e9fdc5c191d39386e4899507a68fdf9a1859', //0xea
      ]
    }
  }
};
