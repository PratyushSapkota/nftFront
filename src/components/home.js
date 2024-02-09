import React, { useEffect, useState } from "react";
import CardList from "./card";
import { ethers, parseEther } from "ethers";

import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"

import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"

import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";

const ethersProvider = new ethers.BrowserProvider(window.ethereum)
let signer = await ethersProvider.getSigner()
let market, nft
const design = {}

export function Home({ _test }) {

    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const loadContracts = (_signer) => {
        market = new ethers.Contract(marketAddress.address, marketAbi.abi, _signer)
        nft = new ethers.Contract(nftAddress.address, nftAbi.abi, _signer)
    }


    async function getData() {

        loadContracts(signer)

        const items = []
        const itemCount = await market.itemCount()

        for (let i = 1; i <= itemCount; i++) {
            const item = await market.items(i)
            console.log("price: ", (await market.items(item.tokenId)).owner_cut)
            if (!item.sold && (item.owner != signer.address && item.co_owner != signer.address)) {
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
        setLoading(false)
    }



    useEffect(() => {
        getData()
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
                            <CardList data={data} type={'canBuy'} />
                        </>
                }
            </>
        </div>
    )
}