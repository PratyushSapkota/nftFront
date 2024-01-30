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
        '0x2962f0027d5ade5e59ec015aae9919f07d13225a33257e9d401560fb9f77f2d9', //0xea
      ]
    }
  }
};
