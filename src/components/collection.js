import React, { useEffect } from "react";
import { useState } from 'react';
import CardList from "./card";
import { ethers, parseEther } from "ethers";
import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"

import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"


export function CollectionI() {
  const [listedData, setlistedData] = useState([])

  async function getCollectionData() {

    const ethersProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await ethersProvider.getSigner()
    const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)
    const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer)

    const listedItem = []
    const boughtItem = []

    const itemCount = await market.itemCount()

    for (let i = 0; i <= itemCount; i++) {
      const item = await market.items(i)
      if (item.owner == signer.address || item.co_owner == signer.address) {



        const uri = await nft.tokenURI(item.tokenId)
        const metadata = await (await fetch(uri)).json()
        const totalPrice = Number(await market.getPrice(item.tokenId)) / Number(parseEther("1"))

        if (!item.sold) {
          listedItem.push({
            "name": metadata.name,
            "image": metadata.Image,
            "price": totalPrice.toString(),
            "own": (item.owner == signer.address)
          })
        }
      }

    }
    setlistedData(listedItem)
    console.log(listedItem)
  }



  useEffect(() => {
    getCollectionData()
  }, [])


  return (
    <>
      <h3>Listed</h3>
      {/* <CardList data={listedData} canBuy={false} /> */}
    </>
  )

}