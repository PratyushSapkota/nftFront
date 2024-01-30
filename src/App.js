import './App.css';
import Navbar from './components/navbar';
import { Home } from './components/home';
import { Create } from './components/create.js';
import { CollectionI } from './components/collection';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers"



function App() {


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
                <Route path="/home" element={<Home />} />
                <Route path="/create" element={<Create />} />
              </Routes>
            :
            <h1 className="text-danger text-center" >Please Connect</h1>
            
          }
          



      </Router>



    </>
  );


}

export default App;
