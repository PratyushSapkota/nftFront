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
        '0xd20506f83d19382447d9bb098525e896b1de7d29fef2a1f6c4e69f771a9c1767',
        '0xbf5af2b553580ee3ba900526b5faac27e8011f4eb3500daa3f1f4f8985c8b466'
      ]
    }
  }
};
