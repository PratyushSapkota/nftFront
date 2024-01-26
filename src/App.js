import './App.css';
import Navbar from './components/navbar';
import { Home } from './components/home';
import { Connect } from './components/connect';
import { Create } from './components/create';
import { CollectionI } from './components/collection';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<CollectionI />} />
          <Route path="/home" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
