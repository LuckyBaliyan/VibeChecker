import React from 'react';
import Button from './Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery } from '../redux/features/searchSlice';

const SearchBar = () => {
  const [search,setSearch] = useState('');
  const dispatch = useDispatch();

  const submitHandler = (e)=>{
    e.preventDefault();
    dispatch(setQuery(search));
    setSearch('');
  }

  return (
    <div>
      <form onSubmit={(e)=>submitHandler(e)} className='flex gap-5 p-8 bg-gray-900'>
        <input required onChange={(e)=>setSearch(e.target.value)} className='w-full border border-white outline-0 rounded p-2
        bg-gray-400'
          type='text'
          value={search}
          placeholder='search anything...'
        />
        <Button type='submit' text={'Search'} />
      </form>
    </div>
  );
};

export default SearchBar;
