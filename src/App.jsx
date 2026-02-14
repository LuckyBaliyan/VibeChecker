import React from 'react';
import SearchBar from './components/SearchBar';
import Tabs from './components/Tabs';
import ResultGrid from './components/ResultGrid';
import useLenis from './hooks/useLenis';

const App = () => {
  useLenis();

  return (
    <div>
      <SearchBar />
      <Tabs />
      <ResultGrid />
    </div>
  );
};

export default App;
