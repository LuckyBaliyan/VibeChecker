import React, { useEffect, useRef, useState } from 'react';
import { fetchAssets, fetchVideos, fetchGifs } from '../api/mediaApi';
import { setLoading, setError, setResults, clearResults, setQuery, setActiveTab } from '../redux/features/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import ResultCard from './ResultCard';
import Button from './Button';

const tabs = [
  { label: 'IMGES', value: 'photos' },
  { label: 'GIFS', value: 'gifs' },
  { label: 'VIDEOS', value: 'videos' },
];

const heightPattern = [
  'h-[220px]',
  'h-[280px]',
  'h-[340px]',
  'h-[260px]',
  'h-[320px]',
  'h-[240px]',
  'h-[300px]',
  'h-[360px]',
];

const getHeightClass = (index) => heightPattern[index % heightPattern.length];

const ResultGrid = () => {
  const { query, activeTab, results, loading, error } = useSelector((store) => store.search);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(query);
  const requestRef = useRef(0);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestRef.current;

    const getData = async () => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        dispatch(clearResults());
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));

      try {
        let finalData = [];

        if (activeTab === 'photos') {
          finalData = await fetchAssets(trimmedQuery);
        } else if (activeTab === 'videos') {
          finalData = await fetchVideos(trimmedQuery);
        } else if (activeTab === 'gifs') {
          finalData = await fetchGifs(trimmedQuery);
        }

        if (cancelled || requestId !== requestRef.current) return;
        dispatch(setResults(finalData));
        dispatch(setLoading(false));
      } catch (err) {
        if (cancelled || requestId !== requestRef.current) return;
        dispatch(setError(err.message || 'Network error. Try again.'));
      }
    };

    getData();

    return () => {
      cancelled = true;
    };
  }, [query, activeTab, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setQuery(searchValue.trim()));
  };

  const hasQuery = query.trim().length > 0;

  return (
    <section className='cyber-page min-h-screen w-full px-3 pb-28 pt-12 sm:px-5 lg:px-8'>
      <div className='mx-auto w-full max-w-[1320px]'>
        <h1 className='cyber-title text-accent text-center text-4xl font-bold sm:text-6xl uppercase'>Browse Valt</h1>

        <form onSubmit={submitHandler} className='cyber-search-shell mx-auto mt-8 flex w-full max-w-2xl items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5 shrink-0 text-accent'>
            <path fillRule='evenodd' d='M10.5 3a7.5 7.5 0 1 0 4.683 13.36l4.228 4.227a.75.75 0 1 0 1.06-1.06l-4.227-4.228A7.5 7.5 0 0 0 10.5 3Zm-6 7.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z' clipRule='evenodd' />
          </svg>

          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder='SEARCH DATA VAULT...'
            className='cyber-search-input text-accent w-full bg-transparent outline-none'
            type='text'
          />

          <Button type='submit' variant='cyber' text='EXECUTE' className='min-w-28 px-5 py-2.5 text-xs sm:min-w-32' />
        </form>

        <div className='mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <Button
                key={tab.value}
                text={tab.label}
                variant={isActive ? 'cyber' : 'ghostCyber'}
                className='min-w-36 px-4 py-2'
                onClick={() => dispatch(setActiveTab(tab.value))}
              />
            );
          })}
        </div>

        {error && (
          <p className='mx-auto mt-8 max-w-2xl border border-red-500/70 bg-red-900/20 px-4 py-3 text-center text-xs tracking-[0.12em] text-red-300'>
            {error}
          </p>
        )}

        {!loading && !error && !hasQuery && (
          <p className='mt-8 text-center text-sm tracking-[0.12em] text-zinc-400'>Search for a topic to load system assets.</p>
        )}

        {!loading && !error && hasQuery && results.length === 0 && (
          <p className='mt-8 text-center text-sm tracking-[0.12em] text-zinc-400'>No results found for this query.</p>
        )}

        <div className='mt-11 columns-1 gap-4 space-y-4 sm:columns-2 sm:gap-5 sm:space-y-5 lg:columns-4 lg:gap-6 lg:space-y-6'>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <ResultCard key={`skeleton-${i}`} elem={{}} isLoading heightClass={getHeightClass(i)} />
              ))
            : results.map((res, i) => (
                <ResultCard elem={res} isLoading={false} key={res.id || i} heightClass={getHeightClass(i)} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default ResultGrid;
