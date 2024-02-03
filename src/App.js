import './App.css';
import Navbar from './components/navbar';
import { Home } from './components/home';
import { Create } from './components/create.js';
import { CollectionI } from './components/collection';
import { Bought } from './components/bought';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers"
import PaintBox from './components/paint';
import ScreenshotButton from './components/test2';



function App() {
  const design = {}

  const [account, setAccount] = useState(null)
  const [connectText, setConnectText] = useState()
  const [loading, setLoading] = useState(true)
  const [Divtest, setTest] = useState("initial")

  const checkWallet = () => {
    if (window.ethereum) {
      setConnectText("Connect")
    } else {
      setConnectText("Wallet not found")
    }
  }



  const requestAccount = async () => {
    if (!connectText) {
      return
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])

    window.ethereum.on('accountsChanged', async (accounts) => {
      setAccount(accounts[0])
      await requestAccount()
    })

    setLoading(false)

  }




  useEffect(() => {
    checkWallet()
  }, [])


  return (
    <div className="design">
      <>
        <Router>
          <Navbar connectValue={connectText} account={account} connectFunction={() => requestAccount()} />

          {
            account != null ?

              loading ?
                "Loading"
                :

                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/collection" element={<CollectionI />} />
                  <Route path="/bought" element={<Bought />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/test" element={<PaintBox />} />
                  <Route path="/test2" element={<ScreenshotButton />} />
                  
                </Routes>
              :
              <h1 className="text-danger text-center" style={{ padding: "250px", fontSize: "70px" }} >Please Connect</h1>

          }




        </Router>
      </>
    </div>
  );


}

export default App;
