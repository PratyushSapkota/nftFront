import "./card.css";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { formatEther, ethers } from 'ethers';

import marketAbi from "../contract_info/Market-abi.json"
import marketAddress from "../contract_info/Market-address.json"
import getConversionRate from "./conversionRate";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from "react-router-dom";
const mainstyle = {}
const ethersProvider = new ethers.BrowserProvider(window.ethereum)
const signer = await ethersProvider.getSigner()
const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)

const conversionRate = getConversionRate()

function CardList({ data, type }) {

  const navigate = useNavigate()

  async function buyFunction(_item) {
    await (await market.buyNft(_item.itemId, { value: _item.price })).wait()
    navigate("/bought")
    
  }

  if (data.length == 0){
    
    return (
      <>
      <h1 style={{
        padding: "300px",
        color: "white",
        fontSize: "20px"
      }} className="text-center"> Nothing to Show Here</h1>
      </>
    )
  }

  return (

    <div className="mainstyle">
      <Row xs={1} md={4} className="g-4" >
        {data.map((item, idx) => (
          <Col key={idx}>
            <div className="cardBorder">
              <Card className="card" >

                <div className="imageWrapper">
                  <Card.Img variant="top" className="cardImage" src={item.image} />
                </div>

                <Card.Body className="css" style={{ height: "150px" }} >

                  {
                    type == 'canBuy' ?
                      <>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                          <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ objectFit: "container", width: "15px" }} />
                          <span style={{ padding: "10px", paddingRight: "50%" }}>{formatEther(item.price)} <br />
                            USD { (formatEther(item.price) * conversionRate).toFixed(2) } </span>
                          <Button variant='info' style={{ background: "#ececec", alignContent: "right" }} onClick={() => buyFunction(item)} >Buy</Button>
                        </Card.Text>
                      </>
                      : type == 'collection' ?
                        <>
                          <Card.Title>{item.name}</Card.Title>
                          Listing for:
                          <br />
                          <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ width: "15px" }} />
                          <span style={{ padding: "10px", paddingRight: "60%" }}>{formatEther(item.price)} </span>
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
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );


}

export default CardList;