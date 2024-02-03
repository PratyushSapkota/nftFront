import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "./paint.css"

export default function PaintBox() {
    const [url, setUrl] = useState("https://witeboard.com/4013c390-c2aa-11ee-9d73-91220e435dc3")


    return (

        <>
            <div className='canvasContainer'>
                <iframe className='canvas' height="100vh" src={url}></iframe>
                <Button onClick={() => window.print()} variant='info'> Confirm </Button>
            </div>
        </>

    )
}

