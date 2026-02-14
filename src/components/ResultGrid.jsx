import React, { useEffect } from 'react';
import { fetchAssets, fetchVideos, fetchGifs } from '../api/mediaApi';
import { setLoading, setError, setResults, clearResults } from '../redux/features/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import ResultCard from './ResultCard';

const ResultGrid = () => {
  const { query, activeTab, results, loading, error } = useSelector((store) => store.search);
  const dispatch = useDispatch();

  const getData = async () => {
    if (!query.trim()) {
      dispatch(clearResults());
      return;
    }

    dispatch(setLoading());

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
    } catch (err) {
      dispatch(setError(err.message || 'Something went wrong'));
    }
  };

  useEffect(() => {
    getData();
  }, [query, activeTab]);

  return (
    <section className='w-full px-3 pb-8 sm:px-6 lg:px-10'>
      {loading && <p className='py-8 text-center text-zinc-300'>Loading...</p>}
      {error && <p className='py-8 text-center text-red-400'>{error}</p>}

      {!loading && !error && results.length > 0 && (
        <div className='columns-2 gap-3 sm:columns-2 sm:gap-5 lg:columns-4 xl:columns-5'>
          {results.map((res, i) => (
            <ResultCard elem={res} index={i} key={res.id || i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ResultGrid;
