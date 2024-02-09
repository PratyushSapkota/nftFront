import { parseEther, ethers } from 'ethers'
import "./card.css"
import React, { createFactory, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { create } from "ipfs-http-client"
import { Button } from 'react-bootstrap';

import axios from 'axios'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormData from "form-data"

import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"
import Spinner from 'react-bootstrap/Spinner';

import { useNavigate } from "react-router-dom";

import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"


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
  const [loadingStage, setLoadingStage] = useState(1)

  const navigate = useNavigate()


  //spinner

  /*
loading ?
                    
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
    setLoadingStage(2)
    const tokenCount = await nft.tokenCount()
    await (await nft.setApprovalForAll(market.target, true)).wait()

    setLoadingStage(3)
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
    navigate("/collection")

  }

  const upload = async (_file) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("image", _file)
    formData.append("name", name)
    formData.append("tokenId", Number(await nft.tokenCount()) + 1)

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

    console.log(res.data.uri)
    mintAndList(res.data.uri)
  }

  useEffect(() => {
    start()
  }, [])



  return (
    <div className='design'>

      {loading ?
        <>
          <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', textAlign: "center" , alignItems: 'center', height: "90vh" }}>
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
        :
        <>

          <Container id='create-page-container'>
            <Row>

              <Col>
                <Form.Control type='file' onChange={setFile} />
                <br />
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
        </>}


    </div>
  )

}
