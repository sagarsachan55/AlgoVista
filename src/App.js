import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BubbleSort from './components/BubbleSort';
import SelectionSort from './components/SelectionSort';
import MergeSort from './components/MergeSort';
import './App.css';

function App() {
  return (
    <Router>
      <div className = "App">
        <Routes>
          <Route path = "/" element = {<Home/>} />
          <Route path="/bubble-sort" element={<BubbleSort />} />
          <Route path="/selection-sort" element={<SelectionSort />} />
          <Route path="/merge-sort" element={<MergeSort />} />
          {/* <Route path="/algorithm2" element={<Algorithm2 />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
