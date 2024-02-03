import React, { useEffect } from "react";
import { useState } from 'react';
import CardList from "./card";
import { ethers, parseEther } from "ethers";
import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"
import "./card.css"
import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"

import Spinner from 'react-bootstrap/Spinner';

export function CollectionI() {
  const [listedData, setlistedData] = useState([])
  const [loading, setLoading] = useState(true)
  const design = {}
  async function getCollectionData() {

    const ethersProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await ethersProvider.getSigner()
    const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)
    const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer)

    const listedItem = []

    const itemCount = await market.itemCount()

    for (let i = 0; i <= itemCount; i++) {
      const item = await market.items(i)
      if (item.owner == signer.address || item.co_owner == signer.address) {
        const uri = await nft.tokenURI(item.tokenId)
        const metadata = await (await fetch(uri)).json()
        const totalPrice = await market.getPrice(item.tokenId)

        if (!item.sold) {
          listedItem.push({
            "name": metadata.name,
            "image": metadata.Image,
            "price": totalPrice.toString(),
            "co_owner": item[5],
            "ownerCut": item[6]
          })
        }

      }
      console.log(item)
    }


    setlistedData(listedItem)
    setLoading(false)
  }



  useEffect(() => {
    getCollectionData()
  }, [])


  return (
    <div className="design">
      <>
        {
          loading ?
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "90vh" }}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </>
            :
            <>
              <CardList data={listedData} type={'collection'} />
            </>

        }
      </>
    </div>
  )

}