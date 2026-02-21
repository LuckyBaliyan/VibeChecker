import React from 'react';
import useLenis from './hooks/useLenis';
import Browse from './pages/Browse';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CardNav from './components/CardNav';

const App = () => {
  useLenis();

  return (
    <main>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/browse' element={<Browse />} />
      </Routes>
      <div className='fixed bottom-10 left-0 z-50 flex w-full items-center justify-center'>
        <CardNav />
      </div>
    </main>
  );
};

export default App;
