const { network, artifacts, ethers } = require("hardhat")
const fs = require("fs")
const timeStamp = new Date()
require("dotenv").config()

async function main() {
    const [owner] = await ethers.getSigners()

    const networkName = network.name
    
    const market = await ethers.deployContract("Market", [owner.address, 1])
    await market.waitForDeployment()
    console.log("deployed market at: ", market.target)
    saveFiles( market, "Market", networkName )
    
    const nft = await ethers.deployContract("NFT", [market.target, "Deerwalk Collection", "DRW"])
    await nft.waitForDeployment()
    console.log("deployed nft at: ", nft.target)
    saveFiles( nft, "NFT", networkName )
}


function saveFiles( contract, name, _network ) {
    const contractDirectory = process.env.DEPLOYMENT_PATH

    const data = {
        address: `${contract.target}`,
        networkName: _network,
        time: `${timeStamp.toDateString()} ${timeStamp.toTimeString()}`
    }

    fs.writeFileSync(
        contractDirectory + `/${name}-address.json`,
        JSON.stringify( data, undefined, 2 )
    )

    const contractArtifact = artifacts.readArtifactSync(name)

    fs.writeFileSync(
        contractDirectory + `/${name}-abi.json`,
        JSON.stringify(contractArtifact, null, 2)
    )
}

main().then(() => process.exit(0)).catch((error) => {console.log(error); process.exit(1);});