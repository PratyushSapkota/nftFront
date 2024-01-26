import React from "react";
import requestAccount from "../App";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function Navbar() {
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
                        <Button href="/" variant="Primary" size="lg" >
                            Connect
                        </Button>
                    </nav>
                </>
                )
}

