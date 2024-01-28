
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { formatEther } from 'ethers';

function CardList({ data, canBuy, buyFunction }) {
  const imageStyle ={
    backgroundSize : "contain",
    height : "200px"
  }
  return (
    <Row xs={1} md={4} className="g-4">
      {data.map((item, idx) => (
        <Col key={idx}>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={item.image} style={imageStyle}/>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              {
                canBuy ?
                  <>
                    <Card.Text>
                      {/* <Button variant='info' > */}
                        <img src='https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029' style={{ width: "15px" }} />
                        <span style={ {padding: "10px", paddingRight: "55%"} }>{formatEther(item.price)}</span>
                        <Button variant='info' style={{alignContent: "right"}} onClick={() => buyFunction(item)} >Buy</Button>
                      {/* </Button> */}
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

