
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

function GridExample({ _length }) {

  const [data, setData] = useState(
    [
      {"id": 1, "name": "a", "price":6, "url":"https://www.w3schools.com/w3css/img_5terre.jpg", "logo":""}, 
      {"id": 1, "name": "a", "price":6, "url":"https://www.w3schools.com/w3css/img_5terre.jpg" }, 
      {"id": 1, "name": "a", "price":3, "url":"https://www.w3schools.com/w3css/img_5terre.jpg" }, 
      {"id": 1, "name": "a", "price":9, "url":"https://www.w3schools.com/w3css/img_5terre.jpg" }, 
      {"id": 1, "name": "a", "price":8, "url":"https://www.w3schools.com/w3css/img_5terre.jpg" }, 
      {"id": 1, "name": "a", "price":7, "url":"https://www.w3schools.com/w3css/img_5terre.jpg" }, 
      {"id": 1, "name": "a", "price":5, "url":"https://www.w3schools.com/w3css/img_5terre.jpg" }, 
      
  ])


  return (
    <Row xs={1} md={_length} className="g-4">
      {data.map((item, idx) => (
        <Col key={idx}>
         <div class="zoom">
          <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src= {item.url} />
            <Card.Body>
              <div class="bottom-left">
              <Card.Title>{item.name}</Card.Title> 
            <Button variant="primary">Buy {item.price}</Button></div>
            </Card.Body>
          </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default GridExample;

