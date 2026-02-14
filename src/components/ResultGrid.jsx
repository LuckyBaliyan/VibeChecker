import React, { useEffect, useRef } from 'react';
import { fetchAssets, fetchVideos, fetchGifs } from '../api/mediaApi';
import { setLoading, setError, setResults, clearResults, setQuery } from '../redux/features/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import ResultCard from './ResultCard';

const ResultGrid = () => {
  const { query, activeTab, results, loading, error } = useSelector((store) => store.search);
  const dispatch = useDispatch();
  const loadingTimeoutRef = useRef(null);

  const clearLoadingTimer = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  const getData = async () => {
    clearLoadingTimer();

    if (!query.trim()) {
      dispatch(clearResults());
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(true));

    try {
      let finalData = [];

      if (activeTab === 'photos') {
        finalData = await fetchAssets(query);
      } else if (activeTab === 'videos') {
        finalData = await fetchVideos(query);
      } else if (activeTab === 'gifs') {
        finalData = await fetchGifs(query);
      }

      dispatch(setResults(finalData));

      loadingTimeoutRef.current = setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    } catch (err) {
      dispatch(setError(err.message || 'Something went wrong'));
    }
  };

  useEffect(() => {
    getData();

    return () => {
      clearLoadingTimer();
    };
  }, [query, activeTab]);

  const hasQuery = query.trim().length > 0;
  const tabLabel = activeTab === 'gifs' ? 'GIFs' : activeTab === 'videos' ? 'videos' : 'photos';

  const suggestionsByTab = {
    photos: ['anime wallpaper', 'neon city', 'streetwear'],
    gifs: ['funny reaction', 'sigma meme', 'cringe'],
    videos: ['gym motivation', 'football edit', 'cinematic b-roll'],
  };

  const suggestions = suggestionsByTab[activeTab] || [];

  return (
    <section className='w-full mt-50 px-3 pb-8 sm:px-6 lg:px-10'>
      {error && <p className='py-8 text-center text-red-400'>{error}</p>}

      {!loading && !error && !hasQuery && (
        <p className='py-10 text-center text-zinc-400'>Search for a topic to see results.</p>
      )}

      {!loading && !error && hasQuery && results.length === 0 && (
        <div className='mx-auto mt-6 max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-center'>
          <div className='relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800'>
            <span className='absolute h-14 w-14 animate-ping rounded-full bg-zinc-700/40' />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='relative h-6 w-6 animate-bounce text-white'
            >
              <path
                fillRule='evenodd'
                d='M10.5 3a7.5 7.5 0 1 0 4.683 13.36l4.228 4.227a.75.75 0 1 0 1.06-1.06l-4.227-4.228A7.5 7.5 0 0 0 10.5 3Zm-6 7.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          <p className='text-sm font-semibold text-white'>No {tabLabel} found for "{query}"</p>
          <p className='mt-1 text-xs text-zinc-400'>Try one of these quick searches:</p>

          <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
            {suggestions.map((term) => (
              <button
                key={term}
                type='button'
                onClick={() => dispatch(setQuery(term))}
                className='rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-200 transition-colors hover:bg-zinc-700'
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {!error && results.length > 0 && (
        <div className='columns-2 gap-3 sm:columns-2 sm:gap-5 lg:columns-4 xl:columns-5'>
          {results.map((res, i) => (
            <ResultCard elem={res} index={i} isLoading={loading} key={res.id || i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ResultGrid;
