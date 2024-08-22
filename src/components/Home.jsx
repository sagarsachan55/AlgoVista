import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../styleSheet/styles.css';

function Home(){
    const navigate = useNavigate();
    return(
        <div>
            <h1 className='head-name'>ALGORITHM VISUALIZER</h1>
            <div className='container'>
                <div className='card' onClick={() => navigate('/bubble-sort')}>
                    {/* <img src ={image1} alt ="Bubble Sort" /> */}
                    <div className='card-header'>Bubble Sort</div>
                </div>

                <div className='card' onClick={()=> navigate('./selection-sort')}>
                    {/* <img src ={image1} alt ="Selection Sort"/> */}
                    <div className='card-header'>Selection Sort</div>
                </div>

                <div className='card' onClick={()=> navigate('./merge-sort')}>
                    {/* <img src ={image1} alt ="Merge Sort"/> */}
                    <div className='card-header'>Merge Sort</div>
                </div>

                <div className='card' onClick={()=> navigate('./quick-sort')}>
                    {/* <img src ={image1} alt ="Bubble Sort"/> */}
                    <div className='card-header'>Quick Sort</div>
                </div>

                <div className='card' onClick={()=> navigate('./binary-search')}>
                    <div className='card-header'>Binary Search</div>
                </div>
                <div className='card' onClick={()=> navigate('./pathfinder')}>
                    <div className='card-header'>Pathfinding</div>
                </div>
            </div>
        </div>
    );
}

export default Home;
