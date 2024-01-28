const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("Main test", async () => {
    let owner, feeAccount, user1, user2, user3, nft, market
    const nullAccount = "0x0000000000000000000000000000000000000000"
    before(async () => {
        [owner, feeAccount, user1, user2, user3] = await ethers.getSigners()

        market = await ethers.deployContract("Market", [feeAccount.address, 1], {
            deployer: owner
        })
        await market.waitForDeployment()

        nft = await ethers.deployContract("NFT", [market.target, "test", "TST"], {
            deployer: owner
        })
        await nft.waitForDeployment()

        await nft.connect(user1).setApprovalForAll(market.target, true)
        await nft.connect(user2).setApprovalForAll(market.target, true)
        await nft.connect(user3).setApprovalForAll(market.target, true)

    })


    it("Should track nft of a single owner", async () => {
        let tokenCount
        await nft.connect(user1).mint("uri1")
        tokenCount = await nft.tokenCount()

        await expect(market.connect(user1).listItem(
            nft,
            tokenCount,
            ethers.parseEther("1")
        )).to.emit(market, "Offered").withArgs(
            tokenCount,
            nft.target,
            tokenCount,
            ethers.parseEther("1"),
            user1.address,
            nullAccount,
            100
        )

        assert.equal((await market.items(tokenCount)).toString(), [
            tokenCount,
            nft.target,
            tokenCount,
            ethers.parseEther("1"),
            user1.address,
            nullAccount,
            "100",
            false
        ].toString())
    })

    it("Should track nft of two owners", async () => {
        let tokenCount
        await nft.connect(user1).mint("uri2")
        tokenCount = await nft.tokenCount()

        await expect(market.connect(user1).Co_listItem(
            nft,
            tokenCount,
            ethers.parseEther("2"),
            user2.address,
            50
        )).to.emit(market, "Offered").withArgs(
            tokenCount,
            nft.target,
            tokenCount,
            ethers.parseEther("2"),
            user1.address,
            user2.address,
            50
        )

        assert.equal((await market.items(tokenCount)).toString(), [
            tokenCount,
            nft.target,
            tokenCount,
            ethers.parseEther("2"),
            user1.address,
            user2.address,
            "50",
            false
        ].toString())

    })

    it("Should give the single owner funds when bought", async () => {
        let tokenCount
        const feeAccountBal = await ethers.provider.getBalance(feeAccount.address) / ethers.parseEther("1")
        const user1Bal = await ethers.provider.getBalance(user1.address) / ethers.parseEther("1")
        const user3Bal = await ethers.provider.getBalance(user3.address) / ethers.parseEther("1")

        await nft.connect(user1).mint("uri1")
        tokenCount = await nft.tokenCount()
        await market.connect(user1).listItem(
            nft,
            tokenCount,
            ethers.parseEther("100")
        )

        const actualPrice = await market.getPrice(tokenCount)

        await expect(
            market.connect(user3).buyNft(tokenCount, { value: actualPrice })
        ).to.emit(market, "Bought").withArgs(
            tokenCount,
            nft.target,
            tokenCount,
            ethers.parseEther("100"),
            user1.address,
            nullAccount,
            100,
            user3.address
        )


        const Final_feeAccountBal = await ethers.provider.getBalance(feeAccount.address) / ethers.parseEther("1")
        const Final_user1Bal = await ethers.provider.getBalance(user1.address) / ethers.parseEther("1")
        const Final_user3Bal = await ethers.provider.getBalance(user3.address) / ethers.parseEther("1")

        assert.equal(Final_user1Bal, user1Bal + BigInt(100))
        assert.equal(Final_user3Bal, user3Bal - BigInt(101))
        assert.equal(Final_feeAccountBal, feeAccountBal + BigInt(1))

    })

    it("Should give owners funds when bought", async () => {
        let tokenCount

        const user1Bal = await ethers.provider.getBalance(user1.address) / ethers.parseEther("1")
        const user2Bal = await ethers.provider.getBalance(user2.address) / ethers.parseEther("1")
        const user3Bal = await ethers.provider.getBalance(user3.address) / ethers.parseEther("1")
        const feeAccountBal = await ethers.provider.getBalance(feeAccount.address) / ethers.parseEther("1")

        await nft.connect(user1).mint("uri")
        tokenCount = await nft.tokenCount()
        await market.connect(user1).Co_listItem(
            nft,
            tokenCount,
            ethers.parseEther("100"),
            user2.address,
            60
        )

        await expect(
            market.connect(user3).buyNft(tokenCount, { value: ethers.parseEther("101") })
        ).to.emit(
            market, "Bought"
        ).withArgs(
            tokenCount,
            nft.target,
            tokenCount,
            ethers.parseEther("100"),
            user1.address,
            user2.address,
            60,
            user3.address
        )

        const Final_user1Bal = await ethers.provider.getBalance(user1.address) / ethers.parseEther("1")
        const Final_user2Bal = await ethers.provider.getBalance(user2.address) / ethers.parseEther("1")
        const Final_user3Bal = await ethers.provider.getBalance(user3.address) / ethers.parseEther("1")
        const Final_feeAccountBal = await ethers.provider.getBalance(feeAccount.address) / ethers.parseEther("1")

        assert.equal(Final_user1Bal, user1Bal + BigInt("60"))
        assert.equal(Final_user2Bal, user2Bal + BigInt("40"))
        assert.equal(Final_user3Bal, user3Bal - BigInt("101"))
        assert.equal(Final_feeAccountBal, feeAccountBal + BigInt("1"))

    })
})