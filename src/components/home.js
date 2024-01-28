import React, { useEffect, useState } from "react";
import CardList from "./card";
import {ethers, parseEther} from "ethers";

import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"

import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"

const ethersProvider = new ethers.BrowserProvider(window.ethereum)
const signer = await ethersProvider.getSigner()
const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)
const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer)

export function Home() {

    const [data, setData] = useState([])

    const [feeAccount, setFeeAccount] = useState(null)

    const buy = async ( _item ) => {
        console.log(_item)
        await (await market.buyNft(_item.tokenId, { value: _item.price })).wait()
        getData()
    }


    async function getData() {

        const items = []
        const itemCount = await market.itemCount()

        for (let i = 1; i <= itemCount; i++) {
            const item = await market.items(i)
            if (!item.sold) {
                const totalPrice = await market.getPrice(item.tokenId)
                const uri = await nft.tokenURI(item.tokenId)
                const metadata = await (await fetch(uri)).json()

                items.push({
                    "itemId": item.tokenId,
                    "name": metadata.name,
                    "image": metadata.Image,
                    "price": totalPrice.toString(),
                })

            }
        }
        console.log(items)
        setData(items)
    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <>
            <h1>
                {feeAccount}
            </h1>
            <CardList data={data} canBuy={true} buyFunction={buy} />
        </>
    )
}