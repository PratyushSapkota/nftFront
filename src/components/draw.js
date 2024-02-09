import { Draw, Tldraw } from "@tldraw/tldraw";
import { parseEther, ethers } from 'ethers'
import "./draw.css"
import html2canvas from "html2canvas"
import { Button } from "react-bootstrap";
import axios from 'axios'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormData from "form-data"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"

import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"


export default function NFTDraw() {
    const navigate = useNavigate()
    const [stage, setstage] = useState(0)
    const [_name, setName] = useState()
    const [_price, setPrice] = useState()
    const [nft, setNft] = useState()
    const [market, setMarket] = useState()
    const [loadingStage, setLoadingState] = useState(0)
    const [file, setFile] = useState(null)


    async function start() {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum)
        const signer = await ethersProvider.getSigner()
        const _market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)
        const _nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer)

        setMarket(_market)
        setNft(_nft)
    }

    const mintAndList = async (_uri) => {
        setLoadingState(1)
        await (await nft.mint(_uri)).wait()
        console.log("Minting")

        setLoadingState(2)
        console.log("Approval")
        const tokenCount = await nft.tokenCount()
        await (await nft.setApprovalForAll(market.target, true)).wait()



        setLoadingState(3)
        console.log("Listing")
        await (await market.listItem(
            nft.target,
            tokenCount,
            parseEther(_price.toString())
        )).wait()

        navigate("/collection")


    }



    const confrim = async () => {
        setstage(3)
        const formData = new FormData()
        formData.append("image", file)
        formData.append("name", _name)
        formData.append("tokenId", Number(await nft.tokenCount()) + 1)
        console.log(formData)

        const res = await axios.post(
            "http://localhost:3001/db",
            formData,
            {
                maxContentLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data`
                }
            }
        )

        mintAndList(res.data.uri)
    }


    const captureScreenshot = () => {
        const target = document.getElementById('tldraw')
        if (target) {
            html2canvas(target).then(canvas => {
                canvas.toBlob((blob) => {
                    const _file = new File([blob], 'screenshot.png', { type: "image/png" })
                    console.log(_file)
                    setFile(_file)
                    setstage(1)
                })
            })
        }
    }

    useEffect(() => {
        start()
    })



    return (
        stage == 0 ?
            <>
                <div id="master">
                    <div id="draw-container" >
                        <Tldraw id="tldraw" autofocus={true} >
                        </Tldraw>
                    </div>

                    <div id="confirmButton-div">
                        <button onClick={() => captureScreenshot()} id="confirmButton" >Confirm!</button>
                    </div>
                </div>

            </>
            :
            stage == 1 ?
                <>
                    <InputGroup >
                        <InputGroup.Text >Name</InputGroup.Text>
                        <Form.Control type='text' onChange={(e) => setName(e.target.value)} />
                    </InputGroup>
                    <br />

                    <InputGroup>
                        <InputGroup.Text>Price</InputGroup.Text>
                        <Form.Control type='number' onChange={(e) => setPrice(e.target.value)} />
                    </InputGroup>

                    <Button onClick={() => confrim()} > Mint!</Button>
                </>
                :
                <>
                    <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', textAlign: "center", alignItems: 'center', height: "90vh" }}>
                        <Spinner animation="border" role="status">
                        </Spinner>

                        <br />
                        <div >
                            {loadingStage == 1 ?
                                <>
                                    1/3
                                    <br />
                                    Confirm to MINT your NFT
                                </>
                                : loadingStage == 2 ?
                                    <>
                                        2/3
                                        <br />
                                        Allow us to access your NFT
                                    </>
                                    :
                                    <>
                                        3/3
                                        <br />
                                        Confirm to LIST your NFT to the marketplace
                                    </>
                            }
                        </div>

                    </div>
                </>

    )

}