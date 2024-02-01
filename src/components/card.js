import "./card.css";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { formatEther, ethers } from 'ethers';

import marketAbi from "../contract_info/Market-abi.json"
import marketAddress from "../contract_info/Market-address.json"

import ProgressBar from 'react-bootstrap/ProgressBar';
const mainstyle = {}
const ethersProvider = new ethers.BrowserProvider(window.ethereum)
const signer = await ethersProvider.getSigner()
const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)


function CardList({ data, type }) {

  async function buyFunction(_item) {
    await (await market.buyNft(_item.itemId, { value: _item.price })).wait()
  }

  return (
    <div className="mainstyle">
      <Row xs={1} md={4} className="g-4" style={{ height: "100vh" }}>
        {data.map((item, idx) => (
          <Col key={idx}>
            <Card style={{ width: '18rem' }}>

              <Card.Img  variant="top" src={item.image} style={{ width: "286px", height: "170px", objectFit:"fit" }} />

              <Card.Body className="css" style={{ background: "" }} >

                {
                  type == 'canBuy' ?
                    <>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ objectFit: "container", width: "15px" }} />
                        <span style={{ padding: "10px", paddingRight: "50%" }}>{formatEther(item.price)}</span>
                        <Button variant='info' style={{ background: "#ececec", alignContent: "right" }} onClick={() => buyFunction(item)} >Buy</Button>
                      </Card.Text>
                    </>
                    : type == 'collection' ?
                      <>
                        <Card.Title>{item.name}</Card.Title>
                        Listing for:
                        <br />
                        <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ width: "15px" }} />
                        <span style={{ padding: "10px", paddingRight: "60%" }}>{formatEther(item.price)}</span>
                        {
                          item.co_owner != "0x0000000000000000000000000000000000000000" ?
                            <>
                              <span style={{ alignContent: "right" }} ><ProgressBar now={item.co_owner != signer.address ? (item.ownerCut).toString() : (100n - item.ownerCut).toString()} label={`${item.co_owner != signer.address ? (item.ownerCut).toString() : (100n - item.ownerCut).toString()}%`} /></span>
                            </>
                            :
                            <></>
                        }

                        <br />
                      </>
                      : type == 'bought' ?
                        <>
                          <Card.Title>{item.name}</Card.Title>
                          Bought For
                          <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ width: "15px" }} />
                          {formatEther(item.price)}
                        </>
                        :
                        <></>

                }


              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );


}

export default CardList;