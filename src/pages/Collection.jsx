import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillThunderbolt } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { removeCollection } from '../redux/features/collectionSlice';
import { toggleLikes } from '../redux/features/likeSlice';
import { toast } from 'react-toastify';

const sourceTabs = [
  { label: 'My Saved', value: 'saved' },
  { label: 'Likes', value: 'liked' },
];

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Images', value: 'images' },
  { label: 'GIFs', value: 'gifs' },
  { label: 'Videos', value: 'videos' },
];

const bentoHeights = ['h-[190px]', 'h-[220px]', 'h-[250px]', 'h-[290px]', 'h-[340px]'];

const getMediaKind = (item) => {
  const type = String(item?.type || '').toLowerCase();
  const src = String(item?.src || item?.thumbnail || '').toLowerCase();

  if (type === 'gif') return 'gif';
  if (type === 'video') return 'video';
  if (type === 'photo' || type === 'image') return 'photo';
  if (src.includes('.gif')) return 'gif';
  if (src.includes('.mp4') || src.includes('.webm') || src.includes('.mov')) return 'video';
  return 'photo';
};

const hashValue = (value) => {
  const str = String(value ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const shuffleItems = (list) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getHeightClass = (index, item) => {
  const seed = `${item?.id ?? ''}-${item?.src ?? ''}-${index}`;
  const hashed = hashValue(seed);
  return bentoHeights[hashed % bentoHeights.length];
};

const CollectionMediaCard = ({ item, index, cardClass, onRemove, onOpen }) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  useEffect(() => {
    setIsMediaLoaded(false);
  }, [item?.id, item?.src, item?.thumbnail]);

  const mediaKind = getMediaKind(item);
  const isVideo = mediaKind === 'video' || mediaKind === 'gif';
  const thumb = item?.thumbnail || item?.src;
  const title = item?.title || 'Untitled';
  const heightClass = getHeightClass(index, item);

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      role='button'
      tabIndex={0}
      className={`group mb-3 break-inside-avoid overflow-hidden rounded-2xl transition-all sm:mb-4 lg:mb-5 ${cardClass}`}
    >
      <div className={`relative w-full overflow-hidden ${heightClass} blur-load ${isMediaLoaded ? 'loaded' : ''}`}>
        {isVideo ? (
          <video
            src={item?.src}
            poster={item?.thumbnail}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
            muted
            autoPlay
            loop
            playsInline
            onLoadedData={() => setIsMediaLoaded(true)}
            onCanPlayThrough={() => setIsMediaLoaded(true)}
            onError={() => setIsMediaLoaded(true)}
          />
        ) : (
          <img
            src={thumb}
            alt={title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
            loading='lazy'
            onLoad={() => setIsMediaLoaded(true)}
            onError={() => setIsMediaLoaded(true)}
          />
        )}

        <span className='card-loader' aria-hidden='true' />

        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
          <p className='line-clamp-2 text-xs font-medium text-white'>{title}</p>
          <div className='mt-2 flex items-center gap-2'>
            <a
              href={item?.src}
              target='_blank'
              rel='noreferrer'
              onClick={(e) => e.stopPropagation()}
              className='inline-flex rounded-full border border-[#ef3f73] bg-[#ef3f73] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white'
            >
              Source
            </a>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className='inline-flex rounded-full border border-white/70 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-[#ff6c93] hover:text-[#ff8cab]'
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const Collection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.collections.items);
  const likedItems = useSelector((state) => state.like.likedItems);
  const [activeSource, setActiveSource] = useState(location.state?.source === 'liked' ? 'liked' : 'saved');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDarkTheme, setIsDarkTheme] = useState(() => localStorage.getItem('themeMode') === 'dark');

  const sourceItems = activeSource === 'saved' ? savedItems : likedItems;

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return sourceItems;
    if (activeFilter === 'images') return sourceItems.filter((item) => getMediaKind(item) === 'photo');
    if (activeFilter === 'gifs') return sourceItems.filter((item) => getMediaKind(item) === 'gif');
    return sourceItems.filter((item) => getMediaKind(item) === 'video');
  }, [sourceItems, activeFilter]);

  const bentoItems = useMemo(() => shuffleItems(filteredItems), [filteredItems, activeSource, activeFilter]);

  useEffect(() => {
    if (location.state?.source === 'liked') {
      setActiveSource('liked');
      return;
    }
    if (location.state?.source === 'saved') {
      setActiveSource('saved');
    }
  }, [location.state?.source]);

  useEffect(() => {
    const root = document.documentElement;
    const syncThemeFromRoot = () => {
      setIsDarkTheme(root.getAttribute('data-theme') === 'dark');
    };

    syncThemeFromRoot();
    const observer = new MutationObserver(syncThemeFromRoot);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const handleRemove = (item) => {
    if (activeSource === 'saved') {
      dispatch(removeCollection(item?.id));
      toast.success('Removed from collection');
      return;
    }

    dispatch(toggleLikes(item));
    toast.success('Removed from likes');
  };

  const pageBgClass = isDarkTheme ? 'bg-[#0f1219]' : 'bg-[#f1f1f4]';
  const headerClass = isDarkTheme ? 'bg-[#0f1219]/95 border-[#222736]' : 'bg-[#f1f1f4]/95 border-[#e7e9f0]';
  const textPrimaryClass = isDarkTheme ? 'text-zinc-100' : 'text-[#171a24]';
  const textMutedClass = isDarkTheme ? 'text-zinc-400' : 'text-[#8a8ea0]';
  const filterWrapClass = isDarkTheme ? 'bg-[#1a2030]' : 'bg-[#eceef3]';
  const filterIdleClass = isDarkTheme ? 'text-zinc-300 hover:bg-[#232b3f]' : 'text-[#70778a] hover:bg-[#dee2ea]';
  const cardClass = isDarkTheme ? 'bg-[#141a27] shadow-[0_8px_22px_rgba(0,0,0,0.28)]' : 'bg-white shadow-[0_8px_22px_rgba(0,0,0,0.07)]';
  const actionBtnClass = isDarkTheme ? 'border-[#2b3346] bg-[#181f2d] text-zinc-200 hover:border-[#ef3f73] hover:text-[#ef3f73]' : 'border-[#d7dbe6] bg-white text-[#3e4558] hover:border-[#ef3f73] hover:text-[#ef3f73]';

  return (
    <section className={`min-h-screen px-3 pb-28 pt-8 sm:px-5 lg:px-8 ${pageBgClass}`}>
      <div className='mx-auto w-full max-w-[1320px]'>
        <div className={`fixed left-0 top-0 z-40 w-full border-b backdrop-blur ${headerClass}`}>
          <div className='mx-auto w-full max-w-[1320px] px-3 py-3 sm:px-5 lg:px-8'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#ef3f73] text-sm font-bold text-white'>
                  <AiFillThunderbolt className='h-4 w-4' />
                </div>
                <p className={`text-lg font-semibold ${textPrimaryClass}`}>VibeVault</p>
              </div>

              <button
                type='button'
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${actionBtnClass}`}
                aria-label='User profile'
              >
                <FiUser className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>

        <div className='pt-[82px] sm:pt-[88px]'>
          <div className='mb-5 flex flex-wrap items-center justify-between gap-4 sm:mb-6'>
            <div className='flex items-center gap-5'>
              {sourceTabs.map((tab) => {
                const isActive = tab.value === activeSource;
                return (
                  <button
                    key={tab.value}
                    type='button'
                    onClick={() => setActiveSource(tab.value)}
                    className={`border-b-2 pb-1 text-sm font-medium transition-colors ${
                      isActive ? 'border-[#ef3f73] text-[#ef3f73]' : `border-transparent ${textMutedClass} hover:text-[#4f5564]`
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className={`flex flex-wrap items-center gap-2 rounded-xl p-1 ${filterWrapClass}`}>
              {filterTabs.map((tab) => {
                const isActive = tab.value === activeFilter;
                return (
                  <button
                    key={tab.value}
                    type='button'
                    onClick={() => setActiveFilter(tab.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive ? 'bg-[#11131a] text-white' : filterIdleClass
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {bentoItems.length === 0 ? (
            <div className={`rounded-2xl border p-10 text-center ${isDarkTheme ? 'border-[#2a3042] bg-[#141a27]' : 'border-[#e5e7ef] bg-white'}`}>
              <p className={`text-sm ${isDarkTheme ? 'text-zinc-400' : 'text-[#5f6674]'}`}>No items found for this tab and filter.</p>
              <button
                type='button'
                onClick={() => navigate('/browse')}
                className='mt-4 rounded-full border border-[#ef3f73] bg-[#ef3f73] px-4 py-2 text-xs text-white transition-colors hover:bg-transparent hover:text-[#ef3f73]'
              >
                Browse Media
              </button>
            </div>
          ) : (
            <div className='columns-1 gap-3 space-y-3 sm:columns-2 sm:gap-4 sm:space-y-4 lg:columns-3 lg:gap-5 lg:space-y-5'>
              {bentoItems.map((item, index) => {
                return (
                  <CollectionMediaCard
                    key={`${item?.id || 'item'}-${index}`}
                    item={item}
                    index={index}
                    cardClass={cardClass}
                    onOpen={() => navigate(`/media/${encodeURIComponent(item?.id || 'preview')}`, { state: { item } })}
                    onRemove={() => handleRemove(item)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Collection;
