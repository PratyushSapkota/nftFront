import { parseEther, ethers } from 'ethers'
import "./card.css"
import React, { createFactory, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import { create } from "ipfs-http-client"
import { Button } from 'react-bootstrap';
import axios from 'axios'
import FormData from "form-data"
import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"
import Spinner from 'react-bootstrap/Spinner';
import { redirect } from 'react-router-dom';
import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"
import { Tldraw } from '@tldraw/tldraw';


import html2canvas from 'html2canvas';

const design = {}
const apiKey = "36884d16602f1fbe240e"
const apiSecret = "77b008440155fc49b21ae2883c784ae6be7dde31edc321aa6b4263ef8be0d4ed"


const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
const urlJSON = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

export function Create() {

  const [market, setMarket] = useState(null)
  const [nft, setNft] = useState(null)
  const [image, setImage] = useState(null)
  const [price, setPrice] = useState(null)
  const [name, setName] = useState(null)
  const [coOwn, changeCoOwn] = useState(false)
  const [coOwnAddr, setCoOwnAddr] = useState()
  const [selfCut, setSelfCut] = useState(50)
  const [loading, setLoading] = useState(false)
  const [isDraw, changeDrawTo] = useState(false)

  //spinner

  /*
loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "90vh" }}>
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                    :

  */



  async function start() {
    const ethersProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await ethersProvider.getSigner()
    const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)
    const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer)

    setMarket(market)
    setNft(nft)

  }



  const setFile = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (typeof file != 'undefined') {
      setImage(file)
    }
  }

  const mintAndList = async (_uri) => {
    await (await nft.mint(_uri)).wait()
    const tokenCount = await nft.tokenCount()
    await (await nft.setApprovalForAll(market.target, true)).wait()

    if (coOwn) {
      await (await market.Co_listItem(
        nft.target,
        tokenCount,
        parseEther(price.toString()),
        coOwnAddr,
        selfCut
      )).wait()
    } else {
      await (await market.listItem(
        nft.target,
        tokenCount,
        parseEther(price.toString())
      )).wait()
    }

    setLoading(false)


  }

  const createNFT = async (_imageUrl) => {
    const data = { "Image": _imageUrl, "name": name }
    console.log(data)

    const res = await axios.post(
      urlJSON,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": 'application/json',
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': apiSecret
        }
      }
    )
    mintAndList("https://amethyst-legal-albatross-808.mypinata.cloud/ipfs/" + res.data.IpfsHash)
  }

  const upload = async (_file) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", _file)

    const res = await axios.post(
      url,
      formData,
      {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data`,
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': apiSecret
        }
      }
    )

    // console.log(res)
    console.log("IMAGE: ", res.data.IpfsHash)
    createNFT(`https://amethyst-legal-albatross-808.mypinata.cloud/ipfs/${res.data.IpfsHash}`)
  }

  const captureScreenshot = () => {
    const target = document.getElementById('tldraw')

    if (target) {
      html2canvas(target).then(canvas => {
        const screenshot = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = screenshot;
        link.download = 'screenshot.png'
        link.click()
      })
    }
  }


  useEffect(() => {
    start()
  }, [])



  return (
    <div className='design'>

      <Container id='create-page-container'>
        <Row>

          <Col>
            <Form.Control type='file' onChange={setFile} />
            <>
              <form id="overall" >
                {
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
                    <br />

                    <Form.Check type='switch' value={true} label="Co Own" onChange={() => coOwn ? changeCoOwn(false) : changeCoOwn(true)} />

                    {
                      coOwn ?
                        <>
                          <br />
                          <InputGroup>
                            <InputGroup.Text>Co-Owner Address</InputGroup.Text>
                            <Form.Control type='text' onChange={(e) => setCoOwnAddr(e.target.value)} />
                          </InputGroup>
                          <br />
                          <InputGroup
                          >
                            Your Cut: {selfCut}% <br />
                            Co-Owner Cut: {100 - selfCut}%
                            <Form.Range style={{ width: "50%" }} onChange={(e) => setSelfCut(e.target.value)} />
                          </InputGroup>
                          <br />
                        </>
                        :
                        <>

                        </>
                    }

                  </>
                }
              </form>
            </>
          </Col>
        </Row>

      </Container>

      <div id="upload-button-container" >
        <Button variant='info' style={{ background: "white", alignContent: "right" }} onClick={() => upload(image)} >Upload</Button>
      </div>

    </div>
  )

}
