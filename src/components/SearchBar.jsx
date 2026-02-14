import React, { useState } from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { setQuery } from '../redux/features/searchSlice';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setQuery(search));
    setSearch('');
  };

  return (
    <header className='w-full  bg-[#0E0E0E] fixed top-0 left-0 z-20'>
      <form onSubmit={submitHandler} className='mx-auto flex w-full items-center gap-3 px-4 py-5 sm:gap-5 sm:px-8'>
        <input
          required
          onChange={(e) => setSearch(e.target.value)}
          className='w-full p-1.5 rounded borde px-2  bg-zinc-500 text-zinc-900 outline-none 
          placeholder:text-zinc-60'
          type='text'
          value={search}
          placeholder='search'
        />
        <Button type='submit' text='Search' className='rounded p-4 text-sm font-semibold' />
      </form>
    </header>
  );
};

export default SearchBar;
