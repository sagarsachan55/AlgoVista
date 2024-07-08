import React, { useState, useEffect, useRef } from 'react';
import '../styleSheet/styles.css';

function generateArray(size = 40, max = 100) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.ceil(Math.random() * max));
  }
  return array;
}

function BubbleSort() {
  const [array, setArray] = useState(generateArray());
  const [isSorting, setIsSorting] = useState(false);
  const [stopSorting, setStopSorting] = useState(false);
  const [arraySize, setArraySize] = useState(40);
  const timeoutRef = useRef(null);


  const reset = () => {
    setArray(generateArray(arraySize));
    setIsSorting(false);
    setStopSorting(false);
  };

  const stopSort = () => {
    setStopSorting(true);
  };

  useEffect(() => {
    if (stopSorting && isSorting) {
      setIsSorting(false);
      setStopSorting(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      //console.log("Sorting stopped");
    }
  }, [stopSorting]);
  function func(a, b){

  }
  const sortArray = async () => {
    setIsSorting(true);
    setStopSorting(false);

    const newArr = [...array];
    for (let i = 0; i < newArr.length; i++) {
      for (let j = 0; j < newArr.length - i - 1; j++) {
        const curBar = document.getElementById(`bar${j}`);
        const nextBar = document.getElementById(`bar${j + 1}`);
        curBar.style.backgroundColor = 'red';
        nextBar.style.backgroundColor = 'red';

        await new Promise(resolve => timeoutRef.current = setTimeout(resolve, 10));

        if (newArr[j] > newArr[j + 1]) {
          const temp = newArr[j];
          newArr[j] = newArr[j + 1];
          newArr[j + 1] = temp;
          setArray([...newArr]);
          await new Promise(resolve => timeoutRef.current = setTimeout(resolve, 10));
        }
        curBar.style.backgroundColor = '#007bff';
        nextBar.style.backgroundColor = '#007bff';
      }
    }
    setIsSorting(false);
  };

  const handleSizeChange = (e) => {
    setArraySize(e.target.value);
  };

  return (
    <div>
      <h1 className='head-name'>BUBBLE SORT</h1>
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
            type="number" 
            value={arraySize} 
            onChange={handleSizeChange} 
            disabled={isSorting} 
            min="5" 
            max="100" 
          />
        </label>
        <button onClick={reset} disabled={isSorting}>Reset Array</button>
        <button onClick={sortArray} disabled={isSorting}>Start Sorting</button>
        <button onClick={stopSort} disabled={!isSorting}>Stop Sorting</button>
      </div>
    </div>
  );
}

export default BubbleSort;
