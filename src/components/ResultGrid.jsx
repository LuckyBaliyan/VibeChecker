import React, { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { setQuery, setActiveTab } from '../redux/features/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import ResultCard from './ResultCard';
import Button from './Button';
import { FiUser } from 'react-icons/fi';
import { AiFillThunderbolt } from 'react-icons/ai';
import { useGetPhotosQuery, useGetGifsQuery, useGetVideosQuery } from '../redux/queries/apiSlice';

const tabs = [
  { label: 'IMAGES', value: 'photos' },
  { label: 'GIFS', value: 'gifs' },
  { label: 'VIDEOS', value: 'videos' },
];
const quickTopics = ['Nature', 'Cyberpunk', 'Cars', 'Anime', 'Space', 'Fitness'];

const bentoHeights = [
  'h-[190px]',
  'h-[210px]',
  'h-[235px]',
  'h-[260px]',
  'h-[285px]',
  'h-[315px]',
  'h-[345px]',
  'h-[380px]',
  'h-[420px]',
];

const hashValue = (value) => {
  const str = String(value ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getHeightClass = (index, item) => {
  if (!item) return bentoHeights[index % bentoHeights.length];

  const seed = `${item.id ?? ''}-${item.src ?? ''}-${index}`;
  const hashed = hashValue(seed);
  return bentoHeights[hashed % bentoHeights.length];
};

const ResultGrid = () => {
  const { query, activeTab } = useSelector((store) => store.search);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(query);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('themeMode') === 'dark');
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const photosQuery = useGetPhotosQuery(hasQuery && activeTab === 'photos' ? trimmedQuery : skipToken);
  const gifsQuery = useGetGifsQuery(hasQuery && activeTab === 'gifs' ? trimmedQuery : skipToken);
  const videosQuery = useGetVideosQuery(hasQuery && activeTab === 'videos' ? trimmedQuery : skipToken);

  const activeQueryState =
    activeTab === 'photos' ? photosQuery : activeTab === 'gifs' ? gifsQuery : videosQuery;

  const results = activeQueryState.data || [];
  const loading = activeQueryState.isFetching;
  const error = activeQueryState.error;

  const errorMessage = error
    ? typeof error?.data === 'string'
      ? error.data
      : error?.data?.message || error?.error || 'Network error. Try again.'
    : null;

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const root = document.documentElement;
    const syncThemeFromRoot = () => {
      const isDarkMode = root.getAttribute('data-theme') === 'dark';
      setIsDark(isDarkMode);
    };

    syncThemeFromRoot();

    const observer = new MutationObserver(syncThemeFromRoot);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setQuery(searchValue.trim()));
  };

  const handleQuickSearch = (topic) => {
    setSearchValue(topic);
    dispatch(setQuery(topic));
  };

  const pageBgClass = isDark ? 'bg-[#0f1219]' : 'bg-[#f0f0f3]';
  const layerBgClass = isDark ? 'bg-[#0f1219]/95 border-[#222736]' : 'bg-[#f0f0f3]/95 border-[#e8e8ee]';
  const searchBgClass = isDark ? 'bg-[#161b27] text-zinc-100 placeholder:text-zinc-400' : 'bg-white text-[#171a24] placeholder:text-[#a3a7b2]';
  const tabBaseClass = isDark ? 'border-[#2a3042] bg-[#1a2030] text-zinc-200' : 'border-[#e2e2e6] bg-[#e8e8ec] text-[#1b1b1f]';
  const tabHoverClass = isDark ? 'hover:border-[#ef3f73] hover:text-[#ef7ca0]' : 'hover:border-[#ef3f73] hover:text-[#ef3f73]';

  return (
    <section className={`cyber-page min-h-screen w-full px-3 pb-28 pt-8 sm:px-5 lg:px-8 ${pageBgClass}`}>
      <div className={`fixed left-0 top-0 z-40 w-full border-b backdrop-blur ${layerBgClass}`}>
        <div className='mx-auto w-full px-3 sm:px-5 lg:px-8'>
          <div className='flex items-center gap-3 py-3'>
            <div className='flex  items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#ef3f73] text-sm font-bold text-white'>
                <AiFillThunderbolt className='h-4 w-4' />
              </div>
              <p className={`text-lg font-semibold ${isDark ? 'text-zinc-100' : 'text-[#171a24]'}`}>VibeVault</p>
            </div>

            <form
              onSubmit={submitHandler}
              className={`mx-auto flex h-11 w-full max-w-3xl items-center gap-3 rounded-full px-4 sm:gap-4 sm:px-5 ${searchBgClass}`}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={`h-5 w-5 shrink-0 ${isDark ? 'text-zinc-400' : 'text-[#8a8e98]'}`}>
                <path fillRule='evenodd' d='M10.5 3a7.5 7.5 0 1 0 4.683 13.36l4.228 4.227a.75.75 0 1 0 1.06-1.06l-4.227-4.228A7.5 7.5 0 0 0 10.5 3Zm-6 7.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z' clipRule='evenodd' />
              </svg>

              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder='Search for images, gifs, videos...'
                className='w-full bg-transparent text-sm outline-none'
                type='text'
              />

              <Button
                type='submit'
                text='Search'
                className='min-w-20 rounded-full border border-[#ef3f73] bg-[#ef3f73] px-4 py-1.5 text-[10px] tracking-[0.08em] text-white hover:bg-transparent hover:text-[#ef3f73]'
              />
            </form>

            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e9d4dc] bg-[#ffeef3] text-[#ef3f73]'
                aria-label='User profile'
              >
                <FiUser className='h-4 w-4' />
              </button>
            </div>
          </div>

          <div className='pb-3'>
            <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-3'>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type='button'
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-[#1b1b1f] bg-[#1b1b1f] text-white'
                        : `${tabBaseClass} ${tabHoverClass}`
                    }`}
                    onClick={() => dispatch(setActiveTab(tab.value))}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto w-full max-w-[1320px]'>
        <div className='pt-[136px] sm:pt-[144px]'>

          {errorMessage && (
            <p className='mx-auto mt-8 max-w-2xl rounded-xl border border-red-400/70 bg-red-100 px-4 py-3 text-center text-sm text-red-700'>
              {errorMessage}
            </p>
          )}

          {!loading && !errorMessage && !hasQuery && (
            <div className={`mx-auto mt-10 max-w-2xl rounded-2xl border p-6 text-center ${isDark ? 'border-[#2a3042] bg-[#141a27]' : 'border-[#e3e4eb] bg-white'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-[#4d5568]'}`}>
                Start with a topic to load media.
              </p>
              <p className={`mt-2 text-xs ${isDark ? 'text-zinc-500' : 'text-[#8a90a0]'}`}>
                Try quick picks:
              </p>
              <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    type='button'
                    onClick={() => handleQuickSearch(topic)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isDark
                        ? 'border-[#323a4d] bg-[#1a2030] text-zinc-200 hover:border-[#ef3f73] hover:text-[#ef7ca0]'
                        : 'border-[#d9dce7] bg-[#f7f8fc] text-[#4d5568] hover:border-[#ef3f73] hover:text-[#ef3f73]'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && !errorMessage && hasQuery && results.length === 0 && (
            <p className={`mt-8 text-center text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>No results found for this query.</p>
          )}

          {(loading || hasQuery) && (
            <div className='mt-11 columns-1 gap-4 space-y-4 sm:columns-2 sm:gap-5 sm:space-y-5 lg:columns-4 lg:gap-6 lg:space-y-6'>
              {loading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <ResultCard key={`skeleton-${i}`} elem={{}} isLoading heightClass={getHeightClass(i)} />
                  ))
                : results.map((res, i) => (
                    <ResultCard elem={res} isLoading={false} key={res.id || i} heightClass={getHeightClass(i, res)} />
                  ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultGrid;
