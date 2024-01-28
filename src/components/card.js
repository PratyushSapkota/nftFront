
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { ethers } from 'ethers';

// import marketAbi from "../contract_info/Market-abi.json"

// import marketAddress from "../contract_info/Market-address.json"

// const ethersProvider = new ethers.BrowserProvider(window.ethereum)
// const signer = await ethersProvider.getSigner()
// const market = new ethers.Contract(marketAddress.address, marketAbi.abi, signer)

// const buy = async (_itemId) => {
//   await (await market.buyNft(_itemId)).wait()
// }

async function CardList({ data, canBuy }) {


  return (
    <Row xs={1} md={4} className="g-4">
      {data.map((item, idx) => (
        <Col key={idx}>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={item.image} />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              {
                canBuy
                  ?
                  <>
                    <Card.Text>
                      <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ width: "15px" }} />
                      <span style={{ padding: "10px", paddingRight: "55%" }}>ethers.formatEther(item.price)</span>
                      <Button variant='info' style={{ alignContent: "right" }} >Buy</Button>
                    </Card.Text>
                  </>
                  :
                  <>
                    <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ width: "15px" }} />
                    {item.price}
                  </>
              }
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );



}

export default CardList;

