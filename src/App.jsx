import React from 'react'
import {fetchAssets,fetchGifs, fetchVideos} from './api/mediaApi';
import ResultCard from './components/ResultCard';

const App = () => {
  return (
    <div>
      <h1 className='text-2xl text-purple-600 
      font-extrabold'>
        Day01
      </h1>
      <button onClick={()=>fetchAssets('cat')}>
        Get Assets
      </button>
      <br />
      <button onClick={()=>fetchGifs('cat')}>
        Get GIFS
      </button>
      <br />
      <button onClick={()=>fetchVideos('cat')}>
        Get Videos
      </button>
      <ResultCard />
    </div>
  )
}

export default App;
