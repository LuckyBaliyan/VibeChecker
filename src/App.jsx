import React from 'react';
import useLenis from './hooks/useLenis';
import Browse from './pages/Browse';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CardNav from './components/CardNav';

const App = () => {
  useLenis();
  const location = useLocation();
  const showCardNav = location.pathname !== '/';

  return (
    <main>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/browse' element={<Browse />} />
      </Routes>
      {showCardNav && (
        <div className='fixed bottom-10 left-0 z-50 flex w-full items-center justify-center'>
          <CardNav />
        </div>
      )}
    </main>
  );
};

export default App;
