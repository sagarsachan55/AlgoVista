import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BubbleSort from './components/BubbleSort';
import SelectionSort from './components/SelectionSort';
import MergeSort from './components/MergeSort';
import QuickSort from './components/QuickSort';
import BinarySearch from './components/BinarySearch';
import Algorithm from './components/pathfinder';
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
          <Route path="/quick-sort" element={<QuickSort />} />
          <Route path='/binary-search' element={<BinarySearch />} />
          <Route path='/pathfinder' element={<Algorithm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
