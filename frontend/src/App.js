import './App.css';

import {   
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import React from 'react';
import SmartSuggestion from "./components/SmartSuggestion";
import Checkout from './components/Checkout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/suggest" element={<SmartSuggestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;