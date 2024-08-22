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

function BubbleSort() {
  const [array, setArray] = useState(generateArray(40)); 
  const [isSorting, setIsSorting] = useState(false);
  const [stopSorting, setStopSorting] = useState(false);
  const [arraySize, setArraySize] = useState(40);
  const [indx_i, set_i] = useState(0);
  const [indx_j, set_j] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [cppCode, setCppCode] = useState('');
  const timeoutRef = useRef(null);

  const navigate = useNavigate();

  const barColor = '#579be3';
  const nodeColor = '#558a7b';
  const newNodeColor = '#99f3da'
  const newBarColor = '#ff3f3f';
  const sortedColor = 'yellow';

  useEffect(() => {
    axios.get('/CPP_Code_of_Algo/bubbleSort.txt')
      .then(response => setCppCode(response.data))
      .catch(error => setCppCode(`Error fetching file: ${error.message}`));

    if (stopSorting) {
      setIsSorting(false);
      setStopSorting(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [stopSorting, indx_i, indx_j]);

  const highlight_index = (ind) =>{
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if(curBar) curBar.style.backgroundColor = newBarColor;
    if(curNode) curNode.style.backgroundColor = newNodeColor;
    if(curNode) curNode.style.scale = 1.12;
  };

  const normalise_index = (ind) =>{
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if(curBar) curBar.style.backgroundColor = barColor;
    if(curNode) curNode.style.backgroundColor = nodeColor;
    if(curNode) curNode.style.scale = 1;
  };

  const sorted_index =(ind) =>{
    const curBar = document.getElementById(`bar${ind}`);
    const curNode = document.getElementById(`node${ind}`);
    if(curBar) curBar.style.backgroundColor = sortedColor;
    if(curNode) curNode.style.backgroundColor = sortedColor;
  }

  const reset = (size) => {
    const newArr = generateArray(size);
    setArray(newArr);
    setIsSorting(false);
    setStopSorting(false);

    for(let i = 0; i <arraySize; i++) normalise_index(i);
    set_i(0);
    set_j(0);
  };

  const stopSort = () => {
    setStopSorting(true);
  };

  const sortArray = async () => {
    setIsSorting(true);
    setStopSorting(false);

    let newArr = [...array];
    for (let j = indx_j; j < arraySize - indx_i - 1; j++) {
      set_j(j);
      highlight_index(j);
      highlight_index(j+1);

      await new Promise(resolve => timeoutRef.current = setTimeout(resolve, speed));

      if (newArr[j] > newArr[j + 1]) {
        const temp = newArr[j];
        newArr[j] = newArr[j + 1];
        newArr[j + 1] = temp;
        setArray([...newArr]);
        await new Promise(resolve => timeoutRef.current = setTimeout(resolve, speed));
      }

      normalise_index(j);
      normalise_index(j+1);
    }
    sorted_index(arraySize-indx_i-1);
    for (let i = indx_i + 1; i < arraySize; i++) {
      set_i(i);
      for (let j = 0; j < arraySize - i - 1; j++) {
        set_j(j);
        highlight_index(j);
        highlight_index(j+1);
        
        await new Promise(resolve => timeoutRef.current = setTimeout(resolve, speed));

        if (newArr[j] > newArr[j + 1]) {
          const temp = newArr[j];
          newArr[j] = newArr[j + 1];
          newArr[j + 1] = temp;
          setArray([...newArr]);
          await new Promise(resolve => timeoutRef.current = setTimeout(resolve, speed));
        }
        normalise_index(j);
        normalise_index(j+1);
      }
      sorted_index(arraySize-i-1);
    }
    //sorted_index(arraySize-indx_i-2);
    setIsSorting(false);
  };

  const Next = () => {
    if(indx_i >= arraySize-1){
      normalise_index(0);
      normalise_index(1);
      return;
    }
  
    const newArr = array;

    highlight_index(indx_j);
    highlight_index(indx_j+1);

    if(newArr[indx_j] > newArr[indx_j+1]){
      const temp = newArr[indx_j];
      newArr[indx_j] = newArr[indx_j + 1];
      newArr[indx_j + 1] = temp;
      setArray([...newArr]);
    }
    else{
      normalise_index(indx_j);
      if(indx_j === arraySize-indx_i-2){
        normalise_index(indx_j+1);
        sorted_index(indx_j+1);
        highlight_index(0);
        highlight_index(1);
        set_i(indx_i+1);
        set_j(0);
      }
      else{
        highlight_index(indx_j+2);
        set_j(indx_j+1);
      }
    }
  };

  const handleSizeChange = (e) => {
    setArraySize(()=> e.target.value);
    reset(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  const resetButton = () =>{
    reset(arraySize);
  };

  const toggleCodeModal = () => {
    setShowCodeModal(!showCodeModal);
  };
  
  return (
    <div>
      <h1 className='head-name'>BUBBLE SORT</h1>

      <div className='array-nodes'>
        {array.map((value, index) => (
          <div id={`node${index}`} className='node'>{value}</div>
        ))}
      </div>
      <div className='array-bars'>
        {array.map((value, index) => (
          <div
            id={`bar${index}`}
            className='bar'
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
            max="50" 
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
        <button onClick={Next} disabled={isSorting}>Next</button>
      </div>
      <div className='controls'>
        <button onClick={toggleCodeModal}>Show C++ Code</button>
        <button onClick={()=>navigate('/')}>Home</button>
      </div>

      {showCodeModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleCodeModal}> &times;</span>
            <h2>C++ Code for Bubble Sort</h2>
            <pre>{cppCode}</pre>
            <button onClick={() => navigator.clipboard.writeText(cppCode)}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BubbleSort;
