import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styleSheet/styles.css';

function generateArray(size, max = 100) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.ceil(Math.random() * max));
  }
  return array;
}

function QuickSort() {
  const [array, setArray] = useState(generateArray(40));
  const [isSorting, setIsSorting] = useState(false);
  const [stopSorting, setStopSorting] = useState(false);
  const [arraySize, setArraySize] = useState(40);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [cppCode, setCppCode] = useState('');
  const timeoutRef = useRef(null);

  const navigate = useNavigate();

  const barColor = '#579be3';
  const nodeColor = '#558a7b';
  const newNodeColor = '#99f3da';
  const pivotColor = '#ff3f3f';
  const sortedColor = 'yellow';
  const currentColor = '#b0e57c';

  useEffect(() => {
    axios.get('/CPP_Code_of_Algo/quickSort.txt')
      .then(response => setCppCode(response.data))
      .catch(error => setCppCode(`Error fetching file: ${error.message}`));

    if (stopSorting) {
      setIsSorting(false);
      setStopSorting(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [stopSorting]);

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

  const sorted_index = (ind) => {
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if (curBar) curBar.style.backgroundColor = sortedColor;
    if (curNode) curNode.style.backgroundColor = sortedColor;
  };

  const green_index = (ind) => {
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if (curBar) curBar.style.backgroundColor = 'green';
    if (curNode) curNode.style.backgroundColor = 'green';
  }

  const reset = (size) => {
    const newArr = generateArray(size);
    setArray(newArr);
    setIsSorting(false);
    setStopSorting(false);
    setCurrentStep(null);

    for (let i = 0; i < arraySize; i++) normalise_index(i);
  };

  const stopSort = () => {
    setStopSorting(true);
  };

  const sortArray = async () => {
    setIsSorting(true);
    setStopSorting(false);
    setCurrentStep(null);

    let newArr = [...array];
    await quickSort(newArr, 0, arraySize - 1);
    setIsSorting(false);
  };

  const quickSort = async (arr, low, high) => {
    if (low < high && !stopSorting) {
      let pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    } else {
      for (let i = low; i <= high; i++) {
        sorted_index(i);
      }
    }
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    highlight_index(high, pivotColor);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      highlight_index(j, newNodeColor);
      await new Promise((resolve) => (timeoutRef.current = setTimeout(resolve, speed)));

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        green_index(i);
        if(i !== j) normalise_index(j);
      }
      else normalise_index(j);
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    normalise_index(high);
    sorted_index(i + 1);
    return i + 1;
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

  const resetButton = () => {
    reset(arraySize);
  };

  const toggleCodeModal = () => {
    setShowCodeModal(!showCodeModal);
  };

  return (
    <div>
      <h1 className='head-name'>QUICK SORT</h1>
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
            disabled={isSorting}
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
            disabled={isSorting}
          />
          {speed} ms
        </label>
        <button onClick={resetButton} disabled={isSorting}>Reset Array</button>
        <button onClick={sortArray} disabled={isSorting}>Start Sorting</button>
        <button onClick={stopSort} disabled={!isSorting}>Stop Sorting</button>
        <button onClick={nextStep} disabled={isSorting}>Next</button>
      </div>
      <div className='controls'>
        <button onClick={toggleCodeModal}>Show C++ Code</button>
        <button onClick={()=>navigate('/')}>Home</button>
      </div>

      {showCodeModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleCodeModal}> &times;</span>
            <h2>C++ Code for Quick Sort</h2>
            <pre>{cppCode}</pre>
            <button onClick={() => navigator.clipboard.writeText(cppCode)}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickSort;
