import React from "react";
import requestAccount from "../App";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const metamaskLogo = "https://images.ctfassets.net/ohcexbfyr6py/5JMWSHUdERAyrq0mHT39zy/7c932a6ee03c6cafac88714bd443dbc0/Metamask.png"

export default function Navbar({ connectValue, connectFunction, account }) {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">NFT MARKET PLACE</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/collection">Collection</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/create">Create</Link>
                            </li>

                        </ul>
                    </div>
                </div>
                <Button variant="Primary" size="lg" onClick={connectFunction} style={{width:"auto", textAlign:"right"}} > 
                    { 
                        account == null ?
                        connectValue
                        :
                        <>
                            <img src={'/Metamask.png'} style={{width: "10%"}} />
                            {account.slice(0, 5)}...{account.slice(38)}
                        </> 
                    }
                </Button>
            </nav>
        </>
    )
}

