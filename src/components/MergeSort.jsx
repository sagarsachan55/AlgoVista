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

function MergeSort() {
  const [array, setArray] = useState(generateArray(40));
  const [isSorting, setIsSorting] = useState(false);
  const [stopSorting, setStopSorting] = useState(false);
  const [arraySize, setArraySize] = useState(40);
  const [speed, setSpeed] = useState(50);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [cppCode, setCppCode] = useState('');
  const timeoutRef = useRef(null);

  const navigate = useNavigate();

  const barColor = '#579be3';
  const nodeColor = '#558a7b';
  const sortedColor = 'yellow';
  const currentColor = '#b0e57c';

  useEffect(() => {
    axios.get('/CPP_Code_of_Algo/mergeSort.txt')
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

  const reset = (size) => {
    const newArr = generateArray(size);
    setArray(newArr);
    setIsSorting(false);
    setStopSorting(false);

    for (let i = 0; i < arraySize; i++) normalise_index(i);
  };

  const stopSort = () => {
    setStopSorting(true);
  };

  const sortArray = async () => {
    setIsSorting(true);
    setStopSorting(false);

    let newArr = [...array];
    await mergeSort(newArr, 0, arraySize - 1);
    setIsSorting(false);
  };

  const mergeSort = async (arr, left, right) => {
    if (left < right ) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const merge = async (arr, left, mid, right) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);

    for (let i = 0; i < n1; i++) {
      leftArr[i] = arr[left + i];
      highlight_index(left + i, currentColor);
    }
    for (let j = 0; j < n2; j++) {
      rightArr[j] = arr[mid + 1 + j];
      highlight_index(mid + 1 + j, currentColor);
    }

    await new Promise((resolve) => timeoutRef.current = setTimeout(resolve, speed));

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      highlight_index(k, currentColor);
      setArray([...arr]);
      await new Promise((resolve) => timeoutRef.current = setTimeout(resolve, speed));
      normalise_index(k);
      k++;
    }

    while (i < n1) {
      arr[k] = leftArr[i];
      highlight_index(k, currentColor);
      setArray([...arr]);
      await new Promise((resolve) => timeoutRef.current = setTimeout(resolve, speed));
      normalise_index(k);
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = rightArr[j];
      highlight_index(k, currentColor);
      setArray([...arr]);
      await new Promise((resolve) => timeoutRef.current = setTimeout(resolve, speed));
      normalise_index(k);
      j++;
      k++;
    }

    for (let i = left; i <= right; i++) {
      sorted_index(i);
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

  const resetButton = () => {
    reset(arraySize);
  };

  const toggleCodeModal = () => {
    setShowCodeModal(!showCodeModal);
  };

  return (
    <div>
      <h1 className='head-name'>MERGE SORT</h1>
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
            <h2>C++ Code for Merge Sort</h2>
            <pre>{cppCode}</pre>
            <button onClick={() => navigator.clipboard.writeText(cppCode)}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MergeSort;
