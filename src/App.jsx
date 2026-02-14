import React from 'react'
import {fetchAssets,fetchGifs, fetchVideos} from './api/mediaApi';
import ResultCard from './components/ResultCard';
import SearchBar from './components/SearchBar';
import Tabs from './components/Tabs';
import ResultGrid from './components/ResultGrid';

const App = () => {
  return (
    <div>
      <SearchBar />
      <Tabs />
      <ResultGrid />
    </div>
  )
}

export default App;
