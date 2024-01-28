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

    async function getData() {

        const items = []
        const itemCount = await market.itemCount()

        for (let i = 1; i <= itemCount; i++) {
            const item = await market.items(i)
            console.log("price: ", (await market.items(item.tokenId)).owner_cut)
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
        setData(items)
    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <>
            <CardList data={data} canBuy={true} />
        </>
    )
}