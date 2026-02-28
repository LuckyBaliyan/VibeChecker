import React, { useMemo, useState } from 'react';
import Button from './Button';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

const ResultCard = ({ elem, isLoading = false, heightClass = 'h-[280px]' }) => {
  const isVideo = elem.type === 'video';
  const isGifMp4 = elem.type === 'gif' && elem.src?.includes('.mp4');
  const mediaTypeLabel = elem.type === 'photo' ? 'img' : elem.type || 'img';
  const loadingClass = isLoading ? 'animate-pulse' : '';
  const likeKey = useMemo(
    () => `${elem.id || ''}-${elem.src || ''}-${elem.thumbnail || ''}-${elem.title || ''}`,
    [elem.id, elem.src, elem.thumbnail, elem.title]
  );
  const [isLiked, setIsLiked] = useState(() => {
    if (!likeKey || likeKey === '---') return false;
    const likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
    return likedItems.includes(likeKey);
  });

  const addToCollection = (item) => {
    const oldData = JSON.parse(localStorage.getItem('collections')) || [];
    const newData = [...oldData, item];
    localStorage.setItem('collections', JSON.stringify(newData));
  };

  const toggleLike = () => {
    if (!likeKey || likeKey === '---') return;

    const likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
    const nextLiked = !isLiked;
    const nextItems = nextLiked
      ? [...likedItems, likeKey]
      : likedItems.filter((key) => key !== likeKey);

    localStorage.setItem('likedItems', JSON.stringify(nextItems));
    setIsLiked(nextLiked);
  };

  // This might work good but to inhance user experience to a very convenient level i have
  // decided to use a placeHolder image of small size until we load the final image

  /*if (isLoading) {
    return (
      <article className='mb-4 break-inside-avoid overflow-hidden bg-black/60 sm:mb-5 lg:mb-6'>
        <div className={`card-skeleton-glow w-full ${heightClass} bg-zinc-800/80`} />
      </article>
    );
  }*/

  return (
    <article
      className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white 
        shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_26px_rgba(239,63,115,0.16)] sm:mb-5 lg:mb-6 ${loadingClass}`}
    >
      <div className={`relative w-full overflow-hidden rounded-2xl ${heightClass} blur-load`}>
        {isVideo || isGifMp4 ? (
          <video
            src={elem.src}
            poster={elem.thumbnail}
            className='h-full w-full object-cover'
            muted
            autoPlay
            loop
            playsInline
            draggable='true'
            loading='lazy'
          />
        ) : (
          <img
            src={elem.thumbnail || elem.src}
            alt={elem.title}
            className='h-full w-full object-cover'
            loading='lazy'
            draggable='true'
          />
        )}

        <div className='absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <button
          type='button'
          onClick={toggleLike}
          className={`absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center transition-colors`}
          aria-label={isLiked ? 'Unlike card' : 'Like card'}
        >
          {!isLiked ? <HiHeart className='h-8 w-8 fill-zinc-50' /> : <HiOutlineHeart className='h-8 w-8 fill-[#ef3f73] border-0
          outline-0 ring-0' />}
        </button>
          <div className='absolute left-3 top-3 max-w-[72%]'>
            <p className='line-clamp-2 text-lg font-semibold leading-tight text-white  capitalize'>
              {elem.title || 'Untitled'}
            </p>
          </div>

          <div className='absolute inset-x-3 bottom-3 flex items-center justify-between gap-2'>
            <p className='rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white bg-zinc-800'>
              {mediaTypeLabel}
            </p>

            <div className='flex items-center gap-2'>
              <Button
                text='Save'
                className='pointer-events-auto rounded-full border border-[#ef3f73] bg-[#ef3f73] px-3 py-1.5 text-[10px] tracking-[0.08em] text-white hover:bg-transparent hover:text-[#ef3f73]'
                onClick={() => addToCollection(elem)}
              />

              <a
                href={elem.src}
                target='_blank'
                rel='noreferrer'
                className='pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#ef3f73] text-white bg-[#ef3f73]'
                aria-label={isVideo ? 'Download video' : 'Open media source'}
              >
                {isVideo ? (
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
                    <path d='M12 3a.75.75 0 0 1 .75.75v9.19l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72V3.75A.75.75 0 0 1 12 3Z' />
                    <path d='M3.75 14.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 1 1.5 0v3a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18.25v-3a.75.75 0 0 1 .75-.75Z' />
                  </svg>
                ) : (
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
                    <path d='M12.75 3a.75.75 0 0 0 0 1.5h5.69l-8.72 8.72a.75.75 0 1 0 1.06 1.06l8.72-8.72v5.69a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 20.25 3h-7.5Z' />
                    <path d='M5.25 4.5A2.25 2.25 0 0 0 3 6.75v12A2.25 2.25 0 0 0 5.25 21h12a2.25 2.25 0 0 0 2.25-2.25v-5.5a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 1-.75.75h-12a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 0 0-1.5h-5.5Z' />
                  </svg>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResultCard;
