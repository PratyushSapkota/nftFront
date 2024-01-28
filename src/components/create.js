import { parseEther, ethers } from 'ethers'

import { createFactory, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { create } from "ipfs-http-client"
import { Button } from 'react-bootstrap';
import axios from 'axios'
import FormData from "form-data"
import marketAbi from "../contract_info/Market-abi.json"
import nftAbi from "../contract_info/NFT-abi.json"

import marketAddress from "../contract_info/Market-address.json"
import nftAddress from "../contract_info/Nft-address.json"

const apiKey = "36884d16602f1fbe240e"
const apiSecret = "77b008440155fc49b21ae2883c784ae6be7dde31edc321aa6b4263ef8be0d4ed"



const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
const urlJSON = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

export function Create() {

  const [market, setMarket] = useState(null)
  const [nft, setNft] = useState(null)

  async function start() {
    const ethersProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await ethersProvider.getSigner()
    const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)
    const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer)

    setMarket(market)
    setNft(nft)

  } 

  const [image, setImage] = useState(null)
  const [price, setPrice] = useState(null)
  const [name, setName] = useState(null)
  const [coOwn, changeCoOwn] = useState(false)
  const [selfCut, setSelfCut] = useState(50)


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
    await (await market.listItem(nft.target, tokenCount, parseEther(price.toString()))).wait()
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

  useEffect(() => {
    start()
  }, [])


  return (
    <>
      {
        coOwn ?
          "Co-Own" :
          "Single Own"
      }

      <Form.Control type='file' onChange={setFile} />
      <br />
      <InputGroup>
        <InputGroup.Text>Name</InputGroup.Text>
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
              <Form.Control type='text' onChange={(e) => console.log((e.target.value).length)} />
            </InputGroup>
            <br />
            <InputGroup>
              Your Cut: {selfCut}% <br />
              Co-Owner Cut: {100 - selfCut}%
              <Form.Range style={{ width: "50%" }} onChange={(e) => setSelfCut(e.target.value)} />
            </InputGroup>
            <br />
          </>
          :
          <>
            <br />
          </>
      }

      <button onClick={() => upload(image)} > Upload </button>
    </>
  )

}
