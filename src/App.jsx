import React, { useEffect } from 'react';
import useLenis from './hooks/useLenis';
import Browse from './pages/Browse';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CardNav from './components/CardNav';
import MediaDetail from './pages/MediaDetail';
import Collection from './pages/Collection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useLenis();
  const location = useLocation();
  const showCardNav = location.pathname !== '/';

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    const resolvedTheme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, []);

  return (
    <main>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/browse' element={<Browse />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/media/:id' element={<MediaDetail />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={1800} theme='colored' />
      {showCardNav && (
        <div className='fixed bottom-10 left-0 z-50 flex w-full items-center justify-center'>
          <CardNav />
        </div>
      )}
    </main>
  );
};

export default App;
