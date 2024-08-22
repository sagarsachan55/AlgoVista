import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styleSheet/styles.css';

function generateArray(size, max = 100) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.ceil(Math.random() * max));
  }
  return array.sort((a, b) => a - b);  // Ensure the array is sorted for binary search
}

function BinarySearch() {
  const [array, setArray] = useState(generateArray(40));
  const [isSearching, setIsSearching] = useState(false);
  const [stopSearching, setStopSearching] = useState(false);
  const [arraySize, setArraySize] = useState(40);
  const [speed, setSpeed] = useState(50);
  const [searchValue, setSearchValue] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [cppCode, setCppCode] = useState('');
  const timeoutRef = useRef(null);

  const navigate = useNavigate();

  const barColor = '#579be3';
  const nodeColor = '#558a7b';
  const foundColor = 'yellow';
  const searchColor = '#b0e57c';

  useEffect(() => {
    axios.get('/CPP_Code_of_Algo/binarySearch.txt')
      .then(response => setCppCode(response.data))
      .catch(error => setCppCode(`Error fetching file: ${error.message}`));

    if (stopSearching) {
      setIsSearching(false);
      setStopSearching(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [stopSearching]);

  const highlight_index = (ind, color) => {
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if (curBar) curBar.style.backgroundColor = color;
    if (curNode) curNode.style.backgroundColor = color;
    if (curNode) curNode.style.scale = 1.12;
  };

  const normalise_index = (ind) => {
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if (curBar) curBar.style.backgroundColor = barColor;
    if (curNode) curNode.style.backgroundColor = nodeColor;
    if (curNode) curNode.style.scale = 1;
  };

  const reset = (size) => {
    const newArr = generateArray(size);
    setArray(newArr);
    setIsSearching(false);
    setStopSearching(false);

    for (let i = 0; i < arraySize; i++) normalise_index(i);
  };

  const stopSearch = () => {
    setStopSearching(true);
  };

  const searchArray = async () => {
    if (searchValue === null) {
      alert('Please enter a value to search');
      return;
    }

    setIsSearching(true);
    setStopSearching(false);

    let low = 0;
    let high = arraySize - 1;
    await binarySearch(low, high);
    setIsSearching(false);
  };

  const binarySearch = async (low, high) => {
    highlight_index(low, 'red');
    highlight_index(high, 'red');
    if (low <= high && !stopSearching) {
      const mid = Math.floor((low + high) / 2);
      highlight_index(mid, searchColor);
      await new Promise((resolve) => (timeoutRef.current = setTimeout(resolve, speed)));

      if (array[mid] === searchValue) {
        highlight_index(mid, foundColor);
        await new Promise((resolve) => (timeoutRef.current = setTimeout(resolve, speed)));
        if(low !== mid) normalise_index(low);
        if(high !== mid) normalise_index(high);
        
      } else {
        normalise_index(mid);
        normalise_index(low);
        normalise_index(high);
        if (array[mid] < searchValue) {
          await binarySearch(mid + 1, high);
        } else {
          await binarySearch(low, mid - 1);
        }
      }
    }
  };

  const nextStep = () => {
  };

  const handleSizeChange = (e) => {
    setArraySize(() => e.target.value);
    reset(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(Number(e.target.value));
  };

  const resetButton = () => {
    reset(arraySize);
  };

  const toggleCodeModal = () => {
    setShowCodeModal(!showCodeModal);
  };

  return (
    <div>
      <h1 className='head-name'>BINARY SEARCH</h1>
      <div className='array-nodes'>
        {array.map((value, index) => (
          <div id={`node${index}`} className='node' key={index}>
            {value}
          </div>
        ))}
      </div>
      <div className='array-bars'>
        {array.map((value, index) => (
          <div
            id={`bar${index}`}
            className='bar'
            key={index}
            style={{ height: `${value * 3}px` }}
          ></div>
        ))}
      </div>
      <div className='controls'>
        <label>
          Array Size:
          <input
            type="range"
            min="5"
            max="100"
            value={arraySize}
            onChange={handleSizeChange}
            disabled={isSearching}
          />
          {arraySize}
        </label>
        <label>
          Speed:
          <input
            type="range"
            min="1"
            max="1000"
            value={speed}
            onChange={handleSpeedChange}
            disabled={isSearching}
          />
          {speed} ms
        </label>
        <label>
          Search Value:
          <input
            type="integer"
            value={searchValue === null ? '' : searchValue}
            onChange={handleSearchValueChange}
            disabled={isSearching}
          />
        </label>
        <button onClick={resetButton} disabled={isSearching}>Reset Array</button>
        <button onClick={searchArray} disabled={isSearching}>Start Search</button>
        <button onClick={stopSearch} disabled={!isSearching}>Stop Search</button>
        <button onClick={nextStep} disabled={isSearching}>Next</button>
      </div>
      <div className='controls'>
        <button onClick={toggleCodeModal}>Show C++ Code</button>
        <button onClick={()=>navigate('/')}>Home</button>
      </div>

      {showCodeModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleCodeModal}> &times;</span>
            <h2>C++ Code for Binary Search</h2>
            <pre>{cppCode}</pre>
            <button onClick={() => navigator.clipboard.writeText(cppCode)}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BinarySearch;
