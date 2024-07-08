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

                <div className='card' onClick={()=> navigate('./slection-sort')}>
                    {/* <img src ={image1} alt ="Selection Sort"/> */}
                    <div className='card-header'>Selection Sort</div>
                </div>

                <div className='card' onClick={()=> navigate('./Merge-sort')}>
                    {/* <img src ={image1} alt ="Merge Sort"/> */}
                    <div className='card-header'>Merge Sort</div>
                </div>

                <div className='card' onClick={()=> navigate('./bubble-sort')}>
                    {/* <img src ={image1} alt ="Bubble Sort"/> */}
                    <div className='card-header'>Bubble Sort</div>
                </div>
            </div>
        </div>
    );
}

export default Home;
